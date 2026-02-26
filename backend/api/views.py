import random
import time
import requests
import threading
import json
import os
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import PhoneMap, Subscription, Review, Reservation
from .serializers import PhoneMapSerializer, SubscriptionSerializer, ReviewSerializer, ReservationSerializer

# --- Configuration & Global State ---
DEFAULT_BOT_TOKEN = ""  # Telegram bot token removed for security (use environment variables)
ESKIZ_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "eskiz_settings.json")

pending_codes = {}  # {phone: code}
user_sessions = {}
eskiz_token_cache = {"token": None, "expires_at": 0}
bot_threads = set()

BOT_MENU = {
    "BURGERS": [
        {"id": 1, "name": "Black Star Special", "price": 14.99},
        {"id": 2, "name": "Cheese Burger", "price": 7.50},
        {"id": 3, "name": "Bacon Burger", "price": 8.50},
        {"id": 31, "name": "Mexican Spicy", "price": 9.99},
    ],
    "SIDES": [
        {"id": 4, "name": "French Fries", "price": 4.00},
        {"id": 5, "name": "Onion Rings", "price": 5.50},
        {"id": 8, "name": "Chicken Wings", "price": 9.00},
    ],
    "DRINKS": [
        {"id": 6, "name": "Coca Cola", "price": 2.50},
        {"id": 7, "name": "Milkshake", "price": 4.50},
        {"id": 13, "name": "Mineral Water", "price": 1.00},
    ]
}

# --- Helper Functions ---

