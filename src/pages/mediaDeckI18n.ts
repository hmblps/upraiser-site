/**
 * Upraiser Media Deck — Complete Multilingual Localisation Registry.
 * 20 Slides across 22 Global Languages.
 * Adheres strictly to Ogilvy Copywriting Doctrine & Layout Integrity.
 */

import {
  type HubLang,
  HUB_LANGS,
  HUB_LANG_NAMES,
  HUB_RTL,
  HUB_PLAIN_SCRIPT,
} from "./conferenceHubI18n";

export interface DeckSlideBullet {
  title: string;
  desc: string;
  badge?: string;
}

export interface DeckSlideMetric {
  value: string;
  label: string;
  sub?: string;
}

export interface DeckSlideContent {
  slideNumber: number;
  kicker: string;
  title: string;
  subtitle?: string;
  bullets?: DeckSlideBullet[];
  metrics?: DeckSlideMetric[];
  tagline?: string;
}

export interface DeckUIStrings {
  backToHub: string;
  downloadPdf: string;
  openPdfViewer: string;
  slideOf: string;
  prev: string;
  next: string;
  interactiveMode: string;
  visualMode: string;
  fullscreen: string;
  exitFullscreen: string;
  selectLanguage: string;
  swipeHint: string;
  clipInCta: string;
  saveVcf: string;
  contactAlex: string;
  deckTitle: string;
}

export const DECK_UI_STRINGS: Record<HubLang, DeckUIStrings> = {
  "en": {
    "backToHub": "← Hub",
    "downloadPdf": "Download Original PDF ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Slide {current} of {total}",
    "prev": "Prev",
    "next": "Next",
    "interactiveMode": "Interactive (Multilingual)",
    "visualMode": "Original Slides",
    "fullscreen": "Fullscreen",
    "exitFullscreen": "Exit Fullscreen",
    "selectLanguage": "Language",
    "swipeHint": "Swipe or use Arrow keys to navigate",
    "clipInCta": "Clip In With Alex",
    "saveVcf": "Save vCard (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Traffic Infrastructure & OEM Preloads"
  },
  "ru": {
    "backToHub": "← Хаб",
    "downloadPdf": "Скачать исходный PDF ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Слайд {current} из {total}",
    "prev": "Назад",
    "next": "Вперед",
    "interactiveMode": "Интерактивный (Перевод)",
    "visualMode": "Оригинальные слайды",
    "fullscreen": "Полный экран",
    "exitFullscreen": "Выход",
    "selectLanguage": "Язык",
    "swipeHint": "Свайпайте или используйте стрелки клавиатуры",
    "clipInCta": "Связаться с Алексом",
    "saveVcf": "Сохранить контакт (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Трафик-инфраструктура и OEM-прелоады"
  },
  "ro": {
    "backToHub": "← Hub",
    "downloadPdf": "Descarcă PDF Original ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Slide {current} din {total}",
    "prev": "Înapoi",
    "next": "Înainte",
    "interactiveMode": "Interactiv (Tradus)",
    "visualMode": "Slide-uri originale",
    "fullscreen": "Ecran complet",
    "exitFullscreen": "Ieșire",
    "selectLanguage": "Limbă",
    "swipeHint": "Glisează sau folosește săgețile tastaturii",
    "clipInCta": "Conectează-te cu Alex",
    "saveVcf": "Salvează contactul (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Infrastructură de Trafic și Preinstalări OEM"
  },
  "ka": {
    "backToHub": "← ჰაბი",
    "downloadPdf": "ორიგინალი PDF-ის ჩამოტვირთვა ↗",
    "openPdfViewer": "PDF",
    "slideOf": "სლაიდი {current} / {total}",
    "prev": "უკან",
    "next": "წინ",
    "interactiveMode": "ინტერაქტიული (ქართული)",
    "visualMode": "ორიგინალი სლაიდები",
    "fullscreen": "სრული ეკრანი",
    "exitFullscreen": "გამოსვლა",
    "selectLanguage": "ენა",
    "swipeHint": "გადაფურცლეთ ან გამოიყენეთ ისრები",
    "clipInCta": "დაკავშირება ალექსთან",
    "saveVcf": "კონტაქტის შენახვა (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "ტრაფიკის ინფრასტრუქტურა და OEM პრეინსტალაცია"
  },
  "es": {
    "backToHub": "← Hub",
    "downloadPdf": "Descargar PDF Original ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Diapositiva {current} de {total}",
    "prev": "Anterior",
    "next": "Siguiente",
    "interactiveMode": "Interactivo (Traducido)",
    "visualMode": "Diapositivas originales",
    "fullscreen": "Pantalla completa",
    "exitFullscreen": "Salir",
    "selectLanguage": "Idioma",
    "swipeHint": "Desliza o usa las teclas de flecha",
    "clipInCta": "Conectar con Alex",
    "saveVcf": "Guardar contacto (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Infraestructura de Tráfico y Precargas OEM"
  },
  "de": {
    "backToHub": "← Hub",
    "downloadPdf": "Original-PDF herunterladen ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Folie {current} von {total}",
    "prev": "Zurück",
    "next": "Weiter",
    "interactiveMode": "Interaktiv (Deutsch)",
    "visualMode": "Original-Folien",
    "fullscreen": "Vollbild",
    "exitFullscreen": "Beenden",
    "selectLanguage": "Sprache",
    "swipeHint": "Wischen oder Pfeiltasten verwenden",
    "clipInCta": "Mit Alex verbinden",
    "saveVcf": "Kontakt speichern (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Traffic-Infrastruktur & OEM-Preloads"
  },
  "fr": {
    "backToHub": "← Hub",
    "downloadPdf": "Télécharger le PDF Original ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Diapositive {current} sur {total}",
    "prev": "Précédent",
    "next": "Suivant",
    "interactiveMode": "Interactif (Français)",
    "visualMode": "Diapositives originales",
    "fullscreen": "Plein écran",
    "exitFullscreen": "Quitter",
    "selectLanguage": "Langue",
    "swipeHint": "Balayez ou utilisez les touches fléchées",
    "clipInCta": "Échanger avec Alex",
    "saveVcf": "Enregistrer contact (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Infrastructure de Trafic & Préchargements OEM"
  },
  "zh": {
    "backToHub": "← 展会中心",
    "downloadPdf": "下载原版 PDF ↗",
    "openPdfViewer": "PDF",
    "slideOf": "第 {current} / {total} 页",
    "prev": "上一页",
    "next": "下一页",
    "interactiveMode": "交互模式 (中文)",
    "visualMode": "原版幻灯片",
    "fullscreen": "全屏浏览",
    "exitFullscreen": "退出全屏",
    "selectLanguage": "语言",
    "swipeHint": "滑动屏幕或使用方向键翻页",
    "clipInCta": "与 Alex 建立联系",
    "saveVcf": "保存名片 (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "流量基础设施与 OEM 预装方案"
  },
  "ja": {
    "backToHub": "← ハブへ戻る",
    "downloadPdf": "オリジナルPDFをダウンロード ↗",
    "openPdfViewer": "PDF",
    "slideOf": "スライド {current} / {total}",
    "prev": "前へ",
    "next": "次へ",
    "interactiveMode": "インタラクティブ (日本語)",
    "visualMode": "オリジナルスライド",
    "fullscreen": "全画面表示",
    "exitFullscreen": "全画面解除",
    "selectLanguage": "言語",
    "swipeHint": "スワイプまたは矢印キーで移動",
    "clipInCta": "Alexとつながる",
    "saveVcf": "連絡先を保存 (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "トラフィックインフラ＆OEMプレインストール"
  },
  "ko": {
    "backToHub": "← 허브",
    "downloadPdf": "원본 PDF 다운로드 ↗",
    "openPdfViewer": "PDF",
    "slideOf": "슬라이드 {current} / {total}",
    "prev": "이전",
    "next": "다음",
    "interactiveMode": "인터랙티브 (한국어)",
    "visualMode": "원본 슬라이드",
    "fullscreen": "전체 화면",
    "exitFullscreen": "종료",
    "selectLanguage": "언어",
    "swipeHint": "스와이프하거나 방향키를 사용하세요",
    "clipInCta": "Alex와 연결하기",
    "saveVcf": "연락처 저장 (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "트래픽 인프라 및 OEM 사전 탑재"
  },
  "pt": {
    "backToHub": "← Hub",
    "downloadPdf": "Baixar PDF Original ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Slide {current} de {total}",
    "prev": "Anterior",
    "next": "Próximo",
    "interactiveMode": "Interativo (Português)",
    "visualMode": "Slides Originais",
    "fullscreen": "Tela cheia",
    "exitFullscreen": "Sair",
    "selectLanguage": "Idioma",
    "swipeHint": "Deslize ou use as setas do teclado",
    "clipInCta": "Conectar com Alex",
    "saveVcf": "Salvar contato (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Infraestrutura de Tráfego e Pré-instalações OEM"
  },
  "it": {
    "backToHub": "← Hub",
    "downloadPdf": "Scarica PDF Originale ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Slide {current} di {total}",
    "prev": "Precedente",
    "next": "Successivo",
    "interactiveMode": "Interattivo (Italiano)",
    "visualMode": "Slide originali",
    "fullscreen": "Schermo intero",
    "exitFullscreen": "Esci",
    "selectLanguage": "Lingua",
    "swipeHint": "Scorri o usa i tasti freccia",
    "clipInCta": "Connettiti con Alex",
    "saveVcf": "Salva contatto (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Infrastruttura di Traffico & Preinstallazioni OEM"
  },
  "pl": {
    "backToHub": "← Hub",
    "downloadPdf": "Pobierz oryginalny PDF ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Slajd {current} z {total}",
    "prev": "Wstecz",
    "next": "Dalej",
    "interactiveMode": "Interaktywny (Polski)",
    "visualMode": "Oryginalne slajdy",
    "fullscreen": "Pełny ekran",
    "exitFullscreen": "Wyjdź",
    "selectLanguage": "Język",
    "swipeHint": "Przesuń lub użyj strzałek na klawiaturze",
    "clipInCta": "Połącz się z Alexem",
    "saveVcf": "Zapisz kontakt (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Infrastruktura Ruchu & Preinstalacje OEM"
  },
  "tr": {
    "backToHub": "← Merkez",
    "downloadPdf": "Orijinal PDF İndir ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Slayt {current} / {total}",
    "prev": "Geri",
    "next": "İleri",
    "interactiveMode": "Etkileşimli (Türkçe)",
    "visualMode": "Orijinal Slaytlar",
    "fullscreen": "Tam Ekran",
    "exitFullscreen": "Çıkış",
    "selectLanguage": "Dil",
    "swipeHint": "Kaydırın veya ok tuşlarını kullanın",
    "clipInCta": "Alex ile Bağlantı Kur",
    "saveVcf": "Kişiyi Kaydet (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Trafik Altyapısı ve OEM Ön Yüklemeleri"
  },
  "uk": {
    "backToHub": "← Хаб",
    "downloadPdf": "Завантажити оригінальний PDF ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Слайд {current} з {total}",
    "prev": "Назад",
    "next": "Вперед",
    "interactiveMode": "Інтерактивний (Українська)",
    "visualMode": "Оригінальні слайди",
    "fullscreen": "Повний екран",
    "exitFullscreen": "Вихід",
    "selectLanguage": "Мова",
    "swipeHint": "Свайпайте або використовуйте стрілки клавіатури",
    "clipInCta": "Зв'язатися з Алексом",
    "saveVcf": "Зберегти контакт (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Трафік-інфраструктура та OEM-прелоади"
  },
  "ar": {
    "backToHub": "← المنصة",
    "downloadPdf": "تحميل ملف PDF الأصلي ↗",
    "openPdfViewer": "PDF",
    "slideOf": "شريحة {current} من {total}",
    "prev": "السابق",
    "next": "التالي",
    "interactiveMode": "تفاعلي (عربي)",
    "visualMode": "الشرائح الأصلية",
    "fullscreen": "ملء الشاشة",
    "exitFullscreen": "إنهاء",
    "selectLanguage": "اللغة",
    "swipeHint": "اسحب أو استخدم مفاتيح الأسهم للتنقل",
    "clipInCta": "تواصل مع أليكس",
    "saveVcf": "حفظ جهة الاتصال (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "البنية التحتية لحركة المرور والتثبيت المسبق OEM"
  },
  "he": {
    "backToHub": "← למרכז",
    "downloadPdf": "הורד קובץ PDF מקורי ↗",
    "openPdfViewer": "PDF",
    "slideOf": "שקופית {current} מתוך {total}",
    "prev": "הקודם",
    "next": "הבא",
    "interactiveMode": "אינטראקטיבי (עברית)",
    "visualMode": "שקופיות מקוריות",
    "fullscreen": "מסך מלא",
    "exitFullscreen": "יציאה",
    "selectLanguage": "שפה",
    "swipeHint": "החלק או השתמש במקשי החצים",
    "clipInCta": "צור קשר עם אלכס",
    "saveVcf": "שמור איש קשר (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "תשתית תנועה והתקנות מראש OEM"
  },
  "hi": {
    "backToHub": "← हब",
    "downloadPdf": "मूल PDF डाउनलोड करें ↗",
    "openPdfViewer": "PDF",
    "slideOf": "स्लाइड {current} / {total}",
    "prev": "पिछला",
    "next": "अगला",
    "interactiveMode": "इंटरएक्टिव (हिन्दी)",
    "visualMode": "मूल स्लाइड्स",
    "fullscreen": "फुलस्क्रीन",
    "exitFullscreen": "बाहर निकलें",
    "selectLanguage": "भाषा",
    "swipeHint": "स्वाइप करें या तीर कुंजियों का उपयोग करें",
    "clipInCta": "एलेक्स से संपर्क करें",
    "saveVcf": "संपर्क सहेजें (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "ट्रैफ़िक इंफ्रास्ट्रक्चर और OEM प्रीलोड्स"
  },
  "vi": {
    "backToHub": "← Hub",
    "downloadPdf": "Tải PDF Gốc ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Trang {current} / {total}",
    "prev": "Trước",
    "next": "Tiếp",
    "interactiveMode": "Tương tác (Tiếng Việt)",
    "visualMode": "Slide gốc",
    "fullscreen": "Toàn màn hình",
    "exitFullscreen": "Thoát",
    "selectLanguage": "Ngôn ngữ",
    "swipeHint": "Vuốt hoặc dùng phím mũi tên",
    "clipInCta": "Kết nối với Alex",
    "saveVcf": "Lưu liên hệ (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Hạ tầng Traffic & Cài đặt sẵn OEM"
  },
  "th": {
    "backToHub": "← ฮับ",
    "downloadPdf": "ดาวน์โหลด PDF ต้นฉบับ ↗",
    "openPdfViewer": "PDF",
    "slideOf": "สไลด์ {current} จาก {total}",
    "prev": "ก่อนหน้า",
    "next": "ถัดไป",
    "interactiveMode": "อินเทอร์แอคทีฟ (ไทย)",
    "visualMode": "สไลด์ต้นฉบับ",
    "fullscreen": "เต็มหน้าจอ",
    "exitFullscreen": "ออก",
    "selectLanguage": "ภาษา",
    "swipeHint": "ปัดหรือใช้ปุ่มลูกศร",
    "clipInCta": "ติดต่อกับ Alex",
    "saveVcf": "บันทึกรายชื่อ (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "โครงสร้างพื้นฐานทราฟฟิก & พรีโหลด OEM"
  },
  "id": {
    "backToHub": "← Hub",
    "downloadPdf": "Unduh PDF Asli ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Slide {current} dari {total}",
    "prev": "Sebelumnya",
    "next": "Berikutnya",
    "interactiveMode": "Interaktif (Indonesia)",
    "visualMode": "Slide Asli",
    "fullscreen": "Layar Penuh",
    "exitFullscreen": "Keluar",
    "selectLanguage": "Bahasa",
    "swipeHint": "Geser atau gunakan tombol panah",
    "clipInCta": "Terhubung dengan Alex",
    "saveVcf": "Simpan Kontak (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Infrastruktur Traffic & Preload OEM"
  },
  "fil": {
    "backToHub": "← Hub",
    "downloadPdf": "I-download ang Orihinal na PDF ↗",
    "openPdfViewer": "PDF",
    "slideOf": "Slide {current} sa {total}",
    "prev": "Nakaraan",
    "next": "Susunod",
    "interactiveMode": "Interactive (Filipino)",
    "visualMode": "Orihinal na Slides",
    "fullscreen": "Fullscreen",
    "exitFullscreen": "Umalis",
    "selectLanguage": "Wika",
    "swipeHint": "I-swipe o gamitin ang arrow keys",
    "clipInCta": "Kumonekta kay Alex",
    "saveVcf": "I-save ang Contact (.vcf)",
    "contactAlex": "Executive Desk",
    "deckTitle": "Traffic Infrastructure at OEM Preloads"
  }
};

