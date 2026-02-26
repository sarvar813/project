from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import time
import json
import os
import threading
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "ok", "message": "Fast Food SMS & Order Service is running!"}

DEFAULT_BOT_TOKEN = "" # Telegram bot token removed for security (use environment variables)

# Eskiz sozlamalarini saqlash
ESKIZ_FILE = os.path.join(os.path.dirname(__file__), "eskiz_settings.json")
def save_eskiz_settings(email, password):
    with open(ESKIZ_FILE, "w") as f:
        json.dump({"email": email, "password": password}, f)

def load_eskiz_settings():
    if os.path.exists(ESKIZ_FILE):
        try:
            with open(ESKIZ_FILE, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading eskiz settings: {e}")
            return {}
    return {}

# Curated Bot Menu
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

user_sessions = {}
pending_codes = {} # {phone: code}
eskiz_token = {"token": None, "expires_at": 0}

class SMSRequest(BaseModel):
    phone: str
    code: str
    message: str = None
    email: str = None
    password: str = None
    bot_token: str = None
    chat_id: str = None

def get_eskiz_token(email, password):
    global eskiz_token
    if eskiz_token["token"] and time.time() < eskiz_token["expires_at"]:
        return eskiz_token["token"]
    try:
        url = "https://notify.eskiz.uz/api/auth/login"
        res = requests.post(url, data={"email": email, "password": password})
        if res.status_code == 200:
            data = res.json()
            token = data['data']['token']
            eskiz_token = {"token": token, "expires_at": time.time() + 2500000}
            return token
    except Exception as e:
        print(f"Error getting Eskiz token: {e}")
        return None

phone_to_chat_id = {}
PHONE_MAP_FILE = os.path.join(os.path.dirname(__file__), "phone_to_chat_id.json")

if os.path.exists(PHONE_MAP_FILE):
    try:
        with open(PHONE_MAP_FILE, "r") as f:
            phone_to_chat_id = json.load(f)
    except Exception as e:
        print(f"Error loading phone map: {e}")
        phone_to_chat_id = {}
else:
    phone_to_chat_id = {}

def save_phone_map():
    with open(PHONE_MAP_FILE, "w") as f:
        json.dump(phone_to_chat_id, f, indent=4)

# Subscription Storage (In-Memory as requested)
subscriptions_memory = []

def load_subs():
    return subscriptions_memory

def save_subs(subs):
    global subscriptions_memory
    subscriptions_memory = subs

class SubRequest(BaseModel):
    phone: str
    plan_name: str
    duration: str
    price: str
    gift: str

class SubAction(BaseModel):
    id: int
    status: str # 'confirmed' or 'rejected'
    bot_token: str

def send_tg(bot_token, chat_id, text, reply_markup=None):
    if not bot_token or not chat_id:
        print(f"[REASON] Token or ChatID missing. Token len: {len(bot_token) if bot_token else 0}, ID: {chat_id}")
        return False
    payload = {"chat_id": str(chat_id), "text": text, "parse_mode": "HTML"}
    if reply_markup:
        payload["reply_markup"] = reply_markup
    try:
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        print(f"[DEBUG] TG URL: {url[:30]}... To: {chat_id}")
        res = requests.post(url, json=payload, timeout=10)
        if res.status_code == 200:
            print(f"[SUCCESS] Message sent to {chat_id}")
            return True
        else:
            print(f"[ERROR] TG API error: {res.status_code} - {res.text}")
            return False
    except Exception as e:
        print(f"[EXCEPTION] send_tg: {e}")
        return False

bot_threads = set()

def bot_polling(bot_token):
    if not bot_token or bot_token in bot_threads:
        return
    bot_threads.add(bot_token)
    
    print(f"\n[DEBUG] Telegram bot polling boshlandi... Token: {bot_token[:15]}***")
    offset = 0
    while True:
        try:
            url = f"https://api.telegram.org/bot{bot_token}/getUpdates?offset={offset}&timeout=30"
            res = requests.get(url, timeout=35)
            if res.status_code == 200:
                updates = res.json().get("result", [])
                for update in updates:
                    offset = update["update_id"] + 1
                    print(f"[BOT] Update: {update['update_id']}")
                    
                    if "callback_query" in update:
                        cb = update["callback_query"]
                        chat_id = cb["message"]["chat"]["id"]
                        data = cb["data"]
                        print(f"[BOT] Callback: {data} from {chat_id}")
                        if chat_id not in user_sessions:
                            user_sessions[chat_id] = {"cart": [], "step": "start"}
                        
                        is_verified = any(str(cid) == str(chat_id) for cid in phone_to_chat_id.values())
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
                    print(f"[BOT] Message from {chat_id}: text='{text}', has_contact={'contact' in msg}")

                    if user_sessions[chat_id].get("step") == "wait_verification":
                        print(f"[BOT] User {chat_id} is in wait_verification step")
                        if text == user_sessions[chat_id].get("code"):
                            phone = user_sessions[chat_id].get("phone")
                            phone_to_chat_id[phone] = chat_id
                            save_phone_map()
                            user_sessions[chat_id]["step"] = "start"
                            kb = {"keyboard": [[{"text": "🛍 Saytdan buyurtma", "web_app": {"url": "https://blackstarburger.uz"}}], [{"text": "🛍 Buyurtma"}, {"text": "📦 Buyurtmalarim"}], [{"text": "ℹ️ Ma'lumot"}, {"text": "⚙️ Sozlamalar"}]], "resize_keyboard": True}
                            send_tg(bot_token, chat_id, f"✅ Raqamingiz ({phone}) tasdiqlandi!", kb)
                            print(f"[BOT] User {chat_id} verified via code")
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
                        print(f"[BOT] Start command detected: {text}")
                        is_verified = any(str(cid) == str(chat_id) for cid in phone_to_chat_id.values())
                        if "verify" in text:
                            kb = {"keyboard": [[{"text": "📞 Raqamni yuborish", "request_contact": True}]], "resize_keyboard": True}
                            send_tg(bot_token, chat_id, "Siz saytdan tasdiqlash uchun keldingiz. Iltimos, raqamingizni yuboring va men sizga kodni ko'rsataman:", kb)
                            print(f"[BOT] Sent verification prompt to {chat_id}")
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
                        print(f"[BOT] Extracted phone from text: {phone}")
                    elif "contact" in msg:
                        phone = "".join(filter(str.isdigit, msg["contact"]["phone_number"]))
                        print(f"[BOT] Extracted phone from contact: {phone}")

                    if phone:
                        p_str = str(phone)
                        print(f"[BOT] Checking pending_codes for: {p_str}. Available: {list(pending_codes.keys())}")
                        if p_str in pending_codes:
                            web_code = pending_codes[p_str]
                            phone_to_chat_id[p_str] = chat_id
                            save_phone_map()
                            kb = {"keyboard": [[{"text": "🛍 Saytdan buyurtma", "web_app": {"url": "https://blackstarburger.uz"}}], [{"text": "🛍 Buyurtma"}, {"text": "📦 Buyurtmalarim"}], [{"text": "ℹ️ Ma'lumot"}, {"text": "⚙️ Sozlamalar"}]], "resize_keyboard": True}
                            send_tg(bot_token, chat_id, f"✅ Sayt uchun tasdiqlash kodingiz: <code>{web_code}</code>\n\nRaqamingiz botda ham tasdiqlandi! Endi saytga qaytib kodni kiriting.", kb)
                            print(f"[BOT] Sent pending code {web_code} to {p_str}")
                            del pending_codes[p_str]
                            continue
                        else:
                            print(f"[BOT] Phone {p_str} not in pending_codes")

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
                        if sms_sent:
                            intro = f"🔢 +{phone} ga kod yuborildi."
                        else:
                            intro = f"🔢 Kod: <code>{code}</code> (SMS tizimi ulanmagan)"
                        send_tg(bot_token, chat_id, f"{intro}\nKodni kiriting:")
                        continue

                    if text == "🛍 Buyurtma":
                        send_tg(bot_token, chat_id, "Tanlang:", {"inline_keyboard": [[{"text": "🍔 Menyu", "callback_data": "order_start"}]]})
                    elif text == "ℹ️ Ma'lumot":
                        send_tg(bot_token, chat_id, "📍 Manzil: Toshkent\n📞 Tel: +998 71 200 00 00")
                    elif text == "⚙️ Sozlamalar":
                        p = next((p for p, c in phone_to_chat_id.items() if str(c) == str(chat_id)), "Yo'q")
                        send_tg(bot_token, chat_id, f"⚙️ Sozlamalar\nRaqamingiz: +{p}\nHolat: Tasdiqlangan ✅")

            elif res.status_code == 409:
                time.sleep(5)
            time.sleep(1)
        except Exception as e:
            print(f"[DEBUG] Polling error: {e}")
            time.sleep(5)

class MessageRequest(BaseModel):
    phone: str
    text: str
    bot_token: str

@app.post("/send-message")
async def send_message(data: MessageRequest):
    p = "".join(filter(str.isdigit, data.phone))
    if p in phone_to_chat_id:
        send_tg(data.bot_token, phone_to_chat_id[p], data.text)
        return {"status": "sent"}
    return {"status": "user_not_found"}

@app.get("/customers")
async def get_customers():
    return phone_to_chat_id

class BroadcastRequest(BaseModel):
    message: str
    bot_token: str

@app.post("/broadcast")
async def broadcast(data: BroadcastRequest):
    success = 0
    failed = 0
    # Faqat unikal chat_id larga yuboramiz (bitta raqam bir nechta joyda bo'lishi mumkinligini hisobga olib set ishlatamiz)
    unique_chats = set(phone_to_chat_id.values())
    
    for chat_id in unique_chats:
        try:
            url = f"https://api.telegram.org/bot{data.bot_token}/sendMessage"
            payload = {
                "chat_id": chat_id,
                "text": data.message,
                "parse_mode": "HTML"
            }
            res = requests.post(url, json=payload, timeout=10)
            if res.status_code == 200:
                success += 1
            else:
                failed += 1
        except Exception as e:
            print(f"Broadcast error for {chat_id}: {e}")
            failed += 1
            
    return {"success": success, "failed": failed}

@app.get("/check-phone/{phone}")
async def check_phone(phone: str):
    p = "".join(filter(str.isdigit, phone))
    p = "998" + p if len(p) == 9 else p
    return {"linked": p in phone_to_chat_id, "phone": p}

@app.post("/send-verification")
async def send_verification(data: SMSRequest):
    # Normalize phone
    p = "".join(filter(str.isdigit, data.phone))
    if len(p) == 9:
        p = "998" + p
    if p.startswith("8") and len(p) == 11:
        p = "998" + p[1:]
    
    # Use default token if none provided
    bot_token = data.bot_token if data.bot_token and len(data.bot_token) > 10 else DEFAULT_BOT_TOKEN
    
    # Save to pending codes for bot fallback
    pending_codes[p] = data.code
    print(f"[DEBUG] Verification requested for {p}. Code: {data.code}")
    
    results = {"telegram_user": "not_found", "sms": "pending"}
    msg = data.message or f"🔐 Sayt uchun tasdiqlash kodingiz: <code>{data.code}</code>"
    
    if not bot_token:
        return {"error": "Bot tokeni topilmadi!"}

    # Check if linked to Telegram
    p_str = str(p)
    chat_id = phone_to_chat_id.get(p_str) or phone_to_chat_id.get(int(p) if p.isdigit() else None)
    
    if chat_id:
        success = send_tg(bot_token, chat_id, msg)
        if success:
            results["telegram_user"] = "sent"
            print(f"[DEBUG] VERIFICATION SENT TO TG: {p} -> {chat_id}")
        else:
            results["telegram_user"] = "error"
            print(f"[ERROR] FAILED TO SEND TG TO: {chat_id}")
    else:
        # Check for partial match if direct fails
        match = next((val for key, val in phone_to_chat_id.items() if p_str in str(key) or str(key) in p_str), None)
        if match:
            success = send_tg(bot_token, match, msg)
            if success:
                results["telegram_user"] = "sent"
            else:
                results["telegram_user"] = "error"
        else:
            print(f"[NOT_FOUND] Phone {p_str} not in mapping. Keys count: {len(phone_to_chat_id)}")
    
    # SMS Fallback (Eskiz)
    saved = load_eskiz_settings()
    email = data.email or saved.get("email")
    password = data.password or saved.get("password")
    
    if email and password:
        token = get_eskiz_token(email, password)
        if token:
            res = requests.post("https://notify.eskiz.uz/api/message/sms/send", headers={"Authorization": f"Bearer {token}"}, data={"mobile_phone": p, "message": f"Kod: {data.code}", "from": "4546"})
            if res.status_code == 200:
                results["sms"] = "sent"
            else:
                results["sms"] = f"error: {res.text}"
    else:
        results["sms"] = "skipped: No credentials"
        
    return results

@app.post("/subscriptions")
@app.post("/subscriptions/")
async def add_subscription(data: SubRequest):
    print("\n[SUBSCRIPTION] Yangi so'rov keldi!")
    print(f"Ma'lumotlar: {data.dict()}")
    new_sub = {
        "id": int(time.time()),
        "phone": data.phone,
        "plan_name": data.plan_name,
        "duration": data.duration,
        "price": data.price,
        "gift": data.gift,
        "status": "pending",
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    subscriptions_memory.append(new_sub)
    print(f"[SUBSCRIPTION] Xotiraga saqlandi. Jami: {len(subscriptions_memory)}")
    return {"status": "ok", "sub_id": new_sub["id"]}

@app.get("/subscriptions")
@app.get("/subscriptions/")
async def get_subscriptions():
    print(f"\n[FETCH] Subscriptions so'raldi. Jami: {len(subscriptions_memory)} ta topildi.")
    return load_subs()

@app.post("/subscriptions/action")
async def sub_action(data: SubAction):
    subs = load_subs()
    found = False
    for s in subs:
        if s["id"] == data.id:
            s["status"] = data.status
            found = True
            # If confirmed, notify user via TG
            if data.status == "confirmed":
                p = "".join(filter(str.isdigit, s["phone"]))
                p = "998" + p if len(p) == 9 else p
                if p in phone_to_chat_id:
                    msg = f"✅ <b>TABRIKLAYMIZ!</b>\n\nSizning <b>{s['plan_name']}</b> ({s['duration']}) abonementingiz tasdiqlandi!\n🎁 Sovg'angiz: <b>{s['gift']}</b>\n\nEнди har bir buyurtmada imtiyozlaringizdan foydalanishingiz mumkin."
                    send_tg(data.bot_token, phone_to_chat_id[p], msg)
            break
    
    if found:
        save_subs(subs)
        return {"status": "ok"}
    raise HTTPException(status_code=404, detail="Subscription not found")

def start_bot():
    if DEFAULT_BOT_TOKEN:
        threading.Thread(target=bot_polling, args=(DEFAULT_BOT_TOKEN,), daemon=True).start()

@app.on_event("startup")
def startup_event():
    print("[SYSTEM] FastAPI server ishga tushdi.")
    start_bot()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
