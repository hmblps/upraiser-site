/**
 * Conference hub (/connect) — localisation.
 * Brand terms (UPRAISER, Verified Deck, Benchmarks, Zero log drift, pre-bid, Tier-1)
 * stay in Latin script: they are industry vocabulary and match the media deck.
 */

export const HUB_LANGS = [
  "en", "ru", "uk", "de", "es", "fr", "pt", "tr", "ar", "he", "hi", "zh", "ja", "ko",
] as const;

export type HubLang = (typeof HUB_LANGS)[number];

/** Native names for the language picker. */
export const HUB_LANG_NAMES: Record<HubLang, string> = {
  en: "English",
  ru: "Русский",
  uk: "Українська",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  pt: "Português",
  tr: "Türkçe",
  ar: "العربية",
  he: "עברית",
  hi: "हिन्दी",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
};

/** Right-to-left scripts. */
export const HUB_RTL: ReadonlySet<HubLang> = new Set<HubLang>(["ar", "he"]);

/**
 * Scripts where tracking / forced uppercase breaks letter shaping
 * (Arabic joining, Devanagari conjuncts) or looks wrong (CJK, Hebrew).
 */
export const HUB_PLAIN_SCRIPT: ReadonlySet<HubLang> = new Set<HubLang>([
  "ar", "he", "hi", "zh", "ja", "ko",
]);

export interface HubDict {
  tagline: string;
  saveContactBtn: string;
  saveContactSub: string;
  formHeading: string;
  formSub: string;
  fieldCallsign: string;
  callsignPlaceholder: string;
  fieldCompany: string;
  companyPlaceholder: string;
  fieldContact: string;
  contactPlaceholder: string;
  btnSubmit: string;
  btnSubmitting: string;
  successTitle: string;
  successBody: string;
  btnAnother: string;
  errSubmit: string;
  errNetwork: string;
  onSiteDirect: string;
  sectionHeader: string;
  mediaDeckTitle: string;
  mediaDeckSub: string;
  officialPlatform: string;
  linkedinTitle: string;
  footerAccess: string;
  langLabel: string;
}