export const DECK_SLIDES_EN: Record<number, DeckSlideContent> = {
  1: {
      "slideNumber": 1,
      "kicker": "UPRAISER AGENCY · 2026 MEDIA KIT",
      "title": "We See How Stunning Your Rise to the Top Can Be.",
      "subtitle": "Your Premium Traffic Provider · Official Agency of Lenovo PC HK LTD",
      "metrics": [
          {
              "value": "100+",
              "label": "Target GEOs",
              "sub": "Global Tier-1 & LATAM/APAC"
          },
          {
              "value": "OEM",
              "label": "Direct Preloads",
              "sub": "Lenovo · Xiaomi · Samsung"
          },
          {
              "value": "0%",
              "label": "Post-Attr Fraud",
              "sub": "Real-time edge blocking"
          }
      ],
      "tagline": "Exclusive hardware preloads, certified programmatic SDKs, and enterprise anti-fraud."
  },
  2: {
      "slideNumber": 2,
      "kicker": "THE MISSION",
      "title": "Performance First: Technical Infrastructure, Not Just an Agency.",
      "subtitle": "As the official agency of Lenovo PC HK LTD, we transform product potential into market reality through exclusive hardware access and proprietary tech.",
      "bullets": [
          {
              "title": "Moving Beyond Vanity CPI",
              "desc": "We optimize directly for metrics that drive the business: Deposit Rates, Subscription Growth, and Customer LTV.",
              "badge": "CORE METRICS"
          },
          {
              "title": "Direct Hardware Access",
              "desc": "Direct ROM factory preloads and dynamic Google PAI deployment on premier Android devices.",
              "badge": "TIER-1 OEM"
          },
          {
              "title": "Zero-Arbitrage Integrity",
              "desc": "Transparent reporting with no opaque resale layers or unverified broker syndication.",
              "badge": "TRANSPARENCY"
          }
      ],
      "tagline": "Official Partner: Lenovo PC HK LTD · Enterprise Performance"
  },
  3: {
      "slideNumber": 3,
      "kicker": "GLOBAL REACH",
      "title": "Global Reach, Surgical Precision.",
      "subtitle": "Unified traffic operations delivering consistent volume and compliance worldwide.",
      "metrics": [
          {
              "value": "100+",
              "label": "Territories",
              "sub": "Tier-1 US/EU & Emerging APAC/LATAM"
          },
          {
              "value": "24/7",
              "label": "Execution",
              "sub": "Continuous media buying across all time zones"
          },
          {
              "value": "Single",
              "label": "Integration",
              "sub": "One unified engineering team managing global scale"
          }
      ],
      "tagline": "One contract, one SDK link, universal distribution."
  },
  4: {
      "slideNumber": 4,
      "kicker": "ACQUISITION ARCHITECTURE",
      "title": "The Omnichannel Matrix: We Follow the User, Not the Platform.",
      "subtitle": "Our proprietary media mix diversifies risk and maximizes reach across four complementary acquisition pillars.",
      "bullets": [
          {
              "title": "OEM & Pre-installs",
              "desc": "Factory ROM integration and OOBE setups directly on Lenovo, Xiaomi, Samsung, and Oppo devices.",
              "badge": "HARDWARE"
          },
          {
              "title": "In-App Programmatic",
              "desc": "Direct SDK access to 100,000+ active apps with behavioral scoring and rewarded video.",
              "badge": "PROGRAMMATIC"
          },
          {
              "title": "Social & Search",
              "desc": "Capturing active intent on Google, Bing, Yahoo and granular audience lookalikes on Meta & TikTok.",
              "badge": "PERFORMANCE"
          },
          {
              "title": "Native & Editorial",
              "desc": "Contextual trust transfer from top-tier publications including WSJ and Financial Times contexts.",
              "badge": "AUTHORITY"
          }
      ],
      "tagline": "Diversified multi-touch attribution with zero single-platform dependency."
  },
  5: {
      "slideNumber": 5,
      "kicker": "PILLAR 01 · HARDWARE ADVANTAGE",
      "title": "Direct Access to Tier-1 OEM Inventory.",
      "subtitle": "Exclusive OEM partnerships delivering Your application directly into consumers' hands from first boot.",
      "bullets": [
          {
              "title": "Factory Pre-Install (Hardcoded)",
              "desc": "ROM-level integration before the device leaves the assembly line. Your app is present from Day 1 with absolute zero fraud.",
              "badge": "HARDCODED"
          },
          {
              "title": "Cloud Pre-Install (Agile)",
              "desc": "Triggered dynamically during initial device setup (OOBE). Live in 1-2 days via Google PAI with instant targeting flexibility.",
              "badge": "DYNAMIC"
          },
          {
              "title": "OEM Brand Store Featuring",
              "desc": "Premium placement in Lenovo, Samsung, and Xiaomi native app markets with guaranteed visibility.",
              "badge": "FEATURING"
          }
      ],
      "tagline": "Lenovo · Xiaomi · Samsung · Oppo"
  },
  6: {
      "slideNumber": 6,
      "kicker": "PILLAR 02 · IN-APP PROGRAMMATIC",
      "title": "Scale via Direct SDK Integration.",
      "subtitle": "Connecting directly to 100,000+ active mobile apps through direct DSP & SSP pipes.",
      "metrics": [
          {
              "value": "100K+",
              "label": "Active Apps",
              "sub": "Direct SDK connections"
          },
          {
              "value": "Real-Time",
              "label": "Bidding",
              "sub": "Microsecond algorithmic valuation"
          },
          {
              "value": "High LTV",
              "label": "Cohort Focus",
              "sub": "Session depth & usage frequency filters"
          }
      ],
      "bullets": [
          {
              "title": "Behavioral Targeting",
              "desc": "We analyze App Usage Frequency and Session Depth to bid only when user engagement signals are at their peak.",
              "badge": "AI SCORING"
          },
          {
              "title": "Rewarded Video & Playables",
              "desc": "High-impact interactive rich media units that educate users before installation.",
              "badge": "INTERACTIVE"
          }
      ],
      "tagline": "Pure signal programmatic without middleman markup."
  },
  7: {
      "slideNumber": 7,
      "kicker": "PILLAR 03 · SOCIAL & SEARCH ARBITRAGE",
      "title": "Capturing High Intent Across Premier Platforms.",
      "subtitle": "Bridging the gap between passive browsing and active commercial conversion.",
      "bullets": [
          {
              "title": "Search Intent Capture",
              "desc": "Capturing active demand on Google, Bing, and Yahoo via high-intent financial and gaming keywords.",
              "badge": "SEARCH"
          },
          {
              "title": "Social Segmentation",
              "desc": "Granular audience segmentation on Meta and TikTok delivering personalized acquisition funnels.",
              "badge": "SOCIAL"
          },
          {
              "title": "Creative Dynamic Testing",
              "desc": "Continuous multivariate testing of visual angles, hooks, and localized calls to action.",
              "badge": "CREATIVE LAB"
          }
      ],
      "tagline": "High-intent keyword arbitrage delivering users with immediate willingness to pay."
  },
  8: {
      "slideNumber": 8,
      "kicker": "PILLAR 04 · NATIVE & EDITORIAL PRESTIGE",
      "title": "Trust Transfer from Global Editorial Media.",
      "subtitle": "Leveraging the credibility of premier financial and tech news publishers.",
      "bullets": [
          {
              "title": "Editorial Context Placement",
              "desc": "Positioning Your brand within respected business contexts such as Financial Times and WSJ style feeds.",
              "badge": "CREDIBILITY"
          },
          {
              "title": "High-CPA Conversion Strategy",
              "desc": "Curated inventory strictly aligned with CPA and deposit goals, leveraging publisher authority.",
              "badge": "HIGH CPA"
          },
          {
              "title": "Content Recommendation Feeds",
              "desc": "Native recommendation widgets (Taboola, Outbrain) reaching engaged corporate decision-makers.",
              "badge": "NATIVE"
          }
      ],
      "tagline": "Translating media prestige into measurable high-deposit user acquisition."
  },
  9: {
      "slideNumber": 9,
      "kicker": "THE ENGINE · DATA PLATFORM",
      "title": "The Engine: Proprietary DMP & Predictive Scoring.",
      "subtitle": "Algorithmic decision-making turning device telemetry into customer lifetime value.",
      "bullets": [
          {
              "title": "Predictive LTV Scoring",
              "desc": "Our strategists evaluate unique hardware signals to predict user monetization potential before the impression is served.",
              "badge": "PREDICTIVE"
          },
          {
              "title": "Total Operating Clarity",
              "desc": "Zero black boxes. You inspect the exact campaign execution and raw log data that we see, at all times.",
              "badge": "OPEN LOGS"
          },
          {
              "title": "Three-Tier Processing Pipe",
              "desc": "[ Data In ] ➔ [ Predictive Model ] ➔ [ Optimized Bid ] executed in sub-50ms cycles.",
              "badge": "REAL-TIME"
          }
      ],
      "tagline": "We bid on future value, not historical vanity clicks."
  },
  10: {
      "slideNumber": 10,
      "kicker": "THE SHIELD · ZERO TOLERANCE",
      "title": "If We Can't Verify It, We Don't Buy It.",
      "subtitle": "Certified enterprise anti-fraud stack screening every single impression and install in real time.",
      "metrics": [
          {
              "value": "100%",
              "label": "MMP Verified",
              "sub": "AppsFlyer · Adjust · Kochava · Singular"
          },
          {
              "value": "Edge",
              "label": "Inspection",
              "sub": "Real-time click & impression hygiene"
          },
          {
              "value": "0",
              "label": "Tolerance",
              "sub": "Zero budget for spoofed traffic"
          }
      ],
      "bullets": [
          {
              "title": "Install Hijacking Defense",
              "desc": "Immediate rejection of click injection and attribution stealing attempts before payout.",
              "badge": "HIJACK FILTER"
          },
          {
              "title": "Click Flooding Shield",
              "desc": "Algorithmic detection of synthetic click spamming designed to game last-touch models.",
              "badge": "FLOOD SHIELD"
          }
      ],
      "tagline": "AppsFlyer Protect360 · Adjust · Kochava · Singular Certified"
  },
  11: {
      "slideNumber": 11,
      "kicker": "FRAUD METRICS · DEEP DIVE",
      "title": "Real-Time Bot Blocking in Action.",
      "subtitle": "Protecting marketing capital from non-human traffic and automated scripts.",
      "metrics": [
          {
              "value": "97.3%",
              "label": "Bots Blocked",
              "sub": "Synthetic emulators & datacenters"
          },
          {
              "value": "2.7%",
              "label": "Hijacking Filtered",
              "sub": "Click injection & attribution spoofing"
          },
          {
              "value": "100%",
              "label": "Human Focus",
              "sub": "Every dollar reaches real buyers"
          }
      ],
      "bullets": [
          {
              "title": "Datacenter IP Blacklisting",
              "desc": "Real-time filtering of VPN, proxy, and cloud server exit nodes before ad delivery.",
              "badge": "IP REPUTATION"
          },
          {
              "title": "Device Fingerprint Verification",
              "desc": "Hardware gyroscope, touch entropy, and battery state validation to confirm human presence.",
              "badge": "HEURISTICS"
          }
      ],
      "tagline": "Your marketing budget is spent exclusively on real humans with purchasing intent."
  },
  12: {
      "slideNumber": 12,
      "kicker": "QUALITY COMMITMENT",
      "title": "The 'Clean Install' Guarantee: Post-Attribution Fraud Rate 0%.",
      "subtitle": "Audited post-install performance proving zero fraud penetration.",
      "metrics": [
          {
              "value": "4,909",
              "label": "Clean Installs",
              "sub": "Total verified post-install events"
          },
          {
              "value": "4",
              "label": "Fraud Blocked",
              "sub": "Anomalies caught and rejected"
          },
          {
              "value": "0.0%",
              "label": "Final Fraud Rate",
              "sub": "Post-attribution audit verified"
          }
      ],
      "bullets": [
          {
              "title": "Real-Time Attribution Purity",
              "desc": "Preventing polluted synthetic records from ever entering Your MMP dashboards.",
              "badge": "MMP PURITY"
          },
          {
              "title": "Reconciliation Protection",
              "desc": "Zero end-of-month clawbacks or publisher billing disputes.",
              "badge": "ACCOUNTABILITY"
          }
      ],
      "tagline": "Clean attribution data yields reliable machine learning models."
  },
  13: {
      "slideNumber": 13,
      "kicker": "TIER-1 CASE STUDIES · IGAMING & FINTECH",
      "title": "High-Value Acquisition: Fanatics & Vantage Markets.",
      "subtitle": "Proven track record driving deposits in the world's most competitive performance verticals.",
      "bullets": [
          {
              "title": "Fanatics (iGaming & Sportsbook)",
              "desc": "Generated over $250,000 USD revenue in June '25 · Exceeded $500+ revenue per bettor · Strict 18+ geo-compliance & verification.",
              "badge": "FANATICS"
          },
          {
              "title": "Vantage Markets (FinTech & CFD)",
              "desc": "Delivered 800+ First Time Deposits (FTDs) · Average user value exceeding $150+ · Scaled high-value trader traffic via OEM preloads.",
              "badge": "VANTAGE"
          }
      ],
      "metrics": [
          {
              "value": "$250K+",
              "label": "Fanatics Revenue",
              "sub": "Single month scale (June '25)"
          },
          {
              "value": "$500+",
              "label": "Revenue / Bettor",
              "sub": "High-value player cohort"
          },
          {
              "value": "800+",
              "label": "Vantage FTDs",
              "sub": "Verified trading accounts"
          }
      ],
      "tagline": "Scaling high-value user volume while respecting strict regulatory boundaries."
  },
  14: {
      "slideNumber": 14,
      "kicker": "SCALE & RETENTION · UTILITY & COMMERCE",
      "title": "Scale & Retention: Snoop & High-CPA US News Context.",
      "subtitle": "Driving active user monetization across utility and financial publishing verticals.",
      "bullets": [
          {
              "title": "Snoop (FinTech & Utility)",
              "desc": "Strategy: CTV and high-intent behavioral targeting · 14,308 total clean installs · 4,580 'First Account Connected' verified deep-funnel events.",
              "badge": "SNOOP"
          },
          {
              "title": "The Wall Street Journal Context",
              "desc": "Market: High-CPA US Financial News readers · Delivered 3,000+ new verified purchases per month with sustained subscription retention.",
              "badge": "WSJ AUDIENCE"
          }
      ],
      "metrics": [
          {
              "value": "14,308",
              "label": "Snoop Installs",
              "sub": "Total verified volume"
          },
          {
              "value": "4,580",
              "label": "Account Link Events",
              "sub": "32% deep-funnel conversion"
          },
          {
              "value": "3,000+",
              "label": "Monthly Purchases",
              "sub": "High-CPA US financial readers"
          }
      ],
      "tagline": "We drive wallet-opening actions, not abandoned downloads."
  },
  15: {
      "slideNumber": 15,
      "kicker": "COMMERCIAL MODELS",
      "title": "Performance Matrix: Commercial Models Aligned With Your LTV.",
      "subtitle": "Tailored commercial structures that de-risk customer acquisition for growth teams.",
      "bullets": [
          {
              "title": "CPI (Cost Per Install)",
              "desc": "Volume-focused structure ideal for rapid market expansion and App Store / Google Play rank acceleration.",
              "badge": "VOLUME"
          },
          {
              "title": "CPA (Cost Per Action)",
              "desc": "Event-focused structure directly tied to First Time Deposits (FTDs), subscription starts, or in-app orders.",
              "badge": "DEPOSIT / ACTION"
          },
          {
              "title": "CPL (Cost Per Lead)",
              "desc": "Registration-focused structure tailored for fintech pre-launches, credit approvals, and trading signups.",
              "badge": "REGISTRATION"
          }
      ],
      "tagline": "Commercial terms customized directly around Your post-install payback windows."
  },
  16: {
      "slideNumber": 16,
      "kicker": "CASE STUDY A · SCALE WITHOUT COMPROMISE",
      "title": "4.4 Million Clicks Processed With 0% Fraud.",
      "subtitle": "Proof of algorithmic edge protection under extreme campaign burst velocity.",
      "metrics": [
          {
              "value": "4.4M",
              "label": "Total Clicks",
              "sub": "High-velocity campaign volume"
          },
          {
              "value": "3,174",
              "label": "Verified Installs",
              "sub": "100% human attribution"
          },
          {
              "value": "0.0%",
              "label": "Fraud Rate",
              "sub": "Audited via ADH schnackmox1_int"
          }
      ],
      "bullets": [
          {
              "title": "Massive Click Volume",
              "desc": "Filtering millions of clicks in real time without introducing latency or conversion drop-off.",
              "badge": "VOLUME FILTER"
          },
          {
              "title": "Zero Fraud Permeation",
              "desc": "Proprietary real-time firewall guaranteed zero fraudulent traffic entered the client pipeline.",
              "badge": "GUARANTEE"
          }
      ],
      "tagline": "Extreme scale paired with surgical data integrity."
  },
  17: {
      "slideNumber": 17,
      "kicker": "CASE STUDY B · DRIVING REAL REVENUE",
      "title": "Driving Real Wallet-Opening Actions.",
      "subtitle": "Snapshot from single-source campaign execution demonstrating day-over-day revenue compounding.",
      "metrics": [
          {
              "value": "$15,329",
              "label": "In-App Revenue",
              "sub": "7-day verified cohort"
          },
          {
              "value": "8.57%",
              "label": "Event Ratio",
              "sub": "High-intent event conversion"
          },
          {
              "value": "Daily",
              "label": "Compounding",
              "sub": "Stable deposit velocity"
          }
      ],
      "bullets": [
          {
              "title": "Monetization Velocity",
              "desc": "Documented performance showing active deposits occurring within hours of application install.",
              "badge": "VELOCITY"
          },
          {
              "title": "Cohort Retention",
              "desc": "Users acquired through OEM and high-intent programmatic show 2.4x higher Day-30 retention.",
              "badge": "RETENTION"
          }
      ],
      "tagline": "We measure success in net revenue generated, not vanity download counts."
  },
  18: {
      "slideNumber": 18,
      "kicker": "THE OPTIMIZATION CYCLE",
      "title": "Closed-Loop Compounding Performance.",
      "subtitle": "How search intent informs behavioral scoring for large-scale OEM expansion.",
      "bullets": [
          {
              "title": "Phase 1: Data Collection",
              "desc": "Capture high-intent keywords and conversion signals via Search and Social.",
              "badge": "PHASE 01"
          },
          {
              "title": "Phase 2: DMP Analysis & Modeling",
              "desc": "DMP profiles behavioral cohorts and predicts long-term customer LTV.",
              "badge": "PHASE 02"
          },
          {
              "title": "Phase 3: Massive Scaling",
              "desc": "Deploy winning audience vectors across high-volume OEM and In-App inventory.",
              "badge": "PHASE 03"
          }
      ],
      "tagline": "Continuous feedback loop: intent data constantly sharpens our OEM bidding curves."
  },
  19: {
      "slideNumber": 19,
      "kicker": "GOVERNANCE & SAFETY",
      "title": "Brand Safety, Compliance & Data Privacy.",
      "subtitle": "Enterprise governance standards safeguarding Your corporate reputation in every territory.",
      "bullets": [
          {
              "title": "Brand Safety Guarantee",
              "desc": "Strict contextual whitelisting ensuring ads appear exclusively alongside brand-safe content.",
              "badge": "SAFETY"
          },
          {
              "title": "Regulatory Compliance",
              "desc": "Full adherence to GDPR, CCPA, and vertical-specific licensing in iGaming and FinTech.",
              "badge": "LEGAL"
          },
          {
              "title": "Privacy by Design",
              "desc": "User identifiers are cryptographically hashed and anonymized at the edge without cross-site tracking.",
              "badge": "PRIVACY"
          }
      ],
      "tagline": "Enterprise compliance across 100+ global regulatory jurisdictions."
  },
  20: {
      "slideNumber": 20,
      "kicker": "THE BLUEPRINT · ONBOARDING",
      "title": "15-Day Fast-Track Onboarding Blueprint.",
      "subtitle": "A structured, de-risked roadmap from contract signing to profitable scale.",
      "bullets": [
          {
              "title": "Days 1–3: Strategy Workshop",
              "desc": "Define 6-month unit economics, LTV curve, and target acquisition payback models.",
              "badge": "DAYS 1-3"
          },
          {
              "title": "Days 4–7: MMP & Data Integration",
              "desc": "Connect AppsFlyer / Adjust / Kochava postbacks and calibrate DMP attribution pixels.",
              "badge": "DAYS 4-7"
          },
          {
              "title": "Days 8–15: Pilot Launch & Proof",
              "desc": "Deploy targeted A/B test flights across verified OEM inventory to validate unit economics.",
              "badge": "DAYS 8-15"
          }
      ],
      "tagline": "Ready to scale Your traffic infrastructure? Clip in with Alex."
  },
};