def load_eskiz_settings():
    if os.path.exists(ESKIZ_FILE):
        try:
            with open(ESKIZ_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def get_eskiz_token(email, password):
    global eskiz_token_cache
    if eskiz_token_cache["token"] and time.time() < eskiz_token_cache["expires_at"]:
        return eskiz_token_cache["token"]
    try:
        url = "https://notify.eskiz.uz/api/auth/login"
        res = requests.post(url, data={"email": email, "password": password})
        if res.status_code == 200:
            data = res.json()
            token = data['data']['token']
            eskiz_token_cache = {"token": token, "expires_at": time.time() + 2500000}
            return token
    except Exception as e:
        print(f"Error getting Eskiz token: {e}")
        return None

def send_tg(bot_token, chat_id, text, reply_markup=None):
    if not bot_token or not chat_id:
        return False
    payload = {"chat_id": str(chat_id), "text": text, "parse_mode": "HTML"}
    if reply_markup:
        payload["reply_markup"] = reply_markup
    try:
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        res = requests.post(url, json=payload, timeout=10)
        return res.status_code == 200
    except Exception:
        return False

# --- Bot Polling Logic ---

def bot_polling(bot_token):
    if not bot_token or bot_token in bot_threads:
        return
    bot_threads.add(bot_token)
    
    print(f"Bot polling started for token: {bot_token[:15]}...")
    offset = 0
    while True:
        try:
            url = f"https://api.telegram.org/bot{bot_token}/getUpdates?offset={offset}&timeout=30"
            res = requests.get(url, timeout=35)
            if res.status_code == 200:
                updates = res.json().get("result", [])
                for update in updates:
                    offset = update["update_id"] + 1
                    
                    if "callback_query" in update:
                        cb = update["callback_query"]
                        chat_id = cb["message"]["chat"]["id"]
                        data = cb["data"]
                        
                        if chat_id not in user_sessions:
                            user_sessions[chat_id] = {"cart": [], "step": "start"}
                        
                        is_verified = PhoneMap.objects.filter(chat_id=str(chat_id)).exists()
                        if not is_verified and data != "order_start":
                            send_tg(bot_token, chat_id, "⚠️ Iltimos, oldin telefon raqamingizni tasdiqlang!")
                            continue

                        if data.startswith("cat_"):
                            cat = data.split("_")[1]
                            items = BOT_MENU.get(cat, [])
                            kb = {"inline_keyboard": [[{"text": f"{it['name']} - ${it['price']}", "callback_data": f"add_{it['id']}"}] for it in items]}
                            kb["inline_keyboard"].append([{"text": "⬅️ Orqaga", "callback_data": "order_start"}])
                            send_tg(bot_token, chat_id, f"<b>{cat}</b> bo'limi:\nTanlang:", kb)
                        elif data.startswith("add_"):
                            item_id = int(data.split("_")[1])
                            found = next((it for cat in BOT_MENU for it in BOT_MENU[cat] if it["id"] == item_id), None)
                            if found:
                                user_sessions[chat_id]["cart"].append(found)
                                total = sum(i["price"] for i in user_sessions[chat_id]["cart"])
                                kb = {"inline_keyboard": [[{"text": "🛒 Savatcha", "callback_data": "view_cart"}], [{"text": "➕ Yana", "callback_data": "order_start"}], [{"text": "🚀 Buyurtma", "callback_data": "checkout"}]]}
                                send_tg(bot_token, chat_id, f"✅ <b>{found['name']}</b> qo'shildi!\nSumma: <b>${total:.2f}</b>", kb)
                        elif data == "view_cart":
                            cart = user_sessions[chat_id]["cart"]
                            if not cart:
                                send_tg(bot_token, chat_id, "Savatchangiz bo'sh!", {"inline_keyboard": [[{"text": "🛍 Menyu", "callback_data": "order_start"}]]})
                            else:
                                text = "🛒 <b>Savatchangiz:</b>\n\n" + "\n".join([f"{i+1}. {it['name']} - ${it['price']}" for i, it in enumerate(cart)]) + f"\n\n💰 Jami: <b>${sum(i['price'] for i in cart):.2f}</b>"
                                kb = {"inline_keyboard": [[{"text": "❌ Tozalash", "callback_data": "clear_cart"}, {"text": "🚀 Davom etish", "callback_data": "checkout"}], [{"text": "⬅️ Menyu", "callback_data": "order_start"}]]}
                                send_tg(bot_token, chat_id, text, kb)
                        elif data == "clear_cart":
                            user_sessions[chat_id]["cart"] = []
                            send_tg(bot_token, chat_id, "Savatcha tozalandi!", {"inline_keyboard": [[{"text": "🛍 Menyu", "callback_data": "order_start"}]]})
                        elif data == "checkout":
                            user_sessions[chat_id]["step"] = "wait_address"
                            send_tg(bot_token, chat_id, "📍 Yetkazib berish manzilini yuboring:")
                        elif data == "order_start":
                            kb = {"inline_keyboard": [[{"text": f"🍔 {cat}", "callback_data": f"cat_{cat}"}] for cat in BOT_MENU]}
                            send_tg(bot_token, chat_id, "<b>MENYU</b>\nBo'limni tanlang:", kb)
                        requests.post(f"https://api.telegram.org/bot{bot_token}/answerCallbackQuery", json={"callback_query_id": cb["id"]})
                        continue

                    msg = update.get("message", {})
                    chat_id = msg.get("chat", {}).get("id")
                    if not chat_id:
                        continue
                    if chat_id not in user_sessions:
                        user_sessions[chat_id] = {"cart": [], "step": "start"}
                    text = msg.get("text", "")

                    if user_sessions[chat_id].get("step") == "wait_verification":
                        if text == user_sessions[chat_id].get("code"):
                            phone = user_sessions[chat_id].get("phone")
                            PhoneMap.objects.update_or_create(phone=phone, defaults={'chat_id': str(chat_id)})
                            user_sessions[chat_id]["step"] = "start"
                            kb = {"keyboard": [[{"text": "🛍 Saytdan buyurtma", "web_app": {"url": "https://blackstarburger.uz"}}], [{"text": "🛍 Buyurtma"}, {"text": "📦 Buyurtmalarim"}], [{"text": "ℹ️ Ma'lumot"}, {"text": "⚙️ Sozlamalar"}]], "resize_keyboard": True}
                            send_tg(bot_token, chat_id, f"✅ Raqamingiz ({phone}) tasdiqlandi!", kb)
                        else:
                            send_tg(bot_token, chat_id, "❌ Noto'g'ri kod! Qayta urinib ko'ring:")
                        continue

                    if user_sessions[chat_id].get("step") == "wait_address":
                        user_sessions[chat_id]["address"] = text
                        user_sessions[chat_id]["step"] = "done"
                        cart = user_sessions[chat_id]["cart"]
                        total = sum(i["price"] for i in cart)
                        items_str = "\n".join([f"- {i['name']}" for i in cart])
                        send_tg(bot_token, chat_id, f"🏁 <b>Buyurtma tayyor!</b>\n\n📦 Tarkibi:\n{items_str}\n💰 Jami: <b>${total:.2f}</b>\n📍 Manzil: {text}")
                        user_sessions[chat_id] = {"cart": [], "step": "start"}
                        continue

                    if text.startswith("/start"):
                        is_verified = PhoneMap.objects.filter(chat_id=str(chat_id)).exists()
                        if "verify" in text:
                            kb = {"keyboard": [[{"text": "📞 Raqamni yuborish", "request_contact": True}]], "resize_keyboard": True}
                            send_tg(bot_token, chat_id, "Siz saytdan tasdiqlash uchun keldingiz. Iltimos, raqamingizni yuboring va men sizga kodni ko'rsataman:", kb)
                            continue

                        if is_verified:
                            kb = {"keyboard": [[{"text": "🛍 Saytdan buyurtma", "web_app": {"url": "https://blackstarburger.uz"}}], [{"text": "🛍 Buyurtma"}, {"text": "📦 Buyurtmalarim"}], [{"text": "ℹ️ Ma'lumot"}, {"text": "⚙️ Sozlamalar"}]], "resize_keyboard": True}
                            send_tg(bot_token, chat_id, "Xush kelibsiz! Marhamat, menyudan foydalaning:", kb)
                        else:
                            kb = {"keyboard": [[{"text": "📞 Raqamni tasdiqlash", "request_contact": True}]], "resize_keyboard": True}
                            send_tg(bot_token, chat_id, "Xush kelibsiz! Davom etish uchun raqamingizni tasdiqlang:", kb)
                        continue

                    phone = None
                    if text and text.replace("+", "").isdigit() and len(text.replace("+", "")) >= 9:
                        phone = text.replace("+", "")
                        if len(phone) == 9:
                            phone = "998" + phone
                    elif "contact" in msg:
                        phone = "".join(filter(str.isdigit, msg["contact"]["phone_number"]))

                    if phone:
                        p_str = str(phone)
                        if p_str in pending_codes:
                            web_code = pending_codes[p_str]
                            PhoneMap.objects.update_or_create(phone=p_str, defaults={'chat_id': str(chat_id)})
                            kb = {"keyboard": [[{"text": "🛍 Saytdan buyurtma", "web_app": {"url": "https://blackstarburger.uz"}}], [{"text": "🛍 Buyurtma"}, {"text": "📦 Buyurtmalarim"}], [{"text": "ℹ️ Ma'lumot"}, {"text": "⚙️ Sozlamalar"}]], "resize_keyboard": True}
                            send_tg(bot_token, chat_id, f"✅ Sayt uchun tasdiqlash kodingiz: <code>{web_code}</code>\n\nRaqamingiz botda ham tasdiqlandi! Endi saytga qaytib kodni kiriting.", kb)
                            del pending_codes[p_str]
                            continue

                        code = str(random.randint(1000, 9999))
                        user_sessions[chat_id].update({"step": "wait_verification", "phone": phone, "code": code})
                        eskiz = load_eskiz_settings()
                        sms_sent = False
                        if eskiz.get("email") and eskiz.get("password"):
                            token = get_eskiz_token(eskiz["email"], eskiz["password"])
                            if token:
                                res_sms = requests.post("https://notify.eskiz.uz/api/message/sms/send", headers={"Authorization": f"Bearer {token}"}, data={"mobile_phone": phone, "message": f"Kod: {code}", "from": "4546"})
                                if res_sms.status_code == 200:
                                    sms_sent = True
                        intro = f"🔢 +{phone} ga kod yuborildi." if sms_sent else f"🔢 Kod: <code>{code}</code> (SMS tizimi ulanmagan)"
                        send_tg(bot_token, chat_id, f"{intro}\nKodni kiriting:")
                        continue

                    if text == "🛍 Buyurtma":
                        send_tg(bot_token, chat_id, "Tanlang:", {"inline_keyboard": [[{"text": "🍔 Menyu", "callback_data": "order_start"}]]})
                    elif text == "ℹ️ Ma'lumot":
                        send_tg(bot_token, chat_id, "📍 Manzil: Toshkent\n📞 Tel: +998 71 200 00 00")
                    elif text == "⚙️ Sozlamalar":
                        pmap = PhoneMap.objects.filter(chat_id=str(chat_id)).first()
                        p = pmap.phone if pmap else "Yo'q"
                        send_tg(bot_token, chat_id, f"⚙️ Sozlamalar\nRaqamingiz: +{p}\nHolat: Tasdiqlangan ✅")

            elif res.status_code == 409:
                time.sleep(5)
            time.sleep(1)
        except Exception as e:
            print(f"Polling error: {e}")
            time.sleep(5)

# --- API View Functions ---

@api_view(['GET'])
def home(request):
    # Start bot polling on first visit if not already started
    if DEFAULT_BOT_TOKEN and DEFAULT_BOT_TOKEN not in bot_threads:
        threading.Thread(target=bot_polling, args=(DEFAULT_BOT_TOKEN,), daemon=True).start()
    return Response({"status": "ok", "message": "Fast Food SMS & Order Service is running on Django!"})

@api_view(['POST'])
def send_verification(request):
    data = request.data
    phone = "".join(filter(str.isdigit, str(data.get('phone', ''))))
    if len(phone) == 9: phone = "998" + phone
    if phone.startswith("8") and len(phone) == 11: phone = "998" + phone[1:]
    
    code = str(data.get('code', ''))
    bot_token = data.get('bot_token') or DEFAULT_BOT_TOKEN
    
    pending_codes[phone] = code
    results = {"telegram_user": "not_found", "sms": "pending"}
    msg = data.get('message') or f"🔐 Sayt uchun tasdiqlash kodingiz: <code>{code}</code>"
    
    # Check if linked in DB
    pmap = PhoneMap.objects.filter(phone=phone).first()
    if pmap:
        if send_tg(bot_token, pmap.chat_id, msg):
            results["telegram_user"] = "sent"
        else:
            results["telegram_user"] = "error"
    
    # SMS Fallback
    eskiz = load_eskiz_settings()
    email = data.get('email') or eskiz.get('email')
    password = data.get('password') or eskiz.get('password')
    
    if email and password:
        token = get_eskiz_token(email, password)
        if token:
            res = requests.post("https://notify.eskiz.uz/api/message/sms/send", headers={"Authorization": f"Bearer {token}"}, data={"mobile_phone": phone, "message": f"Kod: {code}", "from": "4546"})
            results["sms"] = "sent" if res.status_code == 200 else f"error: {res.text}"
    else:
        results["sms"] = "skipped: No credentials"
        
    return Response(results)

@api_view(['POST'])
def send_message(request):
    phone = "".join(filter(str.isdigit, str(request.data.get('phone', ''))))
    text = request.data.get('text', '')
    bot_token = request.data.get('bot_token') or DEFAULT_BOT_TOKEN
    
    pmap = PhoneMap.objects.filter(phone=phone).first()
    if pmap:
        send_tg(bot_token, pmap.chat_id, text)
        return Response({"status": "sent"})
    return Response({"status": "user_not_found"})

@api_view(['GET'])
def get_customers(request):
    maps = PhoneMap.objects.all()
    data = {m.phone: m.chat_id for m in maps}
    return Response(data)

@api_view(['POST'])
def broadcast(request):
    msg = request.data.get('message', '')
    bot_token = request.data.get('bot_token') or DEFAULT_BOT_TOKEN
    unique_chats = set(PhoneMap.objects.values_list('chat_id', flat=True))
    
    success, failed = 0, 0
    for chat_id in unique_chats:
        if send_tg(bot_token, chat_id, msg):
            success += 1
        else:
            failed += 1
    return Response({"success": success, "failed": failed})

@api_view(['GET'])
def check_phone(request, phone):
    p = "".join(filter(str.isdigit, phone))
    if len(p) == 9: p = "998" + p
    exists = PhoneMap.objects.filter(phone=p).exists()
    return Response({"linked": exists, "phone": p})

@api_view(['GET', 'POST'])
def subscriptions(request):
    if request.method == 'POST':
        serializer = SubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "ok", "sub_id": serializer.data['id']})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    subs = Subscription.objects.all().order_by('-created_at')
    serializer = SubscriptionSerializer(subs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def sub_action(request):
    data = request.data
    sub_id = data.get('id')
    new_status = data.get('status')
    bot_token = data.get('bot_token') or DEFAULT_BOT_TOKEN
    
    sub = Subscription.objects.filter(id=sub_id).first()
    if not sub:
        return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        
    sub.status = new_status
    sub.save()
    
    if new_status == "confirmed":
        p = "".join(filter(str.isdigit, sub.phone))
        if len(p) == 9:
            p = "998" + p
        pmap = PhoneMap.objects.filter(phone=p).first()
        if pmap:
            msg = f"✅ <b>TABRIKLAYMIZ!</b>\n\nSizning <b>{sub.plan_name}</b> ({sub.duration}) abonementingiz tasdiqlandi!\n🎁 Sovg'angiz: <b>{sub.gift}</b>\n\nEndi har bir buyurtmada imtiyozlaringizdan foydalanishingiz mumkin."
            send_tg(bot_token, pmap.chat_id, msg)
            
    return Response({"status": "ok"})

@api_view(['GET', 'POST'])
def reviews(request):
    if request.method == 'POST':
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            review = serializer.save()
            bot_token = request.data.get('bot_token') or DEFAULT_BOT_TOKEN
            # Notify Chat ID (Admin) - for now using a placeholder or we can use the first chat_id in PhoneMap as admin
            # Better to use a specific ADMIN_CHAT_ID but we'll try to find one
            admin_chat = PhoneMap.objects.first()
            if admin_chat:
                msg = f"📸 <b>YANGI SHARH!</b>\n\n👤 Ism: {review.name}\n📞 Tel: {review.phone}\n⭐ Reyting: {review.rating}/5\n💬 Sharh: {review.comment}"
                send_tg(bot_token, admin_chat.chat_id, msg)
            return Response({"status": "ok", "id": review.id})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    reviews = Review.objects.filter(status='approved').order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def reservations(request):
    if request.method == 'POST':
        serializer = ReservationSerializer(data=request.data)
        if serializer.is_valid():
            res = serializer.save()
            bot_token = request.data.get('bot_token') or DEFAULT_BOT_TOKEN
            admin_chat = PhoneMap.objects.first()
            if admin_chat:
                comment_text = res.comment if res.comment else "Yo'q"
                msg = f"📅 <b>YANGI BAND QILISH!</b>\n\n👤 Ism: {res.name}\n📞 Tel: {res.phone}\n👥 Mehmonlar: {res.guests}\n🗓 Sana: {res.date}\n⏰ Vaqt: {res.time}\n💬 Izoh: {comment_text}"
                send_tg(bot_token, admin_chat.chat_id, msg)
            return Response({"status": "ok", "id": res.id})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    res_list = Reservation.objects.all().order_by('-created_at')
    serializer = ReservationSerializer(res_list, many=True)
    return Response(serializer.data)
@api_view(['POST'])
def res_action(request):
    res_id = request.data.get('id')
    new_status = request.data.get('status') # confirmed, cancelled
    bot_token = request.data.get('bot_token') or DEFAULT_BOT_TOKEN
    
    res = Reservation.objects.filter(id=res_id).first()
    if not res:
        return Response({"error": "Not found"}, status=404)
        
    res.status = new_status
    res.save()
    
    # Notify user if possible (requires PhoneMap)
    p = "".join(filter(str.isdigit, res.phone))
    if len(p) == 9:
        p = "998" + p
    pmap = PhoneMap.objects.filter(phone=p).first()
    
    if pmap:
        if new_status == "confirmed":
            msg = f"✅ <b>STOL BAND QILISH TASDIQLANDI!</b>\n\n👤 Ism: {res.name}\n🗓 Sana: {res.date}\n⏰ Vaqt: {res.time}\n👥 Mehmonlar: {res.guests}\n\nSizni kutib qolamiz! 😊"
        elif new_status == "cancelled":
            msg = f"❌ <b>STOL BAND QILISH BEKOR QILINDI</b>\n\nUzr so'raymiz, ko'rsatilgan vaqtda joylarimiz band ekan. Boshqa vaqtni tanlab ko'rishingizni iltimos qilamiz."
        
        send_tg(bot_token, pmap.chat_id, msg)
            
    return Response({"status": "ok"})