export const HUB_DICT: Record<HubLang, HubDict> = {
  en: {
    tagline: "Direct operator desk. Zero log drift, pre-bid filtration, and Tier-1 routing.",
    saveContactBtn: "Save Contact to Phone (.vcf)",
    saveContactSub: "One-tap vCard import to iOS & Android contacts",
    formHeading: "Request Verified Deck & Benchmarks",
    formSub: "Leave Your contact — We will send verified geo splits and conversion benchmarks.",
    fieldCallsign: "Full Name / Callsign",
    callsignPlaceholder: "Your name or handle",
    fieldCompany: "Company & Role",
    companyPlaceholder: "e.g. Head of UA @ Studio",
    fieldContact: "Telegram or Email",
    contactPlaceholder: "@handle or name@company.com",
    btnSubmit: "Request Materials",
    btnSubmitting: "Sending...",
    successTitle: "Request Received",
    successBody: "Your request is logged. Verified Deck & Benchmarks will reach Your contact shortly.",
    btnAnother: "Send another request",
    errSubmit: "Could not send. Please message us directly via Telegram or Email below.",
    errNetwork: "Network error. Please message us directly via Telegram or Email below.",
    onSiteDirect: "On-Site Direct",
    sectionHeader: "Media & Links",
    mediaDeckTitle: "Media Deck 2026 (PDF)",
    mediaDeckSub: "20 slides · 2.6 MB · Traffic infrastructure",
    officialPlatform: "Official Website",
    linkedinTitle: "LinkedIn Company Page",
    footerAccess: "Private conference access point · Unlisted",
    langLabel: "Language",
  },
  ru: {
    tagline: "Прямой операторский деск. Zero log drift, pre-bid фильтрация и Tier-1 маршрутизация.",
    saveContactBtn: "Сохранить контакт в телефон (.vcf)",
    saveContactSub: "Импорт визитки в контакты iOS / Android одним тапом",
    formHeading: "Request Verified Deck & Benchmarks",
    formSub: "Укажите контакт — пришлем актуальные сплиты по гео и конверсиям.",
    fieldCallsign: "ФИО / Позывной",
    callsignPlaceholder: "Имя или никнейм",
    fieldCompany: "Компания и роль",
    companyPlaceholder: "Напр. Head of UA @ Studio",
    fieldContact: "Telegram или Email",
    contactPlaceholder: "@handle или name@company.com",
    btnSubmit: "Получить материалы",
    btnSubmitting: "Отправка...",
    successTitle: "Запрос принят",
    successBody: "Запрос записан. Verified Deck и бенчмарки придут на Ваш контакт в ближайшее время.",
    btnAnother: "Отправить ещё один запрос",
    errSubmit: "Не удалось отправить. Напишите нам напрямую в Telegram или на Email ниже.",
    errNetwork: "Сетевая ошибка. Напишите нам напрямую в Telegram или на Email ниже.",
    onSiteDirect: "На связи на ивенте",
    sectionHeader: "Медиа и ссылки",
    mediaDeckTitle: "Медиадек 2026 (PDF)",
    mediaDeckSub: "20 слайдов · 2,6 МБ · Инфраструктура трафика",
    officialPlatform: "Официальный сайт",
    linkedinTitle: "Страница компании в LinkedIn",
    footerAccess: "Закрытая точка доступа для конференций · Unlisted",
    langLabel: "Язык",
  },
  uk: {
    tagline: "Прямий операторський деск. Zero log drift, pre-bid фільтрація та Tier-1 маршрутизація.",
    saveContactBtn: "Зберегти контакт у телефон (.vcf)",
    saveContactSub: "Імпорт візитівки в контакти iOS / Android одним дотиком",
    formHeading: "Запит Verified Deck & Benchmarks",
    formSub: "Залиште контакт — надішлемо актуальні спліти за гео та конверсіями.",
    fieldCallsign: "Ім'я / Позивний",
    callsignPlaceholder: "Ім'я або нікнейм",
    fieldCompany: "Компанія та роль",
    companyPlaceholder: "Напр. Head of UA @ Studio",
    fieldContact: "Telegram або Email",
    contactPlaceholder: "@handle або name@company.com",
    btnSubmit: "Отримати матеріали",
    btnSubmitting: "Надсилання...",
    successTitle: "Запит прийнято",
    successBody: "Запит збережено. Verified Deck і бенчмарки надійдуть на Ваш контакт найближчим часом.",
    btnAnother: "Надіслати ще один запит",
    errSubmit: "Не вдалося надіслати. Напишіть нам напряму в Telegram або на Email нижче.",
    errNetwork: "Помилка мережі. Напишіть нам напряму в Telegram або на Email нижче.",
    onSiteDirect: "На зв'язку на івенті",
    sectionHeader: "Медіа та посилання",
    mediaDeckTitle: "Медіадек 2026 (PDF)",
    mediaDeckSub: "20 слайдів · 2,6 МБ · Інфраструктура трафіку",
    officialPlatform: "Офіційний сайт",
    linkedinTitle: "Сторінка компанії в LinkedIn",
    footerAccess: "Закрита точка доступу для конференцій · Unlisted",
    langLabel: "Мова",
  },
  de: {
    tagline: "Direkter Operator-Desk. Zero log drift, Pre-Bid-Filterung und Tier-1-Routing.",
    saveContactBtn: "Kontakt im Telefon speichern (.vcf)",
    saveContactSub: "vCard mit einem Tipp in iOS- und Android-Kontakte importieren",
    formHeading: "Verified Deck & Benchmarks anfordern",
    formSub: "Hinterlassen Sie Ihren Kontakt — wir senden verifizierte Geo-Splits und Conversion-Benchmarks.",
    fieldCallsign: "Name / Callsign",
    callsignPlaceholder: "Ihr Name oder Handle",
    fieldCompany: "Unternehmen & Position",
    companyPlaceholder: "z. B. Head of UA @ Studio",
    fieldContact: "Telegram oder E-Mail",
    contactPlaceholder: "@handle oder name@firma.de",
    btnSubmit: "Unterlagen anfordern",
    btnSubmitting: "Wird gesendet...",
    successTitle: "Anfrage eingegangen",
    successBody: "Ihre Anfrage ist erfasst. Verified Deck & Benchmarks gehen in Kürze an Ihren Kontakt.",
    btnAnother: "Weitere Anfrage senden",
    errSubmit: "Senden fehlgeschlagen. Schreiben Sie uns direkt per Telegram oder E-Mail unten.",
    errNetwork: "Netzwerkfehler. Schreiben Sie uns direkt per Telegram oder E-Mail unten.",
    onSiteDirect: "Direkt vor Ort",
    sectionHeader: "Medien & Links",
    mediaDeckTitle: "Media Deck 2026 (PDF)",
    mediaDeckSub: "20 Folien · 2,6 MB · Traffic-Infrastruktur",
    officialPlatform: "Offizielle Website",
    linkedinTitle: "LinkedIn-Unternehmensseite",
    footerAccess: "Privater Konferenz-Zugang · Nicht gelistet",
    langLabel: "Sprache",
  },
  es: {
    tagline: "Mesa directa de operadores. Zero log drift, filtrado pre-bid y enrutamiento Tier-1.",
    saveContactBtn: "Guardar contacto en el teléfono (.vcf)",
    saveContactSub: "Importe la vCard a los contactos de iOS y Android con un toque",
    formHeading: "Solicitar Verified Deck & Benchmarks",
    formSub: "Deje su contacto: le enviaremos splits por geo y benchmarks de conversión verificados.",
    fieldCallsign: "Nombre completo / Alias",
    callsignPlaceholder: "Su nombre o usuario",
    fieldCompany: "Empresa y cargo",
    companyPlaceholder: "p. ej. Head of UA @ Studio",
    fieldContact: "Telegram o correo",
    contactPlaceholder: "@usuario o nombre@empresa.com",
    btnSubmit: "Solicitar materiales",
    btnSubmitting: "Enviando...",
    successTitle: "Solicitud recibida",
    successBody: "Su solicitud está registrada. Verified Deck y benchmarks llegarán a su contacto en breve.",
    btnAnother: "Enviar otra solicitud",
    errSubmit: "No se pudo enviar. Escríbanos directamente por Telegram o correo, abajo.",
    errNetwork: "Error de red. Escríbanos directamente por Telegram o correo, abajo.",
    onSiteDirect: "Contacto directo en el evento",
    sectionHeader: "Medios y enlaces",
    mediaDeckTitle: "Media Deck 2026 (PDF)",
    mediaDeckSub: "20 diapositivas · 2,6 MB · Infraestructura de tráfico",
    officialPlatform: "Sitio oficial",
    linkedinTitle: "Página de empresa en LinkedIn",
    footerAccess: "Acceso privado para conferencias · No listado",
    langLabel: "Idioma",
  },
  fr: {
    tagline: "Desk opérateur en direct. Zero log drift, filtrage pre-bid et routage Tier-1.",
    saveContactBtn: "Enregistrer le contact (.vcf)",
    saveContactSub: "Import de la vCard dans les contacts iOS et Android en un geste",
    formHeading: "Demander le Verified Deck & Benchmarks",
    formSub: "Laissez vos coordonnées — nous vous enverrons des splits par géo et des benchmarks de conversion vérifiés.",
    fieldCallsign: "Nom complet / Pseudo",
    callsignPlaceholder: "Votre nom ou pseudo",
    fieldCompany: "Société et poste",
    companyPlaceholder: "ex. Head of UA @ Studio",
    fieldContact: "Telegram ou e-mail",
    contactPlaceholder: "@pseudo ou nom@societe.com",
    btnSubmit: "Recevoir les documents",
    btnSubmitting: "Envoi...",
    successTitle: "Demande reçue",
    successBody: "Votre demande est enregistrée. Le Verified Deck et les benchmarks arrivent sur vos coordonnées sous peu.",
    btnAnother: "Envoyer une autre demande",
    errSubmit: "Envoi impossible. Écrivez-nous directement via Telegram ou e-mail ci-dessous.",
    errNetwork: "Erreur réseau. Écrivez-nous directement via Telegram ou e-mail ci-dessous.",
    onSiteDirect: "Contact direct sur place",
    sectionHeader: "Médias et liens",
    mediaDeckTitle: "Media Deck 2026 (PDF)",
    mediaDeckSub: "20 diapositives · 2,6 Mo · Infrastructure de trafic",
    officialPlatform: "Site officiel",
    linkedinTitle: "Page entreprise LinkedIn",
    footerAccess: "Accès privé conférence · Non répertorié",
    langLabel: "Langue",
  },
  pt: {
    tagline: "Mesa direta de operadores. Zero log drift, filtragem pre-bid e roteamento Tier-1.",
    saveContactBtn: "Salvar contato no celular (.vcf)",
    saveContactSub: "Importe o vCard para os contatos do iOS e Android com um toque",
    formHeading: "Solicitar Verified Deck & Benchmarks",
    formSub: "Deixe seu contato — enviaremos splits por geo e benchmarks de conversão verificados.",
    fieldCallsign: "Nome completo / Apelido",
    callsignPlaceholder: "Seu nome ou usuário",
    fieldCompany: "Empresa e cargo",
    companyPlaceholder: "ex.: Head of UA @ Studio",
    fieldContact: "Telegram ou e-mail",
    contactPlaceholder: "@usuario ou nome@empresa.com",
    btnSubmit: "Solicitar materiais",
    btnSubmitting: "Enviando...",
    successTitle: "Solicitação recebida",
    successBody: "Sua solicitação foi registrada. O Verified Deck e os benchmarks chegam ao seu contato em breve.",
    btnAnother: "Enviar outra solicitação",
    errSubmit: "Não foi possível enviar. Fale conosco direto por Telegram ou e-mail abaixo.",
    errNetwork: "Erro de rede. Fale conosco direto por Telegram ou e-mail abaixo.",
    onSiteDirect: "Contato direto no evento",
    sectionHeader: "Mídia e links",
    mediaDeckTitle: "Media Deck 2026 (PDF)",
    mediaDeckSub: "20 slides · 2,6 MB · Infraestrutura de tráfego",
    officialPlatform: "Site oficial",
    linkedinTitle: "Página da empresa no LinkedIn",
    footerAccess: "Acesso privado para conferências · Não listado",
    langLabel: "Idioma",
  },
  tr: {
    tagline: "Doğrudan operatör masası. Zero log drift, pre-bid filtreleme ve Tier-1 yönlendirme.",
    saveContactBtn: "Kişiyi telefona kaydet (.vcf)",
    saveContactSub: "vCard'ı tek dokunuşla iOS ve Android rehberine aktarın",
    formHeading: "Verified Deck & Benchmarks Talep Et",
    formSub: "İletişim bilginizi bırakın — doğrulanmış geo dağılımlarını ve dönüşüm benchmark'larını gönderelim.",
    fieldCallsign: "Ad Soyad / Takma Ad",
    callsignPlaceholder: "Adınız veya kullanıcı adınız",
    fieldCompany: "Şirket ve Pozisyon",
    companyPlaceholder: "örn. Head of UA @ Studio",
    fieldContact: "Telegram veya E-posta",
    contactPlaceholder: "@kullanici veya ad@sirket.com",
    btnSubmit: "Materyalleri İste",
    btnSubmitting: "Gönderiliyor...",
    successTitle: "Talep alındı",
    successBody: "Talebiniz kaydedildi. Verified Deck ve benchmark'lar kısa süre içinde iletişim bilginize ulaşacak.",
    btnAnother: "Başka bir talep gönder",
    errSubmit: "Gönderilemedi. Lütfen aşağıdaki Telegram veya e-posta ile doğrudan yazın.",
    errNetwork: "Ağ hatası. Lütfen aşağıdaki Telegram veya e-posta ile doğrudan yazın.",
    onSiteDirect: "Etkinlikte doğrudan ulaşın",
    sectionHeader: "Medya ve bağlantılar",
    mediaDeckTitle: "Media Deck 2026 (PDF)",
    mediaDeckSub: "20 slayt · 2,6 MB · Trafik altyapısı",
    officialPlatform: "Resmi web sitesi",
    linkedinTitle: "LinkedIn şirket sayfası",
    footerAccess: "Özel konferans erişim noktası · Listelenmemiş",
    langLabel: "Dil",
  },
  ar: {
    tagline: "مكتب مشغّلين مباشر. Zero log drift، وتصفية pre-bid، وتوجيه Tier-1.",
    saveContactBtn: "حفظ جهة الاتصال في الهاتف (\u2066.vcf\u2069)",
    saveContactSub: "استيراد بطاقة vCard إلى جهات اتصال iOS وAndroid بنقرة واحدة",
    formHeading: "طلب Verified Deck & Benchmarks",
    formSub: "اترك بيانات التواصل — سنرسل لك توزيعات الجغرافيا المؤكدة ومعايير التحويل.",
    fieldCallsign: "الاسم الكامل / الاسم المستعار",
    callsignPlaceholder: "اسمك أو معرّفك",
    fieldCompany: "الشركة والمنصب",
    companyPlaceholder: "مثال: Head of UA @ Studio",
    fieldContact: "Telegram أو البريد الإلكتروني",
    contactPlaceholder: "@handle or name@company.com",
    btnSubmit: "اطلب المواد",
    btnSubmitting: "جارٍ الإرسال...",
    successTitle: "تم استلام الطلب",
    successBody: "تم تسجيل طلبك. سيصل Verified Deck والمعايير إلى جهة اتصالك قريبًا.",
    btnAnother: "إرسال طلب آخر",
    errSubmit: "تعذّر الإرسال. تواصل معنا مباشرة عبر Telegram أو البريد أدناه.",
    errNetwork: "خطأ في الشبكة. تواصل معنا مباشرة عبر Telegram أو البريد أدناه.",
    onSiteDirect: "تواصل مباشر في الفعالية",
    sectionHeader: "الوسائط والروابط",
    mediaDeckTitle: "Media Deck 2026 (PDF)",
    mediaDeckSub: "20 شريحة · 2.6 ميغابايت · البنية التحتية للترافيك",
    officialPlatform: "الموقع الرسمي",
    linkedinTitle: "صفحة الشركة على LinkedIn",
    footerAccess: "نقطة وصول خاصة للمؤتمرات · غير مُدرج",
    langLabel: "اللغة",
  },
  he: {
    tagline: "דסק מפעילים ישיר. Zero log drift, סינון pre-bid וניתוב Tier-1.",
    saveContactBtn: "שמירת איש קשר בטלפון (\u2066.vcf\u2069)",
    saveContactSub: "ייבוא כרטיס ביקור לאנשי הקשר ב-iOS וב-Android בהקשה אחת",
    formHeading: "בקשה ל-Verified Deck & Benchmarks",
    formSub: "השאירו פרטי קשר — נשלח פיצולי geo מאומתים ובנצ'מרקים של המרות.",
    fieldCallsign: "שם מלא / כינוי",
    callsignPlaceholder: "השם או הכינוי שלכם",
    fieldCompany: "חברה ותפקיד",
    companyPlaceholder: "לדוגמה: Head of UA @ Studio",
    fieldContact: "Telegram או אימייל",
    contactPlaceholder: "@handle or name@company.com",
    btnSubmit: "קבלת חומרים",
    btnSubmitting: "שולח...",
    successTitle: "הבקשה התקבלה",
    successBody: "הבקשה נרשמה. Verified Deck ובנצ'מרקים יגיעו אליכם בקרוב.",
    btnAnother: "שליחת בקשה נוספת",
    errSubmit: "השליחה נכשלה. כתבו לנו ישירות ב-Telegram או באימייל למטה.",
    errNetwork: "שגיאת רשת. כתבו לנו ישירות ב-Telegram או באימייל למטה.",
    onSiteDirect: "קשר ישיר באירוע",
    sectionHeader: "מדיה וקישורים",
    mediaDeckTitle: "Media Deck 2026 (PDF)",
    mediaDeckSub: "20 שקפים · \u21662.6 MB\u2069 · תשתית טראפיק",
    officialPlatform: "האתר הרשמי",
    linkedinTitle: "עמוד החברה ב-LinkedIn",
    footerAccess: "נקודת גישה פרטית לכנסים · לא רשום",
    langLabel: "שפה",
  },
  hi: {
    tagline: "सीधा ऑपरेटर डेस्क। Zero log drift, pre-bid फ़िल्टरिंग और Tier-1 रूटिंग।",
    saveContactBtn: "संपर्क फ़ोन में सेव करें (.vcf)",
    saveContactSub: "एक टैप में vCard को iOS और Android कॉन्टैक्ट्स में इम्पोर्ट करें",
    formHeading: "Verified Deck & Benchmarks का अनुरोध करें",
    formSub: "अपना संपर्क छोड़ें — हम सत्यापित geo splits और कन्वर्ज़न बेंचमार्क भेजेंगे।",
    fieldCallsign: "पूरा नाम / कॉलसाइन",
    callsignPlaceholder: "आपका नाम या हैंडल",
    fieldCompany: "कंपनी और भूमिका",
    companyPlaceholder: "जैसे Head of UA @ Studio",
    fieldContact: "Telegram या ईमेल",
    contactPlaceholder: "@handle या name@company.com",
    btnSubmit: "सामग्री मंगाएँ",
    btnSubmitting: "भेजा जा रहा है...",
    successTitle: "अनुरोध प्राप्त हुआ",
    successBody: "आपका अनुरोध दर्ज हो गया है। Verified Deck और बेंचमार्क जल्द ही आपके संपर्क पर पहुँचेंगे।",
    btnAnother: "एक और अनुरोध भेजें",
    errSubmit: "भेजा नहीं जा सका। कृपया नीचे दिए Telegram या ईमेल से सीधे संपर्क करें।",
    errNetwork: "नेटवर्क त्रुटि। कृपया नीचे दिए Telegram या ईमेल से सीधे संपर्क करें।",
    onSiteDirect: "इवेंट पर सीधा संपर्क",
    sectionHeader: "मीडिया और लिंक",
    mediaDeckTitle: "Media Deck 2026 (PDF)",
    mediaDeckSub: "20 स्लाइड · 2.6 MB · ट्रैफ़िक इंफ्रास्ट्रक्चर",
    officialPlatform: "आधिकारिक वेबसाइट",
    linkedinTitle: "LinkedIn कंपनी पेज",
    footerAccess: "निजी कॉन्फ़्रेंस एक्सेस पॉइंट · अनलिस्टेड",
    langLabel: "भाषा",
  },
  zh: {
    tagline: "直连运营台。Zero log drift、pre-bid 过滤与 Tier-1 路由。",
    saveContactBtn: "保存联系人到手机 (.vcf)",
    saveContactSub: "一键将名片导入 iOS 和 Android 通讯录",
    formHeading: "获取 Verified Deck 与 Benchmarks",
    formSub: "留下联系方式——我们会发送经过验证的地区分布与转化基准数据。",
    fieldCallsign: "姓名 / 称呼",
    callsignPlaceholder: "您的姓名或用户名",
    fieldCompany: "公司与职位",
    companyPlaceholder: "例如 Head of UA @ Studio",
    fieldContact: "Telegram 或邮箱",
    contactPlaceholder: "@用户名 或 name@company.com",
    btnSubmit: "获取资料",
    btnSubmitting: "发送中...",
    successTitle: "请求已收到",
    successBody: "您的请求已登记。Verified Deck 与基准数据将很快发送至您的联系方式。",
    btnAnother: "再发送一个请求",
    errSubmit: "发送失败。请通过下方 Telegram 或邮箱直接联系我们。",
    errNetwork: "网络错误。请通过下方 Telegram 或邮箱直接联系我们。",
    onSiteDirect: "现场直连",
    sectionHeader: "媒体与链接",
    mediaDeckTitle: "Media Deck 2026 (PDF)",
    mediaDeckSub: "20 页 · 2.6 MB · 流量基础设施",
    officialPlatform: "官方网站",
    linkedinTitle: "LinkedIn 公司主页",
    footerAccess: "私有会议入口 · 未公开",
    langLabel: "语言",
  },
  ja: {
    tagline: "オペレーター直通デスク。Zero log drift、pre-bid フィルタリング、Tier-1 ルーティング。",
    saveContactBtn: "連絡先を電話に保存 (.vcf)",
    saveContactSub: "ワンタップで vCard を iOS / Android の連絡先に取り込み",
    formHeading: "Verified Deck & Benchmarks をリクエスト",
    formSub: "連絡先をご記入ください。検証済みのジオ別スプリットとコンバージョンのベンチマークをお送りします。",
    fieldCallsign: "氏名 / ハンドル名",
    callsignPlaceholder: "お名前またはハンドル名",
    fieldCompany: "会社名・役職",
    companyPlaceholder: "例: Head of UA @ Studio",
    fieldContact: "Telegram またはメール",
    contactPlaceholder: "@handle または name@company.com",
    btnSubmit: "資料をリクエスト",
    btnSubmitting: "送信中...",
    successTitle: "リクエストを受け付けました",
    successBody: "リクエストを記録しました。Verified Deck とベンチマークを、まもなくご連絡先にお送りします。",
    btnAnother: "別のリクエストを送る",
    errSubmit: "送信できませんでした。下の Telegram またはメールで直接ご連絡ください。",
    errNetwork: "ネットワークエラーです。下の Telegram またはメールで直接ご連絡ください。",
    onSiteDirect: "会場で直接連絡",
    sectionHeader: "メディアとリンク",
    mediaDeckTitle: "Media Deck 2026 (PDF)",
    mediaDeckSub: "20 スライド · 2.6 MB · トラフィック基盤",
    officialPlatform: "公式サイト",
    linkedinTitle: "LinkedIn 企業ページ",
    footerAccess: "会議用プライベートアクセス · 非公開",
    langLabel: "言語",
  },
  ko: {
    tagline: "운영자 직통 데스크. Zero log drift, pre-bid 필터링, Tier-1 라우팅.",
    saveContactBtn: "연락처를 휴대폰에 저장 (.vcf)",
    saveContactSub: "한 번의 탭으로 vCard를 iOS·Android 연락처에 가져오기",
    formHeading: "Verified Deck & Benchmarks 요청",
    formSub: "연락처를 남겨 주세요. 검증된 지역별 비중과 전환 벤치마크를 보내드립니다.",
    fieldCallsign: "이름 / 닉네임",
    callsignPlaceholder: "이름 또는 닉네임",
    fieldCompany: "회사 및 직책",
    companyPlaceholder: "예: Head of UA @ Studio",
    fieldContact: "Telegram 또는 이메일",
    contactPlaceholder: "@handle 또는 name@company.com",
    btnSubmit: "자료 요청",
    btnSubmitting: "전송 중...",
    successTitle: "요청이 접수되었습니다",
    successBody: "요청이 기록되었습니다. Verified Deck과 벤치마크를 곧 연락처로 보내드립니다.",
    btnAnother: "다른 요청 보내기",
    errSubmit: "전송하지 못했습니다. 아래 Telegram 또는 이메일로 직접 연락해 주세요.",
    errNetwork: "네트워크 오류입니다. 아래 Telegram 또는 이메일로 직접 연락해 주세요.",
    onSiteDirect: "현장 직통 연락",
    sectionHeader: "미디어 및 링크",
    mediaDeckTitle: "Media Deck 2026 (PDF)",
    mediaDeckSub: "20 슬라이드 · 2.6 MB · 트래픽 인프라",
    officialPlatform: "공식 웹사이트",
    linkedinTitle: "LinkedIn 회사 페이지",
    footerAccess: "비공개 컨퍼런스 접속 지점 · 비공개",
    langLabel: "언어",
  },
};