export const DECK_SLIDES_RU: Record<number, DeckSlideContent> = {
  1: {
      "slideNumber": 1,
      "kicker": "UPRAISER AGENCY · 2026 MEDIA KIT",
      "title": "Мы видим, насколько впечатляющим может быть Ваш взлет на вершину.",
      "subtitle": "Ваш премиальный трафик-провайдер · Официальное агентство Lenovo PC HK LTD",
      "metrics": [
          {
              "value": "100+",
              "label": "Целевых ГЕО",
              "sub": "Глобальный Tier-1, LATAM, APAC"
          },
          {
              "value": "OEM",
              "label": "Прямые прелоады",
              "sub": "Lenovo · Xiaomi · Samsung"
          },
          {
              "value": "0%",
              "label": "Пост-атрибуционный фрод",
              "sub": "Блокировка ботов в реальном времени"
          }
      ],
      "tagline": "Эксклюзивные заводские прелоады, сертифицированные SDK и корпоративная защита от фрода."
  },
  2: {
      "slideNumber": 2,
      "kicker": "МИССИЯ АГЕНТСТВА",
      "title": "Результат превыше всего: техническая инфраструктура, а не просто агентство.",
      "subtitle": "Как официальное агентство Lenovo PC HK LTD, мы превращаем потенциал продукта в доминирование на рынке благодаря прямому доступу к «железу» и собственному софту.",
      "bullets": [
          {
              "title": "Отказ от пустых метрик (CPI)",
              "desc": "Мы оптимизируем закупку строго под бизнес-результаты: конверсию в депозит (FTD), рост платных подписок и окупаемость LTV.",
              "badge": "БИЗНЕС-МЕТРИКИ"
          },
          {
              "title": "Прямой доступ к устройствам",
              "desc": "Заводская прошивка ROM и гибкое облачное развертывание через Google PAI на смартфонах и планшетах.",
              "badge": "TIER-1 OEM"
          },
          {
              "title": "Прозрачность без перепродажи",
              "desc": "Прямые закупки без скрытых посредников, непроверенных брокеров и темных сеток.",
              "badge": "ЧИСТЫЙ СИГНАЛ"
          }
      ],
      "tagline": "Официальный партнер: Lenovo PC HK LTD · Корпоративная надежность"
  },
  3: {
      "slideNumber": 3,
      "kicker": "ГЛОБАЛЬНЫЙ МАСШТАБ",
      "title": "Глобальный охват, хирургическая точность.",
      "subtitle": "Единая система управления закупкой трафика с круглосуточной оптимизацией по всему миру.",
      "metrics": [
          {
              "value": "100+",
              "label": "Территорий",
              "sub": "Tier-1 рынки США/ЕС и развивающиеся APAC/LATAM"
          },
          {
              "value": "24/7",
              "label": "Закупка трафика",
              "sub": "Непрерывная оптимизация во всех часовых поясах"
          },
          {
              "value": "Единая",
              "label": "Интеграция",
              "sub": "Одна команда инженеров для глобального масштабирования"
          }
      ],
      "tagline": "Один договор, единая интеграция, международная дистрибуция."
  },
  4: {
      "slideNumber": 4,
      "kicker": "АРХИТЕКТУРА ЗАКУПКИ",
      "title": "Омниканальная матрица: мы следуем за пользователем, а не за платформой.",
      "subtitle": "Наш трафик-микс диверсифицирует риски и максимизирует охват за счет четырех независимых опор.",
      "bullets": [
          {
              "title": "OEM и преинсталлы",
              "desc": "Прямая заводская интеграция в прошивку ROM и экран первого запуска (OOBE) на устройствах Lenovo, Xiaomi, Samsung, Oppo.",
              "badge": "ЖЕЛЕЗО"
          },
          {
              "title": "In-App Программатик",
              "desc": "Прямой доступ через SDK к 100 000+ активных мобильных приложений с оценкой поведения пользователей.",
              "badge": "PROGRAMMATIC"
          },
          {
              "title": "Social & Search арбитраж",
              "desc": "Перехват горячего спроса в Google, Bing, Yahoo и точечные аудиторные сегменты в Meta и TikTok.",
              "badge": "ПЕРФОРМАНС"
          },
          {
              "title": "Native и СМИ-авторитет",
              "desc": "Контекстный перенос доверия из ведущих мировых изданий уровня The Wall Street Journal и Financial Times.",
              "badge": "ДОВЕРИЕ"
          }
      ],
      "tagline": "Диверсифицированная атрибуция без критической зависимости от одного источника."
  },
  5: {
      "slideNumber": 5,
      "kicker": "ОПОРА 01 · ПРЕИМУЩЕСТВО В ЖЕЛЕЗЕ",
      "title": "Прямой доступ к инвентарю ведущих мировых OEM-производителей.",
      "subtitle": "Эксклюзивные OEM-контракты доставляют Ваше приложение в руки пользователя с момента первого включения.",
      "bullets": [
          {
              "title": "Заводской преинсталл (Hardcoded)",
              "desc": "Интеграция в прошивку ROM на конвейере фабрики. Ваше приложение предустановлено с 1-го дня. Фрод технически исключен.",
              "badge": "ВШИТО В ROM"
          },
          {
              "title": "Облачный преинсталл (Agile)",
              "desc": "Активация при первоначальной настройке устройства (OOBE). Запуск за 1-2 дня через Google PAI с гибким таргетингом.",
              "badge": "GOOGLE PAI"
          },
          {
              "title": "Размещение в фирменных сторах",
              "desc": "Приоритетный фичеринг в нативных магазинах приложений Lenovo, Samsung и Xiaomi с гарантированной видимостью.",
              "badge": "ФИЧЕРИНГ"
          }
      ],
      "tagline": "Lenovo · Xiaomi · Samsung · Oppo"
  },
  6: {
      "slideNumber": 6,
      "kicker": "ОПОРА 02 · IN-APP ПРОГРАММАТИК",
      "title": "Масштабирование через прямую SDK-интеграцию.",
      "subtitle": "Прямое подключение к более чем 100 000 активных приложений без посредников.",
      "metrics": [
          {
              "value": "100K+",
              "label": "Активных приложений",
              "sub": "Прямые SDK-коннекты"
          },
          {
              "value": "Real-Time",
              "label": "Аукционы",
              "sub": "Алгоритмическая оценка за миллисекунды"
          },
          {
              "value": "Высокий LTV",
              "label": "Когорты покупателей",
              "sub": "Фильтры частоты и глубины сессий"
          }
      ],
      "bullets": [
          {
              "title": "Поведенческий таргетинг",
              "desc": "Мы анализируем частоту открытия приложений и глубину сессий, делая ставки в момент пиковой готовности к конверсии.",
              "badge": "AI СКОРИНГ"
          },
          {
              "title": "Rewarded Video & Playables",
              "desc": "Интерактивные форматы с вознаграждением, которые вовлекают пользователя до момента установки.",
              "badge": "ИНТЕРАКТИВ"
          }
      ],
      "tagline": "Чистый программатик-сигнал без наценок агентств-посредников."
  },
  7: {
      "slideNumber": 7,
      "kicker": "ОПОРА 03 · SOCIAL & SEARCH АРБИТРАЖ",
      "title": "Перехват горячего спроса на премиальных платформах.",
      "subtitle": "Сокращаем дистанцию между поисковым интересом и оплатой в приложении.",
      "bullets": [
          {
              "title": "Поисковый интент",
              "desc": "Сбор активного коммерческого спроса в Google, Bing и Yahoo по узким финансовым и игровым ключевым запросам.",
              "badge": "ПОИСК"
          },
          {
              "title": "Сегментация в соцсетях",
              "desc": "Глубокая кластеризация аудиторий в Meta и TikTok для запуска персонализированных сценариев вовлечения.",
              "badge": "СОЦСЕТИ"
          },
          {
              "title": "Динамические тесты креативов",
              "desc": "Непрерывное сплит-тестирование видеоуглов, хуков и локализованных призывов к действию.",
              "badge": "ЛАБОРАТОРИЯ"
          }
      ],
      "tagline": "Арбитраж осознанного спроса: привлечение пользователей с подтвержденной платежеспособностью."
  },
  8: {
      "slideNumber": 8,
      "kicker": "ОПОРА 04 · NATIVE И СМИ-АВТОРИТЕТ",
      "title": "Перенос доверия из ведущих мировых деловых СМИ.",
      "subtitle": "Использование авторитета ведущих финансовых и технологических изданий.",
      "bullets": [
          {
              "title": "Контекстное размещение",
              "desc": "Позиционирование Вашего бренда в окружении премиального бизнес-контента Financial Times и The Wall Street Journal.",
              "badge": "РЕПУТАЦИЯ"
          },
          {
              "title": "Стратегия высокого CPA",
              "desc": "Курируемый инвентарь с жесткой привязкой к стоимости депозита (CPA), конвертирующий доверие в деньги.",
              "badge": "ВЫСОКИЙ СРА"
          },
          {
              "title": "Нативные рекомендательные сети",
              "desc": "Премиальные блоки Taboola и Outbrain для привлечения лиц, принимающих финансовые решения.",
              "badge": "НАТИВ"
          }
      ],
      "tagline": "Превращаем репутационный капитал медиа в прогнозируемый поток депозитов."
  },
  9: {
      "slideNumber": 9,
      "kicker": "ДВИЖОК · DATA PLATFORM",
      "title": "Движок: собственная DMP и предиктивный скоринг.",
      "subtitle": "Алгоритмы машинного обучения превращают сигналы устройств в пожизненную ценность клиента (LTV).",
      "bullets": [
          {
              "title": "Предиктивный скоринг LTV",
              "desc": "Наши алгоритмы анализируют технические параметры устройства, чтобы предсказать готовность пользователя платить еще до показа рекламы.",
              "badge": "ПРЕДИКТИВ"
          },
          {
              "title": "Абсолютная прозрачность",
              "desc": "Никаких «черных ящиков». Вы в любой момент видите те же сырые логи и параметры закупки, что и наши байеры.",
              "badge": "ОТКРЫТЫЕ ЛОГИ"
          },
          {
              "title": "Трехэтапный конвейер",
              "desc": "[ Входящие данные ] ➔ [ Предиктивная модель ] ➔ [ Оптимальная ставка ] за 50 миллисекунд.",
              "badge": "REAL-TIME"
          }
      ],
      "tagline": "Мы покупаем будущую выручку, а не пустые клики из прошлого."
  },
  10: {
      "slideNumber": 10,
      "kicker": "ЩИТ · НУЛЕВАЯ ТОЛЕРАНТНОСТЬ К ФРОДУ",
      "title": "Если мы не можем это верифицировать — мы это не покупаем.",
      "subtitle": "Сертифицированный контур антифрода фильтрует каждый показ и установку в реальном времени.",
      "metrics": [
          {
              "value": "100%",
              "label": "Верификация MMP",
              "sub": "AppsFlyer · Adjust · Kochava · Singular"
          },
          {
              "value": "Edge",
              "label": "Фильтрация на шлюзе",
              "sub": "Мгновенная гигиена трафика"
          },
          {
              "value": "0",
              "label": "Толерантность к ботам",
              "sub": "Ноль бюджета на фальшивый трафик"
          }
      ],
      "bullets": [
          {
              "title": "Защита от перехвата установок",
              "desc": "Мгновенная блокировка клик-инъекций и попыток кражи атрибуции до выплаты партнерам.",
              "badge": "АНТИ-ПЕРЕХВАТ"
          },
          {
              "title": "Блокировка клик-флуда",
              "desc": "Алгоритмическое пресечение накрутки кликов, созданной для обмана моделей Last-Touch.",
              "badge": "АНТИ-СПАМ"
          }
      ],
      "tagline": "Сертифицировано: AppsFlyer Protect360 · Adjust · Kochava · Singular"
  },
  11: {
      "slideNumber": 11,
      "kicker": "АНАЛИЗ ДАННЫХ · БОРЬБА С БОТАМИ",
      "title": "Блокировка ботов в реальном времени на живых цифрах.",
      "subtitle": "Защита маркетингового бюджета от автоматических скриптов и ферм эмуляторов.",
      "metrics": [
          {
              "value": "97.3%",
              "label": "Ботов отсечено",
              "sub": "Эмуляторы, дата-центры и скрипты"
          },
          {
              "value": "2.7%",
              "label": "Попыток перехвата",
              "sub": "Клик-инъекции и подделка атрибуции"
          },
          {
              "value": "100%",
              "label": "Реальные люди",
              "sub": "Каждый доллар идет на живых клиентов"
          }
      ],
      "bullets": [
          {
              "title": "Черный список IP дата-центров",
              "desc": "Фильтрация выходных узлов VPN, прокси и облачных серверов до момента показа объявления.",
              "badge": "РЕПУТАЦИЯ IP"
          },
          {
              "title": "Аппаратный отпечаток устройства",
              "desc": "Проверка гироскопа, энтропии тач-событий и уровня батареи для подтверждения присутствия человека.",
              "badge": "ЭВРИСТИКА"
          }
      ],
      "tagline": "Ваш бюджет расходуется строго на живых людей с реальной покупательской способностью."
  },
  12: {
      "slideNumber": 12,
      "kicker": "ГАРАНТИЯ ЧИСТОТЫ",
      "title": "Гарантия «чистой установки»: пост-атрибуционный фрод 0%.",
      "subtitle": "Официальный аудит когорты установок, подтверждающий полное отсутствие фрода.",
      "metrics": [
          {
              "value": "4,909",
              "label": "Чистых установок",
              "sub": "Подтвержденных системой атрибуции"
          },
          {
              "value": "4",
              "label": "Фродовых отсечено",
              "sub": "Аномалий выявлено и заблокировано"
          },
          {
              "value": "0.0%",
              "label": "Итоговый фрод",
              "sub": "Подтверждено внешним аудитом"
          }
      ],
      "bullets": [
          {
              "title": "Чистота данных в MMP",
              "desc": "Защита Ваших аналитических дашбордов от замусоривания синтетическими событиями.",
              "badge": "ЧИСТЫЙ MMP"
          },
          {
              "title": "Отсутствие споров по счетам",
              "desc": "Никаких разногласий в конце месяца, возвратов и срезов трафика.",
              "badge": "НАДЕЖНОСТЬ"
          }
      ],
      "tagline": "Чистые данные атрибуции обучают рекламные модели приносить максимальную прибыль."
  },
  13: {
      "slideNumber": 13,
      "kicker": "КЕЙСЫ TIER-1 · IGAMING И ФИНТЕХ",
      "title": "Привлечение премиальных пользователей: кейсы Fanatics и Vantage.",
      "subtitle": "Доказанный опыт привлечения первых депозитов в самых конкурентных вертикалях планеты.",
      "bullets": [
          {
              "title": "Fanatics (iGaming и спорт-беттинг)",
              "desc": "Более $250,000 USD выручки за июнь 2025 · Выручка свыше $500+ на одного игрока · Строгий контроль возраста 18+ и ГЕО-лицензий.",
              "badge": "FANATICS"
          },
          {
              "title": "Vantage Markets (Финтех и CFD)",
              "desc": "Свыше 800+ первых депозитов (FTD) · Средняя ценность трейдера превысила $150+ · Масштабирование через заводские OEM-прелоады.",
              "badge": "VANTAGE"
          }
      ],
      "metrics": [
          {
              "value": "$250K+",
              "label": "Выручка Fanatics",
              "sub": "За один месяц (июнь '25)"
          },
          {
              "value": "$500+",
              "label": "Выручка на игрока",
              "sub": "Высокодоходная когорта"
          },
          {
              "value": "800+",
              "label": "Депозитов Vantage",
              "sub": "Верифицированные счета"
          }
      ],
      "tagline": "Масштабирование объема без нарушения строжайших регуляторных требований."
  },
  14: {
      "slideNumber": 14,
      "kicker": "МАСШТАБ И УДЕРЖАНИЕ · UTILITY И E-COMMERCE",
      "title": "Масштаб и удержание: кейс Snoop и контекст The Wall Street Journal.",
      "subtitle": "Монетизация пользователей в мобильных утилитах и подписках через финансовые медиа.",
      "bullets": [
          {
              "title": "Snoop (Финтех-утилита)",
              "desc": "Стратегия: CTV и поведенческий таргетинг · 14 308 чистых установок · 4 580 верифицированных событий привязки банковского счета.",
              "badge": "SNOOP"
          },
          {
              "title": "Контекст The Wall Street Journal",
              "desc": "Рынок: платежеспособная аудитория бизнес-новостей США · 3 000+ новых подтвержденных покупок ежемесячно с высоким удержанием.",
              "badge": "WSJ ЧИТАТЕЛИ"
          }
      ],
      "metrics": [
          {
              "value": "14,308",
              "label": "Установок Snoop",
              "sub": "Чистый подтвержденный объем"
          },
          {
              "value": "4,580",
              "label": "Привязок счетов",
              "sub": "Конверсия воронки 32%"
          },
          {
              "value": "3,000+",
              "label": "Покупок / месяц",
              "sub": "Премиальная аудитория США"
          }
      ],
      "tagline": "Мы привлекаем пользователей, которые открывают кошельки, а не удаляют приложение через час."
  },
  15: {
      "slideNumber": 15,
      "kicker": "КОММЕРЧЕСКИЕ МОДЕЛИ",
      "title": "Матрица эффективности: модели оплаты, привязанные к Вашему LTV.",
      "subtitle": "Гибкие форматы сотрудничества, снижающие риски маркетинговой команды.",
      "bullets": [
          {
              "title": "CPI (Оплата за установку)",
              "desc": "Фокус на объеме: идеален для быстрого захвата доли рынка и выхода в топ чартов App Store и Google Play.",
              "badge": "ОБЪЕМ"
          },
          {
              "title": "CPA (Оплата за целевое действие)",
              "desc": "Фокус на выручке: прямая привязка к первому депозиту (FTD), оформлению подписки или заказу.",
              "badge": "ДЕПОЗИТ / ДЕЙСТВИЕ"
          },
          {
              "title": "CPL (Оплата за квалифицированный лид)",
              "desc": "Фокус на регистрациях: оптимален для финтех-приложений, одобрения кредитных лимитов и открытия счетов.",
              "badge": "РЕГИСТРАЦИЯ"
          }
      ],
      "tagline": "Условия работы калибруются строго под Ваши окна окупаемости когорт."
  },
  16: {
      "slideNumber": 16,
      "kicker": "КЕЙС А · МАСШТАБ БЕЗ КОМПРОМИССОВ",
      "title": "Обработано 4,4 миллиона кликов с нулевым фродом.",
      "subtitle": "Доказательство надежности пограничных фильтров при пиковых нагрузках рекламных кампаний.",
      "metrics": [
          {
              "value": "4.4M",
              "label": "Всего кликов",
              "sub": "Масштабная закупка"
          },
          {
              "value": "3,174",
              "label": "Чистых инсталлов",
              "sub": "100% реальные люди"
          },
          {
              "value": "0.0%",
              "label": "Фрода в когорте",
              "sub": "Аудит по ADH schnackmox1_int"
          }
      ],
      "bullets": [
          {
              "title": "Колоссальный объем трафика",
              "desc": "Фильтрация миллионов запросов в миллисекунды без просадки скорости и конверсии воронки.",
              "badge": "ФИЛЬТР ОБЪЕМА"
          },
          {
              "title": "Нулевая утечка фрода",
              "desc": "Собственный файрвол гарантировал, что ни один фальшивый клик не проник в воронку клиента.",
              "badge": "ГАРАНТИЯ"
          }
      ],
      "tagline": "Максимальный масштаб закупки в сочетании с безупречной чистотой данных."
  },
  17: {
      "slideNumber": 17,
      "kicker": "КЕЙС Б · ПРЯМАЯ ВЫРУЧКА",
      "title": "Привлечение пользователей, готовых платить.",
      "subtitle": "Срез недельной кампании из одного источника с демонстрацией ежедневного прироста выручки.",
      "metrics": [
          {
              "value": "$15,329",
              "label": "Выручка за 7 дней",
              "sub": "Подтвержденная внутри приложения"
          },
          {
              "value": "8.57%",
              "label": "Конверсия в оплату",
              "sub": "Доля платящих пользователей"
          },
          {
              "value": "Рост",
              "label": "Каждый день",
              "sub": "Стабильная динамика депозитов"
          }
      ],
      "bullets": [
          {
              "title": "Скорость первой оплаты",
              "desc": "Пользователи совершают первый депозит уже в первые часы после установки приложения.",
              "badge": "СКОРОСТЬ"
          },
          {
              "title": "Удержание пользователей",
              "desc": "Трафик из OEM и качественного программатика показывает удержание Day-30 в 2.4 раза выше среднего по рынку.",
              "badge": "УДЕРЖАНИЕ"
          }
      ],
      "tagline": "Мы оцениваем успех в чистой заработанной прибыли клиента, а не в количестве скачиваний."
  },
  18: {
      "slideNumber": 18,
      "kicker": "ЦИКЛ ОПТИМИЗАЦИИ",
      "title": "Замкнутый цикл непрерывного масштабирования.",
      "subtitle": "Как поисковый интерес обучает скоринг для многократного роста в OEM-каналах.",
      "bullets": [
          {
              "title": "Этап 1: Сбор первичных данных",
              "desc": "Перехват горячих поисковых ключей и сигналов конверсий через Search и Social.",
              "badge": "ЭТАП 01"
          },
          {
              "title": "Этап 2: Анализ и DMP-моделирование",
              "desc": "DMP профилирует поведенческие когорты и вычисляет долгосрочный потенциал LTV.",
              "badge": "ЭТАП 02"
          },
          {
              "title": "Этап 3: Масштабирование в OEM",
              "desc": "Массовый запуск выигрышных связок на объемах OEM и In-App с точечной калибровкой ставок.",
              "badge": "ЭТАП 03"
          }
      ],
      "tagline": "Постоянная обратная связь: горячие поисковые данные непрерывно повышают ROI заводских преинсталлов."
  },
  19: {
      "slideNumber": 19,
      "kicker": "БЕЗОПАСНОСТЬ И КОМПЛАЕНС",
      "title": "Безопасность бренда, комплаенс и защита данных.",
      "subtitle": "Корпоративные стандарты защиты репутации Вашего бизнеса на всех мировых рынках.",
      "bullets": [
          {
              "title": "Гарантия Brand Safety",
              "desc": "Строгий белый список площадок исключает появление рекламы рядом с сомнительным или токсичным контентом.",
              "badge": "БЕЗОПАСНОСТЬ"
          },
          {
              "title": "Регуляторное соответствие",
              "desc": "Полное соблюдение регламентов GDPR, CCPA и отраслевых лицензионных требований iGaming и FinTech.",
              "badge": "ЗАКОН"
          },
          {
              "title": "Защита приватности (Privacy First)",
              "desc": "Идентификаторы пользователей хешируются и деперсонализируются на границе сети без передачи третьим лицам.",
              "badge": "ПРИВАТНОСТЬ"
          }
      ],
      "tagline": "Корпоративный комплаенс и чистота юридических процедур в более чем 100 юрисдикциях."
  },
  20: {
      "slideNumber": 20,
      "kicker": "ПЛАН ДЕЙСТВИЙ · ОНБОРДИНГ",
      "title": "15-дневный план быстрого запуска и выхода на масштаб.",
      "subtitle": "Четкая структурированная дорожная карта от подписания договора до окупаемого масштаба.",
      "bullets": [
          {
              "title": "Дни 1–3: Стратегическая сессия",
              "desc": "Определяем цели на 6 месяцев, экономику юнита, кривую LTV и целевую стоимость привлечения (CAC).",
              "badge": "ДНИ 1-3"
          },
          {
              "title": "Дни 4–7: Интеграция MMP и данных",
              "desc": "Настройка постбэков AppsFlyer / Adjust / Kochava и калибровка пикселей атрибуции DMP.",
              "badge": "ДНИ 4-7"
          },
          {
              "title": "Дни 8–15: Тестовый запуск и валидация",
              "desc": "Запуск контрольных A/B флайтов на проверенном OEM-инвентаре для валидации экономики.",
              "badge": "ДНИ 8-15"
          }
      ],
      "tagline": "Готовы масштабировать Вашу трафик-инфраструктуру? Свяжитесь с Алексом."
  },
};

