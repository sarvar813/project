import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            uz: {
                translation: {
                    "navbar": {
                        "home": "ASOSIY",
                        "blog": "BLOG",
                        "about": "BIZ HAQIMIZDA",
                        "gallery": "GALEREYA",
                        "menu": "MENYU",
                        "shopping": "+ XARID QILISH"
                    },
                    "hero": {
                        "order_now": "BUYURTMA BERISH",
                        "view_menu": "MENYU KO'RISH",
                        "out_of_stock": "SOTUVDA YO'Q",
                        "buy_now": "Sotib olish"
                    },
                    "menu": {
                        "title": "BIZNING MAXSUS MENYU",
                        "subtitle": "Shahardagi eng mazali fast-food taomlari",
                        "search_results": "Qidiruv natijasi",
                        "clear_search": "Qidiruvni tozalash",
                        "out_of_stock": "TUGAGAN",
                        "no_results_title": "Hech narsa topilmadi 😕",
                        "no_results_desc": "Boshqa so'z bilan qidirib ko'ring yoki barcha mahsulotlarni ko'ring.",
                        "view_all": "BARCHA MAHSULOTLAR",
                        "ingredients_title": "Tarkibi:",
                        "reviews_title": "Mijozlar fikrlari:",
                        "no_reviews": "Hozircha fikrlar yo'q.",
                        "add_review_title": "Fikr qoldirish",
                        "name_placeholder": "Ismingiz",
                        "comment_placeholder": "Fikringiz...",
                        "submit_review": "YUBORISH",
                        "add_to_cart": "SAVATCHAGA QO'SHISH",
                        "categories": {
                            "all": "HAMMASI",
                            "burgers": "BURGERLAR",
                            "pizza": "PITSSA",
                            "sides": "YONDAKLAR",
                            "drinks": "ICHIMLIKLAR"
                        }
                    },
                    "footer": {
                        "opening_hours": "ISHLASH VAQTLARI",
                        "closed": "YOPIQ",
                        "latest_posts": "SO'NGGI YANGILIKLAR",
                        "contact_us": "ALOQA",
                        "address": "TOSHKENT SHAHRI, O'ZBEKISTON",
                        "search_article": "MAQOLA QIDIRISH",
                        "search_placeholder": "Qidirish",
                        "locations": "MANZILLARIMIZ",
                        "branch_one": "MARKAZIY FILIAL",
                        "branch_two": "CHILONZOR FILIALI",
                        "all_rights": "BARCHA HUQUQLAR HIMOYA QILINGAN.",
                        "admin_access": "ADMIN PANEL",
                        "days": {
                            "monday": "DUSHANBA",
                            "tuesday": "SESHANBA",
                            "wednesday": "CHORSHANBA",
                            "thursday": "PAYSHANBA",
                            "friday": "JUMA",
                            "saturday": "SHANBA",
                            "sunday": "YAKSHANBA"
                        }
                    },
                    "home": {
                        "store_closed": "Hozirda do'konimiz yopiq. Buyurtmalar qabul qilinmaydi."
                    },
                    "sauces": {
                        "badge": "BIZNING SIRIMIZ",
                        "title": "MAXSUS SOUSLAR",
                        "desc": "Har bir burgerimizning kaliti - bu bizning sirlangan souslarimizda. Tabiiy ingredientlardan tayyorlangan takrorlanmas ta'mlar.",
                        "explore": "BATAFSIL KO'RISH",
                        "red": {
                            "name": "SIGNATURE RED",
                            "subtitle": "Sirlangan maxfiy retsept",
                            "f1": "12 xil ziravor",
                            "f2": "Tabiiy pomidor",
                            "f3": "Achchiq-chuchuk"
                        },
                        "gold": {
                            "name": "GOLDEN CHEDDAR",
                            "subtitle": "Issiq va mayin lazzat",
                            "f1": "Haqiqiy Cheddar",
                            "f2": "Qaymoqli tekstura",
                            "f3": "Eritilgan issiq"
                        },
                        "thai": {
                            "name": "SWEET & THAI",
                            "subtitle": "Ekzotik nordon-shirin",
                            "f1": "Tailand siri",
                            "f2": "Nordon-shirin",
                            "f3": "Tabiiy ingredientlar"
                        },
                        "garlic": {
                            "name": "WHITE GARLIC",
                            "subtitle": "Mayin sarimsoqli",
                            "f1": "Yangi sarimsoq",
                            "f2": "Qaymoqli",
                            "f3": "Maxsus ziravorlar"
                        }
                    }
                }
            },
            ru: {
                translation: {
                    "navbar": {
                        "home": "ГЛАВНАЯ",
                        "blog": "БЛОГ",
                        "about": "О НАС",
                        "gallery": "ГАЛЕРЕЯ",
                        "menu": "МЕНЮ",
                        "shopping": "+ К ПОКУПКАМ"
                    },
                    "hero": {
                        "order_now": "ЗАКАЗАТЬ",
                        "view_menu": "СМОТРЕТЬ МЕНЮ",
                        "out_of_stock": "НЕТ В НАЛИЧИИ",
                        "buy_now": "Купить"
                    },
                    "menu": {
                        "title": "НАШЕ ЭКСКЛЮЗИВНОЕ МЕНЮ",
                        "subtitle": "Попробуйте лучший фаст-фуд в городе",
                        "search_results": "Результаты поиска",
                        "clear_search": "Очистить поиск",
                        "out_of_stock": "ЗАКОНЧИЛОСЬ",
                        "no_results_title": "Ничего не найдено 😕",
                        "no_results_desc": "Попробуйте поискать другое слово или посмотрите все товары.",
                        "view_all": "ВСЕ ТОВАРЫ",
                        "ingredients_title": "Состав:",
                        "reviews_title": "Отзывы клиентов:",
                        "no_reviews": "Отзывов пока нет.",
                        "add_review_title": "Оставить отзыв",
                        "name_placeholder": "Ваше имя",
                        "comment_placeholder": "Ваш отзыв...",
                        "submit_review": "ОТПРАВИТЬ",
                        "add_to_cart": "ДОБАВИТЬ В КОРЗИНУ",
                        "categories": {
                            "all": "ВСЕ",
                            "burgers": "БУРГЕРЫ",
                            "pizza": "ПИЦЦА",
                            "sides": "ГАРНИРЫ",
                            "drinks": "НАПИТКИ"
                        }
                    },
                    "footer": {
                        "opening_hours": "ЧАСЫ РАБОТЫ",
                        "closed": "ЗАКРЫТО",
                        "latest_posts": "ПОСЛЕДНИЕ НОВОСТИ",
                        "contact_us": "КОНТАКТЫ",
                        "address": "ГОРОД ТАШКЕНТ, УЗБЕКИСТАН",
                        "search_article": "ПОИСК СТАТЬИ",
                        "search_placeholder": "Поиск",
                        "locations": "НАШИ ФИЛИАЛЫ",
                        "branch_one": "ЦЕНТРАЛЬНЫЙ ФИЛИАЛ",
                        "branch_two": "ЧИЛАНЗАРСКИЙ ФИЛИАЛ",
                        "all_rights": "ВСЕ ПРАВА ЗАЩИЩЕНЫ.",
                        "admin_access": "АДМИН ПАНЕЛЬ",
                        "days": {
                            "monday": "ПОНЕДЕЛЬНИК",
                            "tuesday": "ВТОРНИК",
                            "wednesday": "СРЕДА",
                            "thursday": "ЧЕТВЕРГ",
                            "friday": "ПЯТНИЦА",
                            "saturday": "СУББОТА",
                            "sunday": "ВОСКРЕСЕНЬЕ"
                        }
                    },
                    "home": {
                        "store_closed": "В данный момент наш магазин закрыт. Заказы не принимаются."
                    },
                    "sauces": {
                        "badge": "НАШ СЕКРЕТ",
                        "title": "СПЕЦИАЛЬНЫЕ СОУСЫ",
                        "desc": "Секрет каждого нашего бургера заключается в наших секретных соусах. Уникальные вкусы из натуральных ингредиентов.",
                        "explore": "ПОДРОБНЕЕ",
                        "red": {
                            "name": "ФИРМЕННЫЙ КРАСНЫЙ",
                            "subtitle": "Засекреченный рецепт",
                            "f1": "12 видов специй",
                            "f2": "Натуральные томаты",
                            "f3": "Кисло-сладкий"
                        },
                        "gold": {
                            "name": "ЗОЛОТОЙ ЧЕДДЕР",
                            "subtitle": "Теплый и мягкий вкус",
                            "f1": "Настоящий Чеддер",
                            "f2": "Сливочная текстура",
                            "f3": "Расплавленный"
                        },
                        "thai": {
                            "name": "SWEET & THAI",
                            "subtitle": "Экзотический кисло-сладкий",
                            "f1": "Тайский секрет",
                            "f2": "Кисло-сладкий",
                            "f3": "Натуральные ингредиенты"
                        },
                        "garlic": {
                            "name": "WHITE GARLIC",
                            "subtitle": "Нежный чесночный",
                            "f1": "Свежий чеснок",
                            "f2": "Сливочный",
                            "f3": "Особые специи"
                        }
                    }
                }
            },
            en: {
                translation: {
                    "navbar": {
                        "home": "HOME",
                        "blog": "BLOG",
                        "about": "ABOUT US",
                        "gallery": "GALLERY",
                        "menu": "MENU",
                        "shopping": "+ SHOPPING"
                    },
                    "hero": {
                        "order_now": "ORDER NOW",
                        "view_menu": "VIEW MENU",
                        "out_of_stock": "OUT OF STOCK",
                        "buy_now": "Buy now"
                    },
                    "menu": {
                        "title": "OUR EXQUISITE MENU",
                        "subtitle": "Taste the best fast food in town",
                        "search_results": "Search results",
                        "clear_search": "Clear search",
                        "out_of_stock": "OUT OF STOCK",
                        "no_results_title": "Nothing found 😕",
                        "no_results_desc": "Try searching for another word or view all products.",
                        "view_all": "ALL PRODUCTS",
                        "ingredients_title": "Ingredients:",
                        "reviews_title": "Customer Reviews:",
                        "no_reviews": "No reviews yet.",
                        "add_review_title": "Leave a review",
                        "name_placeholder": "Your name",
                        "comment_placeholder": "Your review...",
                        "submit_review": "SUBMIT",
                        "add_to_cart": "ADD TO CART",
                        "categories": {
                            "all": "ALL",
                            "burgers": "BURGERS",
                            "pizza": "PIZZA",
                            "sides": "SIDES",
                            "drinks": "DRINKS"
                        }
                    },
                    "footer": {
                        "opening_hours": "OPENING HOURS",
                        "closed": "CLOSED",
                        "latest_posts": "LATEST POSTS",
                        "contact_us": "CONTACT US",
                        "address": "TASHKENT CITY, UZBEKISTAN",
                        "search_article": "SEARCH ARTICLE",
                        "search_placeholder": "Search",
                        "locations": "LOCATIONS",
                        "branch_one": "CENTRAL BRANCH",
                        "branch_two": "CHILANZAR BRANCH",
                        "all_rights": "ALL RIGHTS RESERVED.",
                        "admin_access": "ADMIN ACCESS",
                        "days": {
                            "monday": "MONDAY",
                            "tuesday": "TUESDAY",
                            "wednesday": "WEDNESDAY",
                            "thursday": "THURSDAY",
                            "friday": "FRIDAY",
                            "saturday": "SATURDAY",
                            "sunday": "SUNDAY"
                        }
                    },
                    "home": {
                        "store_closed": "Our store is currently closed. Orders are not accepted."
                    },
                    "sauces": {
                        "badge": "OUR SECRET",
                        "title": "SPECIAL SAUCES",
                        "desc": "The key to every one of our burgers is in our secret sauces. Unique flavors made from natural ingredients.",
                        "explore": "VIEW MORE",
                        "red": {
                            "name": "SIGNATURE RED",
                            "subtitle": "Secret glazed recipe",
                            "f1": "12 types of spices",
                            "f2": "Natural tomatoes",
                            "f3": "Sweet & Spicy"
                        },
                        "gold": {
                            "name": "GOLDEN CHEDDAR",
                            "subtitle": "Warm and smooth flavor",
                            "f1": "Real Cheddar",
                            "f2": "Creamy texture",
                            "f3": "Melted hot"
                        },
                        "thai": {
                            "name": "SWEET & THAI",
                            "subtitle": "Exotic sweet & sour",
                            "f1": "Thai secret",
                            "f2": "Sweet & Sour",
                            "f3": "Natural ingredients"
                        },
                        "garlic": {
                            "name": "WHITE GARLIC",
                            "subtitle": "Creamy garlic",
                            "f1": "Fresh garlic",
                            "f2": "Creamy texture",
                            "f3": "Special spices"
                        }
                    }
                }
            }
        },
        fallbackLng: 'uz',
        debug: false,
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