const STORAGE_KEY = "upraiser_hub_lang";

function isHubLang(value: string | null | undefined): value is HubLang {
  return !!value && (HUB_LANGS as readonly string[]).includes(value);
}

/** Maps a BCP-47 tag ("zh-Hans-CN", "iw", "pt-BR") to a supported hub language. */
function matchTag(tag: string): HubLang | null {
  const base = tag.toLowerCase().split("-")[0];
  if (isHubLang(base)) return base;
  if (base === "iw") return "he"; // legacy Hebrew code
  if (base === "be" || base === "kk") return "ru"; // Russian-reading audiences
  return null;
}

/**
 * Priority: `?lang=xx` (lets each QR code pin a language)
 *   > saved manual choice > device language list > English.
 */
export function detectHubLang(): HubLang {
  if (typeof window === "undefined") return "en";

  const fromQuery = new URLSearchParams(window.location.search).get("lang");
  const queryMatch = fromQuery ? matchTag(fromQuery) : null;
  if (queryMatch) return queryMatch;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isHubLang(saved)) return saved;
  } catch {
    /* storage blocked (private mode) — fall through */
  }

  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of tags) {
    const match = tag ? matchTag(tag) : null;
    if (match) return match;
  }
  return "en";
}

export function saveHubLang(lang: HubLang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage blocked — choice applies for this visit only */
  }
}