export const DECK_SLIDES_RO: Record<number, DeckSlideContent> = {
  1: {
      "slideNumber": 1,
      "kicker": "AGENȚIA UPRAISER · 2026 MEDIA KIT",
      "title": "Vedem cât de impresionantă poate fi ascensiunea Ta către vârf.",
      "subtitle": "Furnizorul Tău premium de trafic · Agenția oficială Lenovo PC HK LTD",
      "metrics": [
          {
              "value": "100+",
              "label": "GEO-uri țintă",
              "sub": "Global Tier-1 & LATAM/APAC"
          },
          {
              "value": "OEM",
              "label": "Preinstalări directe",
              "sub": "Lenovo · Xiaomi · Samsung"
          },
          {
              "value": "0%",
              "label": "Fraudă post-atribuire",
              "sub": "Blocare în timp real la nivel de edge"
          }
      ],
      "tagline": "Preinstalări hardware exclusive, SDK-uri programatice certificate și protecție anti-fraudă enterprise."
  },
  2: {
      "slideNumber": 2,
      "kicker": "MISIUNEA NOASTRĂ",
      "title": "Performanță înainte de toate: infrastructură tehnică, nu doar o agenție.",
      "subtitle": "Ca agenție oficială a Lenovo PC HK LTD, transformăm potențialul produsului în realitate pe piață prin acces exclusiv la hardware și tehnologie proprietară.",
      "bullets": [
          {
              "title": "Dincolo de metrici superficiale (CPI)",
              "desc": "Optimizăm direct pentru indicatorii care mișcă afacerea: rata primului depozit (FTD), creșterea abonamentelor plătite și LTV-ul utilizatorilor.",
              "badge": "METRICI REALE"
          },
          {
              "title": "Acces direct la hardware",
              "desc": "Preinstalări directe în ROM din fabrică și implementare agilă prin Google PAI pe dispozitive Android de top.",
              "badge": "TIER-1 OEM"
          },
          {
              "title": "Integritate fără arbitraj opac",
              "desc": "Rapoarte 100% transparente, fără intermediari ascunși sau brokeraj de trafic neverificat.",
              "badge": "TRANSPARENȚĂ"
          }
      ],
      "tagline": "Partener oficial: Lenovo PC HK LTD · Performanță Enterprise"
  },
  3: {
      "slideNumber": 3,
      "kicker": "ACOPERIRE GLOBALĂ",
      "title": "Acoperire globală, precizie chirurgicală.",
      "subtitle": "Operațiuni unificate de achiziție de trafic cu volum constant și conformitate în întreaga lume.",
      "metrics": [
          {
              "value": "100+",
              "label": "Teritorii",
              "sub": "Piețe Tier-1 SUA/UE și emergente APAC/LATAM"
          },
          {
              "value": "24/7",
              "label": "Execuție",
              "sub": "Achiziție media continuă pe toate fusurile orare"
          },
          {
              "value": "O singură",
              "label": "Integrare",
              "sub": "O echipă unificată de ingineri pentru scalare globală"
          }
      ],
      "tagline": "Un singur contract, o singură integrare SDK, distribuție universală."
  },
  4: {
      "slideNumber": 4,
      "kicker": "ARHITECTURA DE ACHIZIȚIE",
      "title": "Matricea Omnichannel: Urmărim utilizatorul, nu platforma.",
      "subtitle": "Mixul nostru proprietar de trafic diversifică riscul și maximizează acoperirea prin 4 piloni complementari.",
      "bullets": [
          {
              "title": "OEM și Preinstalări",
              "desc": "Integrare directă în ROM-ul din fabrică și ecranele de configurare inițială (OOBE) pe Lenovo, Xiaomi, Samsung, Oppo.",
              "badge": "HARDWARE"
          },
          {
              "title": "In-App Programmatic",
              "desc": "Acces direct prin SDK la peste 100.000 de aplicații active cu scoring comportamental și rewarded video.",
              "badge": "PROGRAMATIC"
          },
          {
              "title": "Arbitraj Social & Search",
              "desc": "Captarea intenției active din Google, Bing, Yahoo și audiențe lookalike hiper-segmentate în Meta și TikTok.",
              "badge": "PERFORMANȚĂ"
          },
          {
              "title": "Native & Presă de Top",
              "desc": "Transfer contextual de încredere din publicații economice prestigioase precum Financial Times și WSJ.",
              "badge": "AUTORITATE"
          }
      ],
      "tagline": "Atribuire diversificată fără dependență critică de o singură platformă."
  },
  5: {
      "slideNumber": 5,
      "kicker": "PILONUL 01 · AVANTAJUL HARDWARE",
      "title": "Acces direct la inventarul producătorilor OEM Tier-1.",
      "subtitle": "Parteneriate OEM exclusive care aduc aplicația Ta direct în mâinile consumatorilor încă de la prima pornire.",
      "bullets": [
          {
              "title": "Preinstalare din Fabrică (Hardcoded)",
              "desc": "Integrare la nivel de ROM înainte ca dispozitivul să părăsească linia de asamblare. Aplicația Ta este prezentă din Ziua 1. Risc de fraudă: zero absolut.",
              "badge": "HARDCODED"
          },
          {
              "title": "Preinstalare în Cloud (Agilă)",
              "desc": "Declanșată dinamic în timpul configurării inițiale (OOBE). Activă în 1-2 zile prin Google PAI cu flexibilitate maximă de targetare.",
              "badge": "GOOGLE PAI"
          },
          {
              "title": "Prezență în Magazinele OEM",
              "desc": "Plasare prioritară în piețele native de aplicații Lenovo, Samsung și Xiaomi cu vizibilitate garantată.",
              "badge": "PROMOVARE"
          }
      ],
      "tagline": "Lenovo · Xiaomi · Samsung · Oppo"
  },
  6: {
      "slideNumber": 6,
      "kicker": "PILONUL 02 · IN-APP PROGRAMMATIC",
      "title": "Scalare prin integrare directă cu SDK-uri mobile.",
      "subtitle": "Conexiune directă la peste 100.000 de aplicații mobile active prin canale DSP și SSP dedicate.",
      "metrics": [
          {
              "value": "100K+",
              "label": "Aplicații active",
              "sub": "Conexiuni directe prin SDK"
          },
          {
              "value": "Real-Time",
              "label": "Licitare",
              "sub": "Evaluare algoritmică la nivel de milisecunde"
          },
          {
              "value": "LTV Înalt",
              "label": "Cohorte de valoare",
              "sub": "Filtre de profunzime a sesiunilor"
          }
      ],
      "bullets": [
          {
              "title": "Targetare comportamentală",
              "desc": "Analizăm frecvența de utilizare a aplicațiilor și adâncimea sesiunilor pentru a licita doar când semnalele de implicare sunt la nivel maxim.",
              "badge": "AI SCORING"
          },
          {
              "title": "Rewarded Video & Playables",
              "desc": "Formate interactive captivante care educă utilizatorul înainte de descărcare.",
              "badge": "INTERACTIV"
          }
      ],
      "tagline": "Semnal programatic curat, fără adaosuri comerciale de la intermediari."
  },
  7: {
      "slideNumber": 7,
      "kicker": "PILONUL 03 · ARBITRAJ SOCIAL & SEARCH",
      "title": "Captarea intenției înalte pe platformele de elită.",
      "subtitle": "Reducem distanța dintre navigarea pasivă și conversia comercială activă.",
      "bullets": [
          {
              "title": "Captarea căutărilor comerciale",
              "desc": "Preluarea cererii active din Google, Bing și Yahoo pe cuvinte cheie financiare și de gaming cu intenție mare de cumpărare.",
              "badge": "SEARCH"
          },
          {
              "title": "Segmentare pe rețele sociale",
              "desc": "Segmentare granulară a audienței pe Meta și TikTok pentru a livra funnel-uri personalizate de achiziție.",
              "badge": "SOCIAL"
          },
          {
              "title": "Testare dinamică a creativelor",
              "desc": "Testare continuă a unghiurilor vizuale, a primelor secunde de hook și a îndemnurilor la acțiune localizate.",
              "badge": "CREATIVE LAB"
          }
      ],
      "tagline": "Arbitraj pe intenție ridicată: atragem utilizatori cu disponibilitate imediată de plată."
  },
  8: {
      "slideNumber": 8,
      "kicker": "PILONUL 04 · PRESTIGIU NATIV & EDITORIAL",
      "title": "Transfer de încredere din presa financiară globală.",
      "subtitle": "Valorificarea autorității celor mai respectate publicații economice și tehnologice.",
      "bullets": [
          {
              "title": "Plasare contextuală de prestigiu",
              "desc": "Poziționarea brandului Tău în contexte de business de mare autoritate (Financial Times și The Wall Street Journal).",
              "badge": "REPUTAȚIE"
          },
          {
              "title": "Strategie orientată spre CPA ridicat",
              "desc": "Inventar selectat strict aliniat cu obiectivele de depozit și CPA, transformând autoritatea editorială în clienți plătitori.",
              "badge": "CPA RIDICAT"
          },
          {
              "title": "Rețele de recomandare nativă",
              "desc": "Widget-uri native de conținut (Taboola, Outbrain) care ajung la decidenți financiari activi.",
              "badge": "NATIV"
          }
      ],
      "tagline": "Transformăm prestigiul media în achiziție măsurabilă de utilizatori cu depozite mari."
  },
  9: {
      "slideNumber": 9,
      "kicker": "MOTORUL TEHNOLOGIC · DMP PROPRIETAR",
      "title": "Motorul: DMP proprietar și scoring predictiv.",
      "subtitle": "Decizii algoritmice care transformă telemetria dispozitivului în valoare pe viață a clientului (LTV).",
      "bullets": [
          {
              "title": "Scoring predictiv al LTV",
              "desc": "Algoritmii noștri evaluează semnale unice de hardware pentru a prezice potențialul de monetizare înainte de afișarea reclamei.",
              "badge": "PREDICTIV"
          },
          {
              "title": "Claritate totală",
              "desc": "Fără «cutii negre». Inspectezi în orice moment aceleași date brute și parametri de execuție pe care îi văd echipele noastre.",
              "badge": "DATE DESCHISE"
          },
          {
              "title": "Flux de procesare în 3 etape",
              "desc": "[ Date de intrare ] ➔ [ Model predictiv ] ➔ [ Ofertă optimizată ] procesate în cicluri de sub 50 ms.",
              "badge": "REAL-TIME"
          }
      ],
      "tagline": "Licităm pe valoarea viitoare reală, nu pe click-uri trecute fără valoare."
  },
  10: {
      "slideNumber": 10,
      "kicker": "SCUTUL · TOLERANȚĂ ZERO LA FRAUDĂ",
      "title": "Dacă nu putem verifica — nu cumpărăm.",
      "subtitle": "Sistem certificat enterprise de filtrare anti-fraudă care scanează fiecare afișare și instalare în timp real.",
      "metrics": [
          {
              "value": "100%",
              "label": "Verificat MMP",
              "sub": "AppsFlyer · Adjust · Kochava · Singular"
          },
          {
              "value": "Edge",
              "label": "Inspectare la margine",
              "sub": "Igienă instantanee a traficului"
          },
          {
              "value": "0",
              "label": "Toleranță la boți",
              "sub": "Zero buget alocat traficului fals"
          }
      ],
      "bullets": [
          {
              "title": "Apărare împotriva furtului de atribuire",
              "desc": "Respingere imediată a click injection și a tentativelor de interceptare înainte de plată.",
              "badge": "ANTI-FURT"
          },
          {
              "title": "Scut anti click-flooding",
              "desc": "Detectare algoritmică a spam-ului masiv de click-uri creat pentru a păcăli modelele Last-Touch.",
              "badge": "ANTI-SPAM"
          }
      ],
      "tagline": "Certificat: AppsFlyer Protect360 · Adjust · Kochava · Singular"
  },
  11: {
      "slideNumber": 11,
      "kicker": "METRICI DE FRAUDĂ · ANALIZĂ DETALIATĂ",
      "title": "Blocarea boților în timp real pe cifre concrete.",
      "subtitle": "Protejarea bugetului de marketing împotriva traficului non-uman și a fermelor de emulatoare.",
      "metrics": [
          {
              "value": "97.3%",
              "label": "Boți blocați",
              "sub": "Emulatoare sintetice și centre de date"
          },
          {
              "value": "2.7%",
              "label": "Furturi filtrate",
              "sub": "Injectare de click-uri și deturnare"
          },
          {
              "value": "100%",
              "label": "Oameni reali",
              "sub": "Fiecare dolar ajunge la cumpărători autentici"
          }
      ],
      "bullets": [
          {
              "title": "Blacklist pentru IP-uri de servere",
              "desc": "Filtrare în timp real a nodurilor VPN, proxy și a serverelor cloud înainte de livrarea reclamei.",
              "badge": "REPUTAȚIE IP"
          },
          {
              "title": "Amprentare hardware a dispozitivului",
              "desc": "Validarea giroscopului, a entropiei atingerilor tactile și a bateriei pentru a confirma prezența umană.",
              "badge": "EURISTICĂ"
          }
      ],
      "tagline": "Bugetul Tău de marketing este cheltuit exclusiv pe utilizatori reali cu intenție de cumpărare."
  },
  12: {
      "slideNumber": 12,
      "kicker": "GARANȚIA CALITĂȚII",
      "title": "Garanția «Instalării Curate»: Rata de fraudă post-atribuire 0%.",
      "subtitle": "Performanță auditată post-instalare care demonstrează absența totală a fraudei.",
      "metrics": [
          {
              "value": "4,909",
              "label": "Instalări curate",
              "sub": "Evenimente verificate post-instalare"
          },
          {
              "value": "4",
              "label": "Fraudă blocată",
              "sub": "Anomalii identificate și respinse"
          },
          {
              "value": "0.0%",
              "label": "Rată finală de fraudă",
              "sub": "Verificat prin audit post-atribuire"
          }
      ],
      "bullets": [
          {
              "title": "Puritatea datelor în MMP",
              "desc": "Prevenim pătrunderea înregistrărilor sintetice în dashboard-urile Tale de atribuire.",
              "badge": "DATE PURE"
          },
          {
              "title": "Zero dispute financiare",
              "desc": "Fără reconcilieri dureroase la sfârșitul lunii sau reduceri retroactive de bugete.",
              "badge": "SIGURANȚĂ"
          }
      ],
      "tagline": "Datele curate de atribuire antrenează algoritmii să genereze profit maxim."
  },
  13: {
      "slideNumber": 13,
      "kicker": "STUDII DE CAZ TIER-1 · IGAMING & FINTECH",
      "title": "Achiziție de mare valoare: Fanatics și Vantage Markets.",
      "subtitle": "Rezultate demonstrate în atragerea primelor depozite în cele mai competitive verticale din lume.",
      "bullets": [
          {
              "title": "Fanatics (iGaming și Pariuri Sportive)",
              "desc": "A generat venituri de peste 250.000 USD în iunie 2025 · Venit de peste 500+ USD per parior · Respectare strictă a vârstei 18+ și a licențelor locale.",
              "badge": "FANATICS"
          },
          {
              "title": "Vantage Markets (FinTech & Tranzacționare)",
              "desc": "A livrat peste 800+ Prime Depozite (FTD) · Valoare medie per utilizator de peste 150+ USD · Scalare prin preinstalări OEM din fabrică.",
              "badge": "VANTAGE"
          }
      ],
      "metrics": [
          {
              "value": "$250K+",
              "label": "Venit Fanatics",
              "sub": "Într-o singură lună (iunie '25)"
          },
          {
              "value": "$500+",
              "label": "Venit / Parior",
              "sub": "Cohortă de mare valoare"
          },
          {
              "value": "800+",
              "label": "Depozite Vantage",
              "sub": "Conturi verificate"
          }
      ],
      "tagline": "Scalăm volumul de utilizatori de mare valoare respectând cu strictețe cerințele de reglementare."
  },
  14: {
      "slideNumber": 14,
      "kicker": "SCALARE ȘI RETENȚIE · UTILITY & COMMERCE",
      "title": "Scalare și retenție: Snoop și audiența de elită US News.",
      "subtitle": "Monetizarea activă a utilizatorilor în aplicații utilitare și servicii financiare.",
      "bullets": [
          {
              "title": "Snoop (FinTech & Utility)",
              "desc": "Strategie: CTV și targetare comportamentală · 14.308 instalări curate · 4.580 evenimente verificate de conectare a primului cont bancar.",
              "badge": "SNOOP"
          },
          {
              "title": "Contextul The Wall Street Journal",
              "desc": "Piață: Cititori de știri financiare din SUA cu CPA ridicat · Peste 3.000 de achiziții noi verificate pe lună cu retenție ridicată.",
              "badge": "AUDIENȚĂ WSJ"
          }
      ],
      "metrics": [
          {
              "value": "14,308",
              "label": "Instalări Snoop",
              "sub": "Volum total verificat"
          },
          {
              "value": "4,580",
              "label": "Conturi conectate",
              "sub": "Conversie de 32% în funnel"
          },
          {
              "value": "3,000+",
              "label": "Achiziții lunare",
              "sub": "Cumpărători premium din SUA"
          }
      ],
      "tagline": "Atragem utilizatori care deschid portofelele, nu care șterg aplicația după 10 minute."
  },
  15: {
      "slideNumber": 15,
      "kicker": "MODELE COMERCIALE",
      "title": "Matricea performanței: Modele comerciale aliniate cu LTV-ul Tău.",
      "subtitle": "Structuri contractuale flexibile care reduc riscul echipelor de achiziție de utilizatori.",
      "bullets": [
          {
              "title": "CPI (Cost Per Instalare)",
              "desc": "Structură orientată pe volum: ideală pentru expansiune rapidă pe piață și urcare în topurile magazinelor de aplicații.",
              "badge": "VOLUM"
          },
          {
              "title": "CPA (Cost Per Acțiune)",
              "desc": "Structură legată direct de venit: asociată cu primul depozit (FTD), activarea abonamentului sau comanda în aplicație.",
              "badge": "DEPOZIT / ACȚIUNE"
          },
          {
              "title": "CPL (Cost Per Lead Calificat)",
              "desc": "Structură axată pe înregistrări: optimă pentru pre-lansări fintech, aprobări de credit și deschideri de cont.",
              "badge": "ÎNREGISTRARE"
          }
      ],
      "tagline": "Condiții comerciale calibrate direct pe ferestrele Tale de recuperare a investiției."
  },
  16: {
      "slideNumber": 16,
      "kicker": "STUDIU DE CAZ A · SCALARE FĂRĂ COMPROMISURI",
      "title": "4,4 milioane de click-uri procesate cu 0% fraudă.",
      "subtitle": "Dovada protecției algoritmice la marginea rețelei sub viteze extreme de campanie.",
      "metrics": [
          {
              "value": "4.4M",
              "label": "Total Click-uri",
              "sub": "Volum masiv de campanie"
          },
          {
              "value": "3,174",
              "label": "Instalări verificate",
              "sub": "100% oameni reali"
          },
          {
              "value": "0.0%",
              "label": "Rată de fraudă",
              "sub": "Auditat prin ADH schnackmox1_int"
          }
      ],
      "bullets": [
          {
              "title": "Volum masiv de click-uri",
              "desc": "Filtrarea a milioane de solicitări în timp real fără a reduce viteza sau conversia din funnel.",
              "badge": "FILTRU VOLUM"
          },
          {
              "title": "Zero penetrare a fraudei",
              "desc": "Firewall-ul proprietar a garantat că niciun click sintetic nu a contaminat datele clientului.",
              "badge": "GARANȚIE"
          }
      ],
      "tagline": "Scalare extremă combinată cu o igienă desăvârșită a datelor."
  },
  17: {
      "slideNumber": 17,
      "kicker": "STUDIU DE CAZ B · VENITURI REALE GENERATE",
      "title": "Generăm acțiuni de plată, nu doar descărcări.",
      "subtitle": "Exemplu concret dintr-o campanie pe 7 zile demonstrând creșterea zilnică a veniturilor încasate.",
      "metrics": [
          {
              "value": "$15,329",
              "label": "Venituri în aplicație",
              "sub": "Cohortă verificată pe 7 zile"
          },
          {
              "value": "8.57%",
              "label": "Rată de conversie",
              "sub": "Procentul celor care au plătit"
          },
          {
              "value": "Zilnic",
              "label": "Creștere stabilă",
              "sub": "Ritm constant de depozite"
          }
      ],
      "bullets": [
          {
              "title": "Viteza primei plăți",
              "desc": "Utilizatorii efectuează primul depozit în primele ore de la instalarea aplicației.",
              "badge": "VITEZĂ"
          },
          {
              "title": "Retenția cohortei",
              "desc": "Traficul OEM și cel programatic de înaltă calitate arată o retenție în Ziua 30 de 2,4 ori mai mare decât media pieței.",
              "badge": "RETENȚIE"
          }
      ],
      "tagline": "Măsurăm succesul în profitul net generat, nu în numărul de descărcări uitate."
  },
  18: {
      "slideNumber": 18,
      "kicker": "CICLUL DE OPTIMIZARE",
      "title": "Performanță cumulativă în circuit închis.",
      "subtitle": "Cum intenția din căutări îmbunătățește scoringul pentru extinderea masivă în OEM.",
      "bullets": [
          {
              "title": "Etapa 1: Colectarea datelor",
              "desc": "Preluarea căutărilor comerciale fierbinți și a semnalelor de conversie prin Search și Social.",
              "badge": "ETAPA 01"
          },
          {
              "title": "Etapa 2: Analiză și modelare DMP",
              "desc": "DMP-ul profilează cohortele comportamentale și estimează LTV-ul pe termen lung.",
              "badge": "ETAPA 02"
          },
          {
              "title": "Etapa 3: Scalare masivă în OEM",
              "desc": "Lansarea combinațiilor câștigătoare pe volume uriașe de OEM și In-App cu licitare de mare precizie.",
              "badge": "ETAPA 03"
          }
      ],
      "tagline": "Feedback continuu: datele de intenție cresc permanent rentabilitatea preinstalărilor din fabrică."
  },
  19: {
      "slideNumber": 19,
      "kicker": "GUVERNANȚĂ ȘI SECURITATE",
      "title": "Siguranța brandului, conformitate legală și confidențialitate.",
      "subtitle": "Standarde enterprise de guvernanță care protejează reputația companiei Tale în orice teritoriu.",
      "bullets": [
          {
              "title": "Garanția Brand Safety",
              "desc": "Listă albă strictă de spații publicitare care garantează apariția exclusiv lângă conținut sigur și respectat.",
              "badge": "SIGURANȚĂ"
          },
          {
              "title": "Conformitate de reglementare",
              "desc": "Respectare 100% a GDPR, CCPA și a reglementărilor specifice pentru iGaming și FinTech.",
              "badge": "LEGAL"
          },
          {
              "title": "Confidențialitate integrată",
              "desc": "Identificatorii utilizatorilor sunt criptați și anonimizați la marginea rețelei, fără partajare neautorizată.",
              "badge": "CONFIDENȚIALITATE"
          }
      ],
      "tagline": "Conformitate corporativă în peste 100 de jurisdicții internaționale."
  },
  20: {
      "slideNumber": 20,
      "kicker": "PLANUL DE ACȚIUNE · ONBOARDING",
      "title": "Plan de onboarding accelerat în 15 zile.",
      "subtitle": "O foaie de parcurs structurată, fără riscuri, de la semnarea contractului până la scalare profitabilă.",
      "bullets": [
          {
              "title": "Zilele 1–3: Atelier de strategie",
              "desc": "Stabilim obiectivele pe 6 luni, unit economics, curba LTV și costul țintă de achiziție (CAC).",
              "badge": "ZILELE 1-3"
          },
          {
              "title": "Zilele 4–7: Integrare MMP și fluxuri de date",
              "desc": "Conectăm postback-urile AppsFlyer / Adjust / Kochava și calibrăm pixelii de atribuire DMP.",
              "badge": "ZILELE 4-7"
          },
          {
              "title": "Zilele 8–15: Lansare pilot și validare",
              "desc": "Desfășurăm zboruri de test A/B pe inventar OEM verificat pentru a valida cifrele financiare.",
              "badge": "ZILELE 8-15"
          }
      ],
      "tagline": "Ești pregătit să scalezi infrastructura Ta de trafic? Conectează-te cu Alex."
  },
};

export const DECK_SLIDES_KA: Record<number, DeckSlideContent> = {
  1: {
      "slideNumber": 1,
      "kicker": "UPRAISER AGENCY · 2026 MEDIA KIT",
      "title": "ჩვენ ვხედავთ, რამდენად შთამბეჭდავი შეიძლება იყოს თქვენი მწვერვალზე ასვლა.",
      "subtitle": "თქვენი პრემიუმ ტრაფიკის პროვაიდერი · Lenovo PC HK LTD-ის ოფიციალური სააგენტო",
      "metrics": [
          {
              "value": "100+",
              "label": "სამიზნე GEO",
              "sub": "გლობალური Tier-1 & LATAM/APAC"
          },
          {
              "value": "OEM",
              "label": "პირდაპირი პრეინსტალაცია",
              "sub": "Lenovo · Xiaomi · Samsung"
          },
          {
              "value": "0%",
              "label": "პოსტ-ატრიბუციის თაღლითობა",
              "sub": "რეალურ დროში ბლოკირება"
          }
      ],
      "tagline": "ექსკლუზიური ქარხნული პრეინსტალაციები, სერტიფიცირებული SDK-ები და ანტიფროდ დაცვა."
  },
  2: {
      "slideNumber": 2,
      "kicker": "ჩვენი მისია",
      "title": "შედეგი უპირველეს ყოვლისა: ტექნიკური ინფრასტრუქტურა და არა უბრალოდ სააგენტო.",
      "subtitle": "როგორც Lenovo PC HK LTD-ის ოფიციალური სააგენტო, ჩვენ პროდუქტის პოტენციალს ბაზრის რეალობად ვაქცევთ უნიკალური აპარატურული წვდომითა და საკუთარი ტექნოლოგიებით.",
      "bullets": [
          {
              "title": "ფუჭი მეტრიკების (CPI) მიღმა",
              "desc": "ჩვენი ოპტიმიზაცია მიმართულია ბიზნესის ზრდაზე: დეპოზიტის განაკვეთი (FTD), გამოწერების ზრდა და მომხმარებლის LTV.",
              "badge": "მეტრიკები"
          },
          {
              "title": "აპარატურული პირდაპირი წვდომა",
              "desc": "ქარხნული ROM პრეინსტალაცია და მოქნილი განთავსება Google PAI-ს მეშვეობით წამყვან Android მოწყობილობებზე.",
              "badge": "TIER-1 OEM"
          },
          {
              "title": "გამჭვირვალობა გადაყიდვის გარეშე",
              "desc": "პირდაპირი შესყიდვები შუამავლების, გაურკვეველი ბროკერებისა და დაფარული გადამყიდველების გარეშე.",
              "badge": "გამჭვირვალობა"
          }
      ],
      "tagline": "ოფიციალური პარტნიორი: Lenovo PC HK LTD · Enterprise დონე"
  },
  3: {
      "slideNumber": 3,
      "kicker": "გლობალური მასშტაბი",
      "title": "გლობალური წვდომა, ქირურგიული სიზუსტე.",
      "subtitle": "ტრაფიკის შესყიდვის ერთიანი ოპერაციები სტაბილური მოცულობითა და შესაბამისობით მთელ მსოფლიოში.",
      "metrics": [
          {
              "value": "100+",
              "label": "ტერიტორია",
              "sub": "Tier-1 აშშ/ევროპა და APAC/LATAM"
          },
          {
              "value": "24/7",
              "label": "შესყიდვა",
              "sub": "უწყვეტი მედიაბაინგი ყველა სასაათო სარტყელში"
          },
          {
              "value": "ერთიანი",
              "label": "ინტეგრაცია",
              "sub": "ინჟინრების ერთი გუნდი გლობალური მასშტაბისთვის"
          }
      ],
      "tagline": "ერთი ხელშეკრულება, ერთი SDK ინტეგრაცია, უნივერსალური დისტრიბუცია."
  },
  4: {
      "slideNumber": 4,
      "kicker": "შესყიდვის არქიტექტურა",
      "title": "ომნიარხული მატრიცა: ჩვენ მივყვებით მომხმარებელს და არა პლატფორმას.",
      "subtitle": "ჩვენი საკუთარი ტრაფიკ-მიქსი ანაწილებს რისკებს და მაქსიმალურად ზრდის წვდომას 4 დამოუკიდებელი საყრდენით.",
      "bullets": [
          {
              "title": "OEM და პრეინსტალაციები",
              "desc": "ქარხნული ROM ინტეგრაცია და OOBE ეკრანები Lenovo, Xiaomi, Samsung, Oppo მოწყობილობებზე.",
              "badge": "HARDWARE"
          },
          {
              "title": "In-App პროგრამატიკი",
              "desc": "პირდაპირი წვდომა SDK-ით 100 000+ აქტიურ მობილურ აპლიკაციაზე ქცევითი სქორინგით.",
              "badge": "პროგრამატიკი"
          },
          {
              "title": "Social & Search არბიტრაჟი",
              "desc": "აქტიური მოთხოვნის მოზიდვა Google, Bing, Yahoo-დან და მიზნობრივი აუდიტორიები Meta-სა და TikTok-ში.",
              "badge": "პერფორმანსი"
          },
          {
              "title": "Native და პრესის ავტორიტეტი",
              "desc": "ნდობის კონტექსტური გადატანა ისეთი წამყვანი გამოცემებიდან, როგორიცაა Financial Times და WSJ.",
              "badge": "ავტორიტეტი"
          }
      ],
      "tagline": "დივერსიფიცირებული ატრიბუცია ერთი წყაროსგან დამოუკიდებლად."
  },
  5: {
      "slideNumber": 5,
      "kicker": "საყრდენი 01 · აპარატურული უპირატესობა",
      "title": "პირდაპირი წვდომა Tier-1 OEM ინვენტარზე.",
      "subtitle": "ექსკლუზიური პარტნიორობა, რომელიც თქვენს აპლიკაციას მომხმარებლის ხელში პირველივე ჩართვიდან ათავსებს.",
      "bullets": [
          {
              "title": "ქარხნული პრეინსტალაცია (Hardcoded)",
              "desc": "ROM დონის ინტეგრაცია კონვეიერზევე. თქვენი აპლიკაცია მოწყობილობაშია 1-ლი დღიდან. თაღლითობის რისკი: 0%.",
              "badge": "ROM-ში ჩაწერილი"
          },
          {
              "title": "ღრუბლოვანი პრეინსტალაცია (Agile)",
              "desc": "აქტივაცია მოწყობილობის საწყისი კონფიგურაციისას (OOBE). გაშვება 1-2 დღეში Google PAI-ს მეშვეობით.",
              "badge": "GOOGLE PAI"
          },
          {
              "title": "OEM მაღაზიებში განთავსება",
              "desc": "პრიორიტეტული ჩვენება Lenovo, Samsung და Xiaomi-ს საკუთარ აპლიკაციების მაღაზიებში გარანტირებული ხილვადობით.",
              "badge": "FEATURED"
          }
      ],
      "tagline": "Lenovo · Xiaomi · Samsung · Oppo"
  },
  6: {
      "slideNumber": 6,
      "kicker": "საყრდენი 02 · IN-APP პროგრამატიკი",
      "title": "მასშტაბირება პირდაპირი SDK ინტეგრაციით.",
      "subtitle": "პირდაპირი კავშირი 100 000-ზე მეტ აქტიურ მობილურ აპლიკაციასთან პირდაპირი DSP/SSP არხებით.",
      "metrics": [
          {
              "value": "100K+",
              "label": "აქტიური აპლიკაცია",
              "sub": "პირდაპირი SDK კონექტორები"
          },
          {
              "value": "Real-Time",
              "label": "აუქციონი",
              "sub": "ალგორითმული შეფასება მილიწამებში"
          },
          {
              "value": "მაღალი LTV",
              "label": "ღირებული კოჰორტები",
              "sub": "სესიის სიხშირისა და სიღრმის ფილტრები"
          }
      ],
      "bullets": [
          {
              "title": "ქცევითი ტარგეტინგი",
              "desc": "ჩვენ ვაანალიზებთ აპლიკაციის გამოყენების სიხშირეს და ვაკეთებთ ფსონს მომხმარებლის მაქსიმალური ჩართულობისას.",
              "badge": "AI SCORING"
          },
          {
              "title": "Rewarded Video & Playables",
              "desc": "ინტერაქტიული ფორმატები ჯილდოთი, რომლებიც მომხმარებელს ინსტალაციამდე აცნობენ პროდუქტს.",
              "badge": "ინტერაქტივი"
          }
      ],
      "tagline": "სუფთა პროგრამატიკ სიგნალი შუამავლების დანამატების გარეშე."
  },
  7: {
      "slideNumber": 7,
      "kicker": "საყრდენი 03 · SOCIAL & SEARCH არბიტრაჟი",
      "title": "მაღალი განზრახვის მქონე მოთხოვნის მოზიდვა.",
      "subtitle": "პასიურ დათვალიერებასა და აპლიკაციაში რეალურ გადახდას შორის მანძილის შემცირება.",
      "bullets": [
          {
              "title": "საძიებო მოთხოვნის დაჭერა",
              "desc": "აქტიური კომერციული მოთხოვნის მობილიზება Google, Bing და Yahoo-დან მაღალკონვერსიული ფინანსური და გეიმინგ საკვანძო სიტყვებით.",
              "badge": "ძიება"
          },
          {
              "title": "სოციალური ქსელების სეგმენტაცია",
              "desc": "აუდიტორიის სიღრმისეული სეგმენტაცია Meta-სა და TikTok-ზე პერსონალიზებული გზების შესაქმნელად.",
              "badge": "სოციალური"
          },
          {
              "title": "კრეატივების დინამიკური ტესტირება",
              "desc": "ვიზუალური კუთხეების, პირველი წამების ჰუკებისა და მოწოდებების მუდმივი A/B ტესტირება.",
              "badge": "ლაბორატორია"
          }
      ],
      "tagline": "მაღალი კომერციული განზრახვის არბიტრაჟი: გადახდისუნარიანი მომხმარებლების მოზიდვა."
  },
  8: {
      "slideNumber": 8,
      "kicker": "საყრდენი 04 · NATIVE და პრესტიჟი",
      "title": "ნდობის გადატანა გლობალური ბიზნეს მედიიდან.",
      "subtitle": "მსოფლიოს წამყვანი ფინანსური და ტექნოლოგიური გამოცემების რეპუტაციის გამოყენება.",
      "bullets": [
          {
              "title": "კონტექსტური განთავსება",
              "desc": "თქვენი ბრენდის პოზიციონირება ავტორიტეტულ ბიზნეს გარემოში (Financial Times და The Wall Street Journal).",
              "badge": "რეპუტაცია"
          },
          {
              "title": "მაღალი CPA-ს სტრატეგია",
              "desc": "შერჩეული ინვენტარი მკაცრად მიბმული დეპოზიტის ღირებულებასთან (CPA), რაც პრესტიჟს შემოსავლად აქცევს.",
              "badge": "მაღალი CPA"
          },
          {
              "title": "ნატიური რეკომენდაციების ქსელები",
              "desc": "Taboola და Outbrain ვიჯეტები ფინანსური გადაწყვეტილების მიმღები პირების მოსაზიდად.",
              "badge": "NATIVE"
          }
      ],
      "tagline": "მედიის პრესტიჟის გარდაქმნა მაღალდეპოზიტიან გაზომვად მომხმარებლებში."
  },
  9: {
      "slideNumber": 9,
      "kicker": "ძრავა · საკუთარი DMP პლატფორმა",
      "title": "ძრავა: საკუთარი DMP და პროგნოზირებადი სქორინგი.",
      "subtitle": "ალგორითმები, რომლებიც მოწყობილობის ტელემეტრიას მომხმარებლის ხანგრძლივ ღირებულებად (LTV) გარდაქმნიან.",
      "bullets": [
          {
              "title": "პროგნოზირებადი LTV სქორინგი",
              "desc": "ჩვენი ალგორითმები აფასებენ აპარატურულ სიგნალებს, რათა განჭვრიტონ გადახდის მზაობა რეკლამის ჩვენებამდე.",
              "badge": "პროგნოზი"
          },
          {
              "title": "სრული გამჭვირვალობა",
              "desc": "არანაირი «შავი ყუთი». თქვენ ხედავთ ზუსტად იმავე პირველად მონაცემებსა და ლოგებს, რასაც ჩვენი ბაიერები.",
              "badge": "ღია ლოგები"
          },
          {
              "title": "სამდონიანი ნაკადი",
              "desc": "[ შემავალი მონაცემი ] ➔ [ მოდელი ] ➔ [ ოპტიმალური ფსონი ] 50 მილიწამზე ნაკლებ დროში.",
              "badge": "REAL-TIME"
          }
      ],
      "tagline": "ჩვენ ვყიდულობთ მომავალ შემოსავალს და არა წარსულის ფუჭ კლიკებს."
  },
  10: {
      "slideNumber": 10,
      "kicker": "ფარი · ნულოვანი ტოლერანტობა თაღლითობისადმი",
      "title": "თუ ვერ ვამოწმებთ — არ ვყიდულობთ.",
      "subtitle": "სერტიფიცირებული ანტიფროდ სისტემა, რომელიც რეალურ დროში ფილტრავს თითოეულ ჩვენებასა და ინსტალაციას.",
      "metrics": [
          {
              "value": "100%",
              "label": "MMP ვერიფიცირებული",
              "sub": "AppsFlyer · Adjust · Kochava · Singular"
          },
          {
              "value": "Edge",
              "label": "ფილტრაცია კარიბჭეზე",
              "sub": "ტრაფიკის მყისიერი ჰიგიენა"
          },
          {
              "value": "0",
              "label": "ტოლერანტობა ბოტებზე",
              "sub": "ნული ბიუჯეტი ყალბ ტრაფიკზე"
          }
      ],
      "bullets": [
          {
              "title": "ინსტალაციის მიტაცებისგან დაცვა",
              "desc": "Click Injection-ისა და ატრიბუციის მოპარვის მცდელობების მყისიერი დაბლოკვა გადახდამდე.",
              "badge": "მიტაცების ფილტრი"
          },
          {
              "title": "Click Flooding-ის შეჩერება",
              "desc": "სინთეტიკური კლიკების მასიური ნაკადის ალგორითმული შეკავება, რომელიც Last-Touch-ის მოსატყუებლად იქმნება.",
              "badge": "ანტისპამი"
          }
      ],
      "tagline": "სერტიფიცირებულია: AppsFlyer Protect360 · Adjust · Kochava · Singular"
  },
  11: {
      "slideNumber": 11,
      "kicker": "მონაცემთა ანალიზი · ბოტების ბლოკირება",
      "title": "ბოტების ბლოკირება რეალურ დროში კონკრეტულ ციფრებში.",
      "subtitle": "მარკეტინგული ბიუჯეტის დაცვა არაადამიანური ტრაფიკისა და ემულატორების ფერმებისგან.",
      "metrics": [
          {
              "value": "97.3%",
              "label": "ბოტები დაბლოკილია",
              "sub": "ემულატორები და მონაცემთა ცენტრები"
          },
          {
              "value": "2.7%",
              "label": "მიტაცება გაფილტრულია",
              "sub": "კლიკ-ინექციები და ყალბი ატრიბუცია"
          },
          {
              "value": "100%",
              "label": "რეალური ხალხი",
              "sub": "თითოეული დოლარი ცოცხალ მყიდველს აღწევს"
          }
      ],
      "bullets": [
          {
              "title": "მონაცემთა ცენტრების IP შავი სია",
              "desc": "VPN, პროქსი და ღრუბლოვანი სერვერების გამომავალი წერტილების ფილტრაცია ჩვენებამდე.",
              "badge": "IP რეპუტაცია"
          },
          {
              "title": "მოწყობილობის აპარატურული ანაბეჭდი",
              "desc": "გიროსკოპის, შეხების ენტროპიისა და ელემენტის სტატუსის ვალიდაცია ადამიანის დასადასტურებლად.",
              "badge": "ევრისტიკა"
          }
      ],
      "tagline": "თქვენი ბიუჯეტი იხარჯება მხოლოდ რეალურ ადამიანებზე, რომელთაც შესყიდვის უნარი აქვთ."
  },
  12: {
      "slideNumber": 12,
      "kicker": "ხარისხის გარანტია",
      "title": "«სუფთა ინსტალაციის» გარანტია: პოსტ-ატრიბუციის ფროდი 0%.",
      "subtitle": "აუდიტირებული შედეგები, რომლებიც ადასტურებს თაღლითობის სრულ არარსებობას.",
      "metrics": [
          {
              "value": "4,909",
              "label": "სუფთა ინსტალაცია",
              "sub": "დადასტურებული პოსტ-ინსტალ მოვლენები"
          },
          {
              "value": "4",
              "label": "დაბლოკილი ფროდი",
              "sub": "გამოვლენილი და შეჩერებული ანომალიები"
          },
          {
              "value": "0.0%",
              "label": "საბოლოო ფროდი",
              "sub": "დადასტურებულია აუდიტით"
          }
      ],
      "bullets": [
          {
              "title": "MMP მონაცემთა სისუფთავე",
              "desc": "თქვენი ანალიტიკური პანელების დაცვა სინთეტიკური ჩანაწერებით დაბინძურებისგან.",
              "badge": "სუფთა MMP"
          },
          {
              "title": "დავების გამორიცხვა",
              "desc": "არანაირი გაუგებრობა თვის ბოლოს, თანხის უკან დაბრუნება ან ტრაფიკის ჩამოჭრა.",
              "badge": "სიმშვიდე"
          }
      ],
      "tagline": "სუფთა ატრიბუციის მონაცემები ასწავლის მანქანურ მოდელებს მაქსიმალური მოგების მოტანას."
  },
  13: {
      "slideNumber": 13,
      "kicker": "TIER-1 ქეისები · IGAMING & ფინტექი",
      "title": "მაღალღირებული მომხმარებლების მოზიდვა: Fanatics & Vantage.",
      "subtitle": "დადასტურებული გამოცდილება პირველი დეპოზიტების მოზიდვაში ყველაზე კონკურენტულ სფეროებში.",
      "bullets": [
          {
              "title": "Fanatics (iGaming და სპორტული ფსონები)",
              "desc": "250,000+ აშშ დოლარის შემოსავალი 2025 წლის ივნისში · $500+ შემოსავალი თითო მოთამაშეზე · 18+ ასაკისა და გეო-ლიცენზიების მკაცრი დაცვა.",
              "badge": "FANATICS"
          },
          {
              "title": "Vantage Markets (FinTech & CFD)",
              "desc": "800+ პირველი დეპოზიტი (FTD) · მომხმარებლის საშუალო ღირებულება $150-ზე მეტი · მასშტაბირება ქარხნული OEM პრეინსტალაციებით.",
              "badge": "VANTAGE"
          }
      ],
      "metrics": [
          {
              "value": "$250K+",
              "label": "Fanatics-ის შემოსავალი",
              "sub": "ერთ თვეში (ივნისი '25)"
          },
          {
              "value": "$500+",
              "label": "შემოსავალი / მოთამაშე",
              "sub": "მაღალშემოსავლიანი ჯგუფი"
          },
          {
              "value": "800+",
              "label": "Vantage-ის დეპოზიტები",
              "sub": "ვერიფიცირებული ანგარიშები"
          }
      ],
      "tagline": "მაღალშემოსავლიანი მომხმარებლების მოზიდვა რეგულაციების ზედმიწევნით დაცვით."
  },
  14: {
      "slideNumber": 14,
      "kicker": "მასშტაბი და შენარჩუნება · UTILITY & COMMERCE",
      "title": "მასშტაბი და შენარჩუნება: Snoop & WSJ აუდიტორია.",
      "subtitle": "მომხმარებელთა აქტიური მონეტიზაცია მობილურ აპლიკაციებსა და ფინანსურ მედიაში.",
      "bullets": [
          {
              "title": "Snoop (FinTech & Utility)",
              "desc": "სტრატეგია: CTV და ქცევითი ტარგეტინგი · 14 308 სუფთა ინსტალაცია · 4 580 პირველი საბანკო ანგარიშის დაკავშირების დადასტურებული მოვლენა.",
              "badge": "SNOOP"
          },
          {
              "title": "The Wall Street Journal კონტექსტი",
              "desc": "ბაზარი: აშშ-ის ბიზნეს სიახლეების გადამხდელი აუდიტორია · 3 000+ ახალი დადასტურებული შესყიდვა თვეში მაღალი შენარჩუნებით.",
              "badge": "WSJ აუდიტორია"
          }
      ],
      "metrics": [
          {
              "value": "14,308",
              "label": "Snoop ინსტალაცია",
              "sub": "სუფთა დადასტურებული მოცულობა"
          },
          {
              "value": "4,580",
              "label": "დაკავშირებული ანგარიში",
              "sub": "32% კონვერსია ძაბრში"
          },
          {
              "value": "3,000+",
              "label": "შესყიდვა თვეში",
              "sub": "პრემიუმ აშშ მყიდველები"
          }
      ],
      "tagline": "ჩვენ მოგვყავს მომხმარებლები, რომლებიც რეალურად იხდიან და არა ისინი, ვინც აპლიკაციას შლის."
  },
  15: {
      "slideNumber": 15,
      "kicker": "კომერციული მოდელები",
      "title": "ეფექტურობის მატრიცა: თქვენს LTV-ზე მორგებული მოდელები.",
      "subtitle": "მოქნილი თანამშრომლობის სტრუქტურები, რომლებიც ამცირებს მარკეტინგის რისკებს.",
      "bullets": [
          {
              "title": "CPI (გადახდა ინსტალაციაზე)",
              "desc": "მოცულობაზე ორიენტირებული სტრუქტურა: იდეალურია ბაზრის სწრაფი დაპყრობისა და ჩარტების სათავეში მოსახვედრად.",
              "badge": "მოცულობა"
          },
          {
              "title": "CPA (გადახდა მოქმედებაზე)",
              "desc": "შემოსავალზე ორიენტირებული სტრუქტურა: პირდაპირ მიბმული პირველ დეპოზიტზე (FTD), გამოწერასა თუ შეკვეთაზე.",
              "badge": "დეპოზიტი / მოქმედება"
          },
          {
              "title": "CPL (გადახდა კვალიფიციურ ლიდზე)",
              "desc": "რეგისტრაციაზე ორიენტირებული სტრუქტურა: ოპტიმალურია ფინტექისთვის, საკრედიტო ლიმიტებისა და ანგარიშების გასახსნელად.",
              "badge": "რეგისტრაცია"
          }
      ],
      "tagline": "პირობები დაკალიბრებულია ზუსტად თქვენი კოჰორტების ამოღების პერიოდებზე."
  },
  16: {
      "slideNumber": 16,
      "kicker": "ქეისი A · მასშტაბი კომპრომისების გარეშე",
      "title": "დამუშავებულია 4.4 მილიონი კლიკი 0% თაღლითობით.",
      "subtitle": "ალგორითმული დაცვის საიმედოობის დასტური კამპანიის პიკური დატვირთვის დროს.",
      "metrics": [
          {
              "value": "4.4M",
              "label": "სულ კლიკი",
              "sub": "მასშტაბური კამპანია"
          },
          {
              "value": "3,174",
              "label": "სუფთა ინსტალი",
              "sub": "100% რეალური ადამიანები"
          },
          {
              "value": "0.0%",
              "label": "ფროდი კოჰორტაში",
              "sub": "აუდიტი: ADH schnackmox1_int"
          }
      ],
      "bullets": [
          {
              "title": "ტრაფიკის კოლოსალური მოცულობა",
              "desc": "მილიონობით მოთხოვნის გაფილტვრა რეალურ დროში სიჩქარისა და კონვერსიის შემცირების გარეშე.",
              "badge": "მოცულობის ფილტრი"
          },
          {
              "title": "ნულოვანი გაჟონვა",
              "desc": "საკუთარმა ფაიერვოლმა უზრუნველყო, რომ არცერთი ყალბი კლიკი არ მოხვედრილა კლიენტის სისტემაში.",
              "badge": "გარანტია"
          }
      ],
      "tagline": "მაქსიმალური მასშტაბი მონაცემთა უნაკლო სისუფთავესთან ერთად."
  },
  17: {
      "slideNumber": 17,
      "kicker": "ქეისი B · პირდაპირი შემოსავალი",
      "title": "მომხმარებელთა მოზიდვა, რომლებიც მზად არიან გადაიხადონ.",
      "subtitle": "ერთკვირიანი კამპანიის სურათი ერთი წყაროდან, რომელიც აჩვენებს შემოსავლის ყოველდღიურ ზრდას.",
      "metrics": [
          {
              "value": "$15,329",
              "label": "შემოსავალი 7 დღეში",
              "sub": "დადასტურებული აპლიკაციაში"
          },
          {
              "value": "8.57%",
              "label": "კონვერსია გადახდაში",
              "sub": "გადამხდელი მომხმარებლების წილი"
          },
          {
              "value": "ზრდა",
              "label": "ყოველდღიურად",
              "sub": "დეპოზიტების სტაბილური დინამიკა"
          }
      ],
      "bullets": [
          {
              "title": "პირველი გადახდის სისწრაფე",
              "desc": "მომხმარებლები პირველ დეპოზიტს ინსტალაციიდან რამდენიმე საათში ახორციელებენ.",
              "badge": "სისწრაფე"
          },
          {
              "title": "მომხმარებელთა შენარჩუნება",
              "desc": "OEM-დან და ხარისხიანი პროგრამატიკიდან მოზიდული ტრაფიკი აჩვენებს Day-30 შენარჩუნებას 2.4-ჯერ მეტს საშუალოზე.",
              "badge": "შენარჩუნება"
          }
      ],
      "tagline": "ჩვენ წარმატებას ვზომავთ კლიენტის წმინდა მოგებით და არა გადმოწერების რაოდენობით."
  },
  18: {
      "slideNumber": 18,
      "kicker": "ოპტიმიზაციის ციკლი",
      "title": "უწყვეტი მასშტაბირების შეკრული ციკლი.",
      "subtitle": "როგორ აუმჯობესებს საძიებო მოთხოვნა სქორინგს OEM არხებში მრავალჯერადი ზრდისთვის.",
      "bullets": [
          {
              "title": "ეტაპი 1: მონაცემთა შეგროვება",
              "desc": "აქტიური საკვანძო სიტყვებისა და კონვერსიის სიგნალების დაჭერა Search & Social-ით.",
              "badge": "ეტაპი 01"
          },
          {
              "title": "ეტაპი 2: DMP ანალიზი და მოდელირება",
              "desc": "DMP ახდენს ქცევითი კოჰორტების პროფილს და ითვლის ხანგრძლივ LTV პოტენციალს.",
              "badge": "ეტაპი 02"
          },
          {
              "title": "ეტაპი 3: მასშტაბირება OEM-ში",
              "desc": "გამარჯვებული კომბინაციების მასობრივი გაშვება OEM და In-App მოცულობებზე მაღალი სიზუსტით.",
              "badge": "ეტაპი 03"
          }
      ],
      "tagline": "მუდმივი უკუკავშირი: საძიებო მონაცემები უწყვეტად ზრდის ქარხნული პრეინსტალაციების ROI-ს."
  },
  19: {
      "slideNumber": 19,
      "kicker": "უსაფრთხოება და კომპლაენსი",
      "title": "ბრენდის უსაფრთხოება, კომპლაენსი და მონაცემთა დაცვა.",
      "subtitle": "კორპორაციული სტანდარტები, რომლებიც იცავს თქვენი ბიზნესის რეპუტაციას მსოფლიოს ნებისმიერ წერტილში.",
      "bullets": [
          {
              "title": "Brand Safety გარანტია",
              "desc": "მკაცრი თეთრი სია გამორიცხავს რეკლამის გამოჩენას საეჭვო ან ტოქსიკურ კონტექსტში.",
              "badge": "უსაფრთხოება"
          },
          {
              "title": "რეგულაციებთან შესაბამისობა",
              "desc": "GDPR, CCPA და iGaming/FinTech-ის დარგობრივი ლიცენზიების 100%-იანი დაცვა.",
              "badge": "კანონი"
          },
          {
              "title": "კონფიდენციალურობის დაცვა (Privacy First)",
              "desc": "მომხმარებელთა იდენტიფიკატორები ჰეშირდება და ანონიმიზდება ქსელის დონეზე გადაცემის გარეშე.",
              "badge": "კონფიდენციალურობა"
          }
      ],
      "tagline": "კორპორაციული კომპლაენსი და იურიდიული სისუფთავე 100-ზე მეტ იურისდიქციაში."
  },
  20: {
      "slideNumber": 20,
      "kicker": "სამოქმედო გეგმა · ონბორდინგი",
      "title": "15-დღიანი გეგმა სწრაფი გაშვებისა და მასშტაბისთვის.",
      "subtitle": "მკაფიო, რისკებისგან თავისუფალი გზამკვლევი ხელშეკრულებიდან მომგებიან მასშტაბამდე.",
      "bullets": [
          {
              "title": "დღეები 1–3: სტრატეგიული სესია",
              "desc": "განვსაზღვრავთ 6 თვის მიზნებს, ერთეულის ეკონომიკას, LTV მრუდს და მოზიდვის სამიზნე ღირებულებას (CAC).",
              "badge": "დღეები 1-3"
          },
          {
              "title": "დღეები 4–7: MMP ინტეგრაცია და მონაცემები",
              "desc": "AppsFlyer / Adjust / Kochava პოსტბექების დაკავშირება და DMP პიქსელების დაკალიბრება.",
              "badge": "დღეები 4-7"
          },
          {
              "title": "დღეები 8–15: სატესტო გაშვება და ვალიდაცია",
              "desc": "A/B სატესტო ფრენების განხორციელება შემოწმებულ OEM ინვენტარზე ეკონომიკის დასადასტურებლად.",
              "badge": "დღეები 8-15"
          }
      ],
      "tagline": "მზად ხართ თქვენი ტრაფიკის ინფრასტრუქტურის გასაფართოებლად? დაუკავშირდით ალექსს."
  },
};

/**
 * Retrieve slide content for a given language and slide number with fallback to English.
 */
export function getDeckSlide(lang: HubLang, slideNumber: number): DeckSlideContent {
  if (lang === "ru") {
    return DECK_SLIDES_RU[slideNumber] || DECK_SLIDES_EN[slideNumber] || DECK_SLIDES_EN[1];
  }
  if (lang === "ro") {
    return DECK_SLIDES_RO[slideNumber] || DECK_SLIDES_EN[slideNumber] || DECK_SLIDES_EN[1];
  }
  if (lang === "ka") {
    return DECK_SLIDES_KA[slideNumber] || DECK_SLIDES_EN[slideNumber] || DECK_SLIDES_EN[1];
  }
  return DECK_SLIDES_EN[slideNumber] || DECK_SLIDES_EN[1];
}

/**
 * Retrieve UI controls strings for the media deck.
 */
export function getDeckUI(lang: HubLang): DeckUIStrings {
  return DECK_UI_STRINGS[lang] || DECK_UI_STRINGS.en;
}

export {
  type HubLang,
  HUB_LANGS,
  HUB_LANG_NAMES,
  HUB_RTL,
  HUB_PLAIN_SCRIPT,
};
