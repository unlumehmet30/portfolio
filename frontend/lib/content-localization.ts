import type { CaseStudy, Post, Profile, Project, Resume } from "@/types/content";
import type { Locale } from "@/lib/locale";

const translatedProfile: Pick<Profile, "title" | "bio" | "location"> = {
  title: "Elektronik ve Haberleşme Mühendisliği Öğrencisi",
  bio:
    "İTÜ'de Elektronik ve Haberleşme Mühendisliği okuyorum; tahminleme, bilgisayarlı görü ve veri iş akışlarını hızlandıran uygulamalı projeler geliştiriyorum.",
  location: "İstanbul, Türkiye"
};

type ProjectTranslation = Pick<
  Project,
  "title" | "summary" | "description" | "problem" | "challenge" | "architecture" | "results" | "tags" | "metrics"
> & {
  caseStudy?: CaseStudy;
};

const projectTranslations: Record<string, ProjectTranslation> = {
  "personal-portfolio-platform": {
    title: "Kişisel Portfolyo Platformu",
    summary:
      "Dinamik projeler, notlar, medya yüklemeleri, admin araçları ve güvenli self-hosted dağıtım içeren full-stack portfolyo platformu. Özellik geliştirme aktif olarak devam ediyor.",
    description:
      "Next.js frontend, API backend, admin kontrollü içerik yönetimi, proje galerileri, dosya yüklemeli notlar, iletişim akışı ve self-hosted production dağıtımını birleştiren kişisel portfolyo platformunu geliştirdim ve canlıda yönetiyorum.",
    problem:
      "Statik bir portfolyo; her yeni proje, not, görsel veya özgeçmiş güncellemesi için kod değişikliği gerektirirdi ve içerik yönetimi ile dağıtım tarafındaki mühendisliği görünür kılmazdı.",
    challenge:
      "Temel zorluk, kişisel web sitesini sürdürülebilir bir ürüne dönüştürmekti: güvenli admin erişimi, kalıcı yüklemeler, dinamik içerik, zengin not render'ı, responsive galeriler, cache ve production hardening aynı sistemde hafif kalmalıydı.",
    architecture:
      "Frontend Next.js App Router ve ISR cache kullanır. Tipli API katmanı projeleri, notları, yüklemeleri, özgeçmiş içeriğini ve iletişim mesajlarını yönetir; production ortamı ise public ve admin iş akışlarını ayıran HTTPS edge katmanı arkasında çalışır.",
    results:
      "Site dinamik projeleri, galeri yüklemelerini, görsel kırpmayı, PDF/HTML not eklerini, Markdown ve KaTeX render'ını, iletişim mesajlarını, güçlendirilmiş admin akışlarını ve self-hosted dağıtımı destekliyor; özellikler hâlâ aktif olarak geliştiriliyor.",
    tags: ["Next.js", "TypeScript", "Express", "Prisma", "Admin CMS", "Medya Yükleme", "Self-Hosted", "Aktif Geliştirme"],
    metrics: [
      { label: "Teknoloji", value: "Next.js + API", context: "Frontend ve backend platformu" },
      { label: "İçerik", value: "Dinamik", context: "Projeler, notlar, özgeçmiş, yüklemeler" },
      { label: "Dağıtım", value: "Self-hosted", context: "HTTPS production ortamı" },
      { label: "Durum", value: "Gelişiyor", context: "Özellikler hâlâ ekleniyor" }
    ],
    caseStudy: {
      dataset:
        "Portfolyo içeriği, yüklenen proje medyaları, teknik notlar, özgeçmiş verisi, iletişim mesajları ve production dağıtım konfigürasyonu.",
      technicalDecisions: [
        "İçerik kod değişikliği olmadan yönetilebilsin diye statik-only portfolyo yerine full-stack mimari kullandım.",
        "Public içeriği ISR ile cache'ledim, kimlik doğrulamalı admin akışlarını ise no-store davranışında tuttum.",
        "Yüklenen medyaları kalıcı şekilde sakladım ve dosyalara kontrollü API path'leriyle eriştirdim.",
        "Uygulamayı HTTPS edge katmanı arkasına aldım ve admin iş akışlarını public içerikten ayırdım."
      ],
      implementationDetails: [
        "Next.js public portfolyo, lokalize rotalar, proje sayfaları, notlar ve özgeçmiş görünümlerini render eder.",
        "Express ve Prisma; projeler, notlar, yüklemeler, profil verisi, iletişim mesajları ve admin işlemleri için REST endpoint'leri sunar.",
        "Admin paneli proje galerilerini, kapak görsellerini, görsel kırpmayı, PDF/HTML not dosyalarını ve Markdown içeriği destekler.",
        "Production ortamı public HTTPS giriş noktası arkasında ayrılmış uygulama servisleriyle çalışır."
      ],
      lessonsLearned: [
        "Bir portfolyo, içerik operasyonları manuel kod düzenleme olmaktan çıktığında çok daha kullanışlı hale gelir.",
        "Cache algılanan hızı ciddi artırır; ama admin rotaları ve public rotalar farklı tazelik kurallarına ihtiyaç duyar.",
        "Upload yönetimi kalıcılık, validasyon, önizleme ve uzun vadeli deploy davranışıyla birlikte düşünülmelidir."
      ],
      futureImprovements: [
        "Yüklemeleri daha kolay yedekleme ve CDN dağıtımı için object storage'a taşımak.",
        "Projeler ve teknik notlar arasında arama/filtreleme eklemek.",
        "Özel domain bağlandıktan sonra daha zengin analytics ve uptime monitoring eklemek.",
        "Yeni portfolyo ihtiyaçları çıktıkça admin akışını genişletmeye devam etmek."
      ],
      diagram: "web-platform"
    }
  },
  "intermittent-demand-forecasting-system": {
    title: "Seyrek Talep Tahminleme Sistemi",
    summary:
      "Günlük ürün satış verileri üzerinde seyrek talep tahmini için iki aşamalı bir makine öğrenmesi sistemi.",
    description:
      "Seyrek ürün talebi için üretim odaklı bir tahminleme akışı tasarladım; satış var/yok sınıflandırmasını satış miktarı regresyonu ve özyinelemeli çok adımlı tahminle birleştirdim.",
    problem:
      "Günlük ürün talebi büyük ölçüde sıfır satış kayıtlarından oluşuyordu. Bu durum doğrudan regresyonu kararsız hale getiriyor ve veri sızıntısı olmadan doğrulamayı zorlaştırıyordu.",
    challenge:
      "Temel zorluk, birçok ürün ufkunu kayan doğrulama pencerelerinde özyinelemeli tahmin ederken zamansal bütünlüğü korumaktı.",
    architecture:
      "İlk aşama ikili sınıflandırma ile satış olasılığını tahmin eder. İkinci aşama LightGBM Tweedie regresyonu ile koşullu satış miktarını hesaplar. Özyinelemeli tahmin döngüsü, önceki tahminleri gecikmeli ve kayan özelliklere adım adım geri besler.",
    results:
      "Sistem yorumlanabilir talep/tedariksizlik kararları üretti; WAPE ve RMSSE metriklerini kayan pencerelerde izledi ve sıfır-talep precision/recall değerlerini miktar hatasından ayrı değerlendirdi.",
    tags: [
      "Tahminleme",
      "LightGBM",
      "Tweedie",
      "Özyinelemeli Tahmin",
      "Sızıntısız Doğrulama",
      "Zaman Serisi"
    ],
    metrics: [
      { label: "Ürün", value: "20k", context: "Günlük ürün serileri" },
      { label: "Geçmiş", value: "3 yıl", context: "Kayan zaman pencereleri" },
      { label: "Sıfır talep", value: "85%", context: "Seyrek hedef kayıtları" },
      { label: "Metrikler", value: "WAPE / RMSSE", context: "Tahmin kalitesi" }
    ],
    caseStudy: {
      dataset:
        "20k ürün, üç yıllık günlük satış verisi, güçlü biçimde seyrek ürün seviyesi hedefler ve yaklaşık %85 sıfır-talep satırı.",
      technicalDecisions: [
        "Satış gerçekleşme ihtimalini ve satış miktarını ayrı modelleme aşamalarına böldüm.",
        "Negatif olmayan seyrek miktar tahmini için LightGBM Tweedie regresyonu kullandım.",
        "Özyinelemeli tahmini doğrulama sırasında üretim simülasyonu gibi ele aldım.",
        "Sıfır-talep precision, recall ve F1 metriklerini toplam tahmin hatasından ayrı takip ettim."
      ],
      implementationDetails: [
        "Gecikmeli ve kayan özellikler çok adımlı tahmin sırasında her ufukta yeniden hesaplandı.",
        "Kayan doğrulama pencereleri zaman sırasını korudu ve geleceğe bakmayı engelledi.",
        "Raporlama WAPE, RMSSE, MAE, RMSE ve sınıflandırma metriklerini birlikte içerdi.",
        "Özellik üretimi ürün bazlı günlük durum güncellemeleri etrafında organize edildi."
      ],
      lessonsLearned: [
        "Seyrek talep tahmini kısmen bir sınıflandırma problemidir.",
        "Özyinelemeli özellikler kullanılıyorsa doğrulama kodu tahmin koduna benzemelidir.",
        "Tek bir metrik hem satış-yok kararlarını hem de miktar kalitesini açıklayamaz."
      ],
      futureImprovements: [
        "Satış var/yok eşikleri için olasılık kalibrasyonu eklemek.",
        "Ürün kategorileri üzerinde hiyerarşik toplulaştırmayı karşılaştırmak.",
        "Mevsimsel ürün davranışları için drift takibi eklemek."
      ],
      diagram: "forecasting"
    }
  },
  "ml-pipeline-runtime-optimization": {
    title: "ML Veri Hattı Performans Optimizasyonu",
    summary:
      "Gereksiz hesaplamaları, bellek şişmesini ve Python seviyesindeki darboğazları azaltarak büyük ölçekli bir ML özellik üretimi ve tahmin hattını optimize ettim.",
    description:
      "Yoğun özellik üretimi yapan bir ML hattını vektörleştirilmiş işlemler, matris tabanlı hesaplama ve bellek farkındalığı olan dönüşümler etrafında yeniden düzenledim.",
    problem:
      "Çalışma süresi ve bellek baskısı iterasyonu yavaş, maliyetli ve üretim benzeri veri boyutlarında ölçeklenmesi zor hale getiriyordu.",
    challenge:
      "Veri hattı tekrarlanan veri çerçevesi işlemleri, Python döngüleri, gereksiz ara nesneler ve verinin yapısına uymayan hesaplama yolları içeriyordu.",
    architecture:
      "Optimize edilen akış özellik dönüşümlerini toplu işler, satır bazlı döngüleri NumPy/Pandas vektörleştirmesiyle değiştirir, bağımsız hesaplamaları paralelleştirir ve geçici bellek ayırmalarını kontrol eder.",
    results:
      "Model davranışını koruyarak yaklaşık 1 GB ve 3 milyon satırlık veri üzerinde uçtan uca süreyi 40 dakikadan 4 dakikaya indirdim.",
    tags: ["Optimizasyon", "NumPy", "Pandas", "Vektörleştirme", "Paralelleştirme", "ML Sistemleri"],
    metrics: [
      { label: "Süre", value: "40dk -> 4dk", context: "Uçtan uca veri hattı" },
      { label: "Satır", value: "3M", context: "Özellik hesaplama ölçeği" },
      { label: "Veri", value: "~1 GB", context: "Tabular iş yükü" },
      { label: "Hızlanma", value: "10x", context: "İterasyon hızı" }
    ],
    caseStudy: {
      dataset: "Yaklaşık 1 GB tabular veri ve özellik üretimi/tahmin adımlarından geçen 3 milyon satır.",
      technicalDecisions: [
        "Önce profil çıkardım, sonra en yoğun hesaplama yollarını optimize ettim.",
        "Satır seviyesindeki Python işlemlerini vektörleştirilmiş NumPy/Pandas dönüşümleriyle değiştirdim.",
        "Tekrarlanan özellik hesaplamalarını toplu işledim ve gereksiz ara veri çerçevelerini kaldırdım.",
        "Paralelliği yalnızca bağımsız iş yükleri ve net bellek sınırları için kullandım."
      ],
      implementationDetails: [
        "Tekrarlanan döngüleri matris odaklı işlemlere dönüştürdüm.",
        "Veri çerçevesi kopyalarını ve geçici nesne büyümesini azalttım.",
        "Hesaplamayı C destekli array işlemlerine yaklaştırdım.",
        "Kritik özellik kolonları için çıktı eşdeğerliği kontrolleri tuttum."
      ],
      lessonsLearned: [
        "Performans optimizasyonu çoğu zaman modelden önce veri düzeni problemidir.",
        "Bellek şişmesi pratik veri çerçevesi zincirlerinin içinde görünmeden büyüyebilir.",
        "Küçük Python işlemleri milyonlarca kez tekrarlandığında pahalı hale gelir."
      ],
      futureImprovements: [
        "CI sürecine otomatik profiling snapshot'ları eklemek.",
        "Belleği aşan iş yükleri için Polars veya DuckDB denemek.",
        "Üretim koşularında maksimum bellek kullanımını takip etmek."
      ],
      diagram: "optimization"
    }
  },
  "hybrid-visual-odometry-system": {
    title: "Hibrit Görsel Odometri Sistemi",
    summary:
      "Derin öğrenme tabanlı optik akış ile klasik bilgisayarlı görüyü birleştiren, güven skoruna duyarlı bir görsel odometri sistemi.",
    description:
      "RAFT optik akışını ORB tabanlı klasik bir dal ve güven skoruna göre seçim yapan bir yapı ile birleştiren iki başlı bir görsel odometri mimarisi denedim.",
    problem:
      "Tek yöntemli görsel odometri; alan değişimi, doku farklılığı, hareket bulanıklığı ve belirsiz optik akış tahminlerinde zayıflayabiliyor.",
    challenge:
      "Sistem, öğrenilmiş akış ile klasik özellikler arasında seçim yapabilen ve hiçbir dalı her zaman güvenilir kabul etmeyen pratik bir karar mekanizmasına ihtiyaç duyuyordu.",
    architecture:
      "RAFT dalı yoğun hareket tahmini yapar, ORB dalı özellik tabanlı poz sinyali üretir ve güven skoruna duyarlı seçici nihai poz tahminini belirler.",
    results:
      "Hibrit yapı; dal güveni, hareket tutarlılığı ve nihai trajektori stabilitesini karşılaştırmak için kontrollü bir araştırma yolu oluşturdu.",
    tags: ["Bilgisayarlı Görü", "RAFT", "ORB", "Görsel Odometri", "Hibrit AI"],
    metrics: [
      { label: "Dal", value: "2", context: "RAFT + ORB" },
      { label: "Seçici", value: "Güven", context: "Tahmin yönlendirme" },
      { label: "Çıktı", value: "Pose", context: "Trajektori tahmini" }
    ],
    caseStudy: {
      dataset:
        "Yoğun optik akış, özellik eşleşmeleri ve poz tahmini davranışını karşılaştırmaya uygun hareket ipuçları içeren kare dizileri.",
      technicalDecisions: [
        "Seçimden önce öğrenilmiş ve klasik dalları bağımsız tuttum.",
        "Dal güvenini yalnızca log değeri değil, karar mekanizmasının ana sinyali olarak ele aldım.",
        "Nihai poz tahminine geçmeden önce hareket tutarlılığını karşılaştırdım."
      ],
      implementationDetails: [
        "RAFT ardışık kareler arasında yoğun optik akış tahmin eder.",
        "ORB klasik poz sinyali için anahtar nokta çıkarır ve eşleştirir.",
        "Güven seçici, daha güçlü tahmini nihai poz hesaplamasına yönlendirir."
      ],
      lessonsLearned: [
        "Hibrit sistemler, hata modları birbirini tamamladığında değerli hale gelir.",
        "Güven tahmini, ham dal başarımı kadar önemlidir.",
        "Klasik bilgisayarlı görü, yorumlanabilir bir yedek dal olarak hâlâ güçlüdür."
      ],
      futureImprovements: [
        "Trajektori seviyesi smoothing ve bundle adjustment denemeleri eklemek.",
        "Seçim mantığını hareket bulanıklığı ve düşük doku içeren sahnelerde karşılaştırmak.",
        "Dal güvenini ayrılmış sahne koşullarıyla kalibre etmek."
      ],
      diagram: "visual-odometry"
    }
  },
  "whisper-based-speech-nlp-system": {
    title: "Whisper Tabanlı Konuşma ve NLP Sistemi",
    summary:
      "Whisper ve NLP modelleriyle çalışan, kendi sunucusunda barındırılabilen bir konuşma transkripsiyonu ve metin işleme sistemi.",
    description:
      "Whisper transkripsiyonu, prompt tabanlı özetleme ve Hugging Face model entegrasyonu etrafında sunucu taraflı bir konuşma/metin hattı kurdum.",
    problem:
      "Konuşma iş akışları çoğu zaman harici SaaS katmanlarına bağlı kalıyor; bu da yerel denemeyi, gizlilik odaklı dağıtımı ve özel metin işlemeyi zorlaştırıyor.",
    challenge:
      "Sistemin Türkçe ve İngilizce girdileri desteklemesi; transkripsiyon, özetleme ve sonraki NLP adımlarını modüler tutması gerekiyordu.",
    architecture:
      "Ses Whisper transkripsiyon aşamasına girer, dil farkındalığı olan metin normalizasyonundan geçer, ardından prompt tabanlı özetleme ve opsiyonel model adaptörlerine akar.",
    results:
      "Veri hattı, genişletilebilir NLP sonrası işleme adımlarıyla yerel/sunucu taraflı speech-to-text akışları için sağlam bir temel oluşturur.",
    tags: ["Whisper", "NLP", "Hugging Face", "Konuşmadan Metne", "Kendi Sunucunda AI"],
    metrics: [
      { label: "Diller", value: "TR / EN", context: "Konuşma desteği" },
      { label: "Veri hattı", value: "STT + NLP", context: "Sesten metin içgörüsü" },
      { label: "Dağıtım", value: "Kendi sunucunda", context: "Sunucu tarafı odak" }
    ],
    caseStudy: {
      dataset:
        "Özetleme ve analiz gibi sonraki metin işleme ihtiyaçları olan Türkçe ve İngilizce ses girdileri.",
      technicalDecisions: [
        "Transkripsiyon, normalizasyon, özetleme ve model adaptörlerini modüler tuttum.",
        "Dağıtım kısıtlarını veri hattı tasarımının parçası olarak ele aldım.",
        "Tekrarlanabilir NLP çıktıları için prompt şablonları destekledim."
      ],
      implementationDetails: [
        "Whisper sunucu tarafında speech-to-text aşamasını yönetir.",
        "Metin, prompt tabanlı özetlemeden önce normalize edilir.",
        "Hugging Face adaptörleri görev odaklı NLP işleme için eklenebilir."
      ],
      lessonsLearned: [
        "Speech-to-text kalitesi, kullanıcıya görünen iş akışının yalnızca bir parçasıdır.",
        "Dil farkındalığı olan temizlik sonraki model davranışını iyileştirir.",
      "Kendi sunucunda çalıştırmak gözlemlenebilirliği ve özelleştirmeyi kolaylaştırır."
      ],
      futureImprovements: [
        "Çok konuşmacılı sesler için diarization eklemek.",
        "Uzun transkripsiyonlar için asenkron job queue kullanmak.",
        "Transkript versiyonlarını ve prompt çıktılarını inceleme için saklamak."
      ],
      diagram: "speech"
    }
  },
  "ai-powered-storytelling-flutter-app": {
    title: "AI Destekli Hikaye Anlatımı / Flutter Uygulaması",
    summary:
      "Çocuklar ve ebeveynler için AI destekli hikaye, video, altyazı ve ses işleme akışları kullanan bir mobil uygulama konsepti.",
    description:
      "Ebeveyn/çocuk akışlarını, medya yüklemeyi, altyazıları, ses işlemeyi ve prompt tabanlı AI üretimini birleştiren Flutter ve Firebase tabanlı bir uygulama konsepti tasarladım.",
    problem:
      "Aile odaklı hikaye araçları ebeveynler için güvenli akışlara, çocuklar için anlaşılır içeriğe ve esnek multimedya üretimine ihtiyaç duyar.",
    challenge:
      "Ürün konsepti mobil UX, Firebase destekli depolama, yüklenen medya, prompt orkestrasyonu ve konuşma işleme adımlarını birlikte yönetmeliydi.",
    architecture:
      "Flutter mobil arayüzü yönetir, Firebase kimlik doğrulama ve medya durumunu tutar, AI servisleri hikaye üretimi, altyazı ve ses işleme özelliklerini sağlar.",
    results:
      "Uygulama konsepti, net kullanıcı rolleri ve genişletilebilir içerik iş akışlarıyla AI destekli multimedya hikaye anlatımı için pratik bir mimari tanımlar.",
    tags: ["Flutter", "Firebase", "AI Ürünü", "Konuşma İşleme", "Mobil"],
    metrics: [
      { label: "Roller", value: "Ebeveyn / Çocuk", context: "Ayrı UX akışları" },
      { label: "Medya", value: "Video + Ses", context: "Yükleme akışları" },
      { label: "AI", value: "Prompt", context: "Üretilen içerik" }
    ],
    caseStudy: {
      dataset:
        "Hikaye üretim akışları için kullanıcı tarafından sağlanan video, altyazı seçimleri, yüklenen ses örnekleri ve prompt girdileri.",
      technicalDecisions: [
        "Ebeveyn ve çocuk UX akışlarını ayırdım.",
        "Kimlik doğrulama, depolama ve uygulama durumu için Firebase kullandım.",
        "AI üretimini yapılandırılmış prompt orkestrasyonunun arkasında tuttum."
      ],
      implementationDetails: [
        "Flutter çapraz platform mobil arayüzü yönetir.",
        "Medya yükleme akışları video, altyazı ve ses girdilerini toplar.",
        "AI servisleri hikaye içeriği üretir ve konuşma odaklı özelliklere destek verir."
      ],
      lessonsLearned: [
        "AI ürün tasarımı rol farkındalığı olan güvenlik sınırlarına ihtiyaç duyar.",
        "Medya iş akışları net ilerleme ve hata durumları gerektirir.",
        "Prompt sistemleri yapılandırılmış kullanıcı girdilerinden faydalanır."
      ],
      futureImprovements: [
        "Moderasyon ve ebeveyn onayı akışları eklemek.",
        "Offline taslaklar ve arka plan yükleme tekrarları eklemek.",
        "Üretilen içerik kalitesini yaşa uygun değerlendirme rubrikleriyle ölçmek."
      ],
      diagram: "mobile"
    }
  }
};

type PostTranslation = Pick<Post, "title" | "excerpt" | "content" | "tags">;

const postTranslations: Record<string, PostTranslation> = {
  "avoiding-data-leakage-in-recursive-forecasting": {
    title: "Özyinelemeli Tahminlerde Veri Sızıntısından Kaçınmak",
    excerpt:
      "Önceki tahminlere bağlı gecikmeli özellikler kullanılırken zamansal bütünlüğü korumaya dair pratik bir not.",
    content:
      "Özyinelemeli tahmin, doğrulama özellikleri yanlışlıkla geleceği gördüğünde hızla bozulur. Sızıntısız bir kurulumda gecikmeli ve kayan özellikler her ufuk adımında yalnızca gözlenen geçmiş ve önceki tahminler kullanılarak yeniden hesaplanır.\n\nEn güvenli zihinsel model doğrulamayı üretim gibi ele almaktır: Her özellik, tahminin yapıldığı zaman damgasında gerçekten mevcut olmalıdır.",
    tags: ["Tahminleme", "Doğrulama", "ML Sistemleri"]
  },
  "why-wape-alone-can-be-misleading": {
    title: "WAPE Tek Başına Neden Yanıltıcı Olabilir",
    excerpt:
      "WAPE yararlı bir metriktir; ancak seyrek talep ve yüksek sıfır oranları önemli hata modlarını gizleyebilir.",
    content:
      "WAPE toplam mutlak hatayı özetler, fakat seyrek talepte satış-yok sınıflandırma davranışını yeterince görünür kılmayabilir. WAPE'i RMSSE, MAE, RMSE ve sıfır-talep precision/recall metrikleriyle birlikte kullanmak daha tamamlayıcı bir bakış sağlar.\n\nAmaç tek bir kusursuz metrik bulmak değildir; gerçek iş ve modelleme risklerini yansıtan bir metrik seti kurmaktır.",
    tags: ["Metrikler", "Tahminleme"]
  },
  "two-stage-modeling-for-intermittent-demand": {
    title: "Seyrek Talep İçin İki Aşamalı Modelleme",
    excerpt:
      "Satış gerçekleşme ihtimalini satış miktarından ayırmak, seyrek tahminleme sistemlerini daha anlaşılır hale getirebilir.",
    content:
      "İki aşamalı talep modeli önce satış olup olmayacağını tahmin eder, ardından satış gerçekleştiği varsayımıyla miktarı hesaplar. Satırların çoğu sıfır olduğunda bu ayrım daha net diagnostik sağlar.\n\nAyrıca modelin satış gerçekleşmesi ve miktar için farklı hedefleri optimize etmesine imkân verir; bu da ürün seviyesi günlük verilerde çoğu zaman faydalıdır.",
    tags: ["Seyrek Talep", "LightGBM"]
  },
  "vectorization-vs-python-loops-in-ml-pipelines": {
    title: "ML Veri Hatlarında Vektörleştirme ve Python Döngüleri",
    excerpt:
      "En hızlı iyileştirme çoğu zaman tekrarlanan Python seviyesindeki işleri vektörleştirilmiş array işlemlerine taşımaktır.",
    content:
      "Python döngüleri yazması kolaydır, ancak büyük özellik üretimi hatlarında pahalı hale gelir. NumPy ve Pandas vektörleştirmesi, hesaplamayı optimize C seviyesindeki yollara yaklaştırır ve interpreter maliyetini azaltır.\n\nİyi optimizasyon işi profiling ile başlar; sonra en sıcak yoldaki tekrarlanan bellek ayırmalarını ve satır bazlı işlemleri kaldırır.",
    tags: ["Optimizasyon", "NumPy", "Pandas"]
  },
  "hybrid-visual-odometry-raft-orb": {
    title: "Hibrit Görsel Odometri: RAFT + ORB",
    excerpt:
      "Güven seçici, derin ve klasik görsel odometri dallarını daha dayanıklı bir araştırma mimarisine dönüştürebilir.",
    content:
      "RAFT yoğun optik akış sağlar; ORB ise klasik özellik tabanlı bir sinyal üretir. Hibrit bir görsel odometri sistemi, poz tahminini seçmeden önce iki dalın güvenini ve tutarlılığını karşılaştırabilir.\n\nİlginç mühendislik problemi yalnızca model doğruluğu değildir; hangi dalın ne zaman güvenilir olduğuna karar vermektir.",
    tags: ["Bilgisayarlı Görü", "Görsel Odometri"]
  },
  "building-self-hosted-whisper-pipelines": {
    title: "Kendi Sunucunda Whisper Veri Hatları Kurmak",
    excerpt:
      "Whisper, transkripsiyon daha büyük bir NLP sisteminin aşamalarından biri olarak ele alındığında daha kullanışlı hale gelir.",
    content:
      "Kendi sunucunda çalışan bir Whisper hattı transkripsiyon, dil farkındalığı olan temizlik, özetleme ve göreve özel NLP adaptörlerini birlikte yönetebilir. Aşamaları modüler tutmak sistemi dağıtmayı ve iyileştirmeyi kolaylaştırır.\n\nTürkçe ve İngilizce iş akışlarında açık dil yönetimi ve prompt şablonları, sonraki çıktıların daha öngörülebilir olmasına yardımcı olur.",
    tags: ["Whisper", "NLP", "Dağıtım"]
  }
};

const translatedResume: Pick<
  Resume,
  "summary" | "experience" | "projects" | "education" | "skills" | "researchInterests" | "certifications"
> = {
  summary:
    "İstanbul Teknik Üniversitesi'nde Elektronik ve Haberleşme Mühendisliği öğrencisiyim. Tahminleme, bilgisayarlı görü ve veri iş akışı optimizasyonu üzerine çalışıyorum. Son çalışmalarım arasında özyinelemeli talep tahmini, drone görüntüleriyle görsel odometri denemeleri ve PyTorch, TensorFlow, LightGBM, NumPy, Pandas ve OpenCV kullanarak özellik üretimi hatlarını hızlandırma yer alıyor. Özellikle sıralı karar sistemleri ve otonom algı konularına ilgi duyuyorum.",
  experience: [
    {
      role: "AI Specialist Assistant",
      organization: "Ravelos",
      period: "Aralık 2025 - Günümüz",
      highlights: [
        "20K+ ürün, 3M+ satır ve yaklaşık %85 sıfır-talep gözlemi içeren perakende benzeri veri setleri için seyrek talep tahminleme sistemleri geliştirdim.",
        "Seyrek talep modelleme için sınıflandırma ve LightGBM tabanlı regresyon hatlarını birleştiren iki aşamalı tahminleme mimarisi tasarladım.",
        "Gelecekte mevcut olmayacak bilgiye erişmeden tahmin üreten tamamen özyinelemeli çıkarım akışları kurarak veri sızıntısını engelledim.",
        "İş odaklı özel değerlendirme metrikleri ve gelişmiş özellik mühendisliğiyle tahmin doğruluğunu yaklaşık %40'tan %65-70 aralığına iyileştirdim.",
        "Vektörleştirme, paralelleştirme, bellek optimizasyonu ve matris tabanlı hesaplama ile uçtan uca ML veri hattı süresini 40 dakikadan 4 dakikaya indirdim."
      ]
    },
    {
      role: "Software / AI Engineer",
      organization: "Vcamp",
      period: "Aralık 2025 - Günümüz",
      highlights: [
        "İHA odaklı otonom algı sistemleri için hibrit görsel odometri mimarileri geliştirdim.",
        "ORB ve optik akış gibi klasik bilgisayarlı görü tekniklerini RAFT tabanlı derin öğrenme hareket tahmini hatlarıyla birleştirdim.",
        "En güvenilir hareket tahmini çıktısını dinamik olarak seçen güven skoruna duyarlı model seçimi mekanizmaları tasarladım.",
        "PyTorch ve OpenCV kullanarak özel drone görüntülerinde yaklaşık 7.5 FPS çıkarım performansıyla gerçek zamanlı denemeler yaptım."
      ]
    },
    {
      role: "Kurucu",
      organization: "Spaidream",
      period: "Eylül 2025 - Günümüz",
      highlights: [
        "Flutter, Firebase ve OpenAI API'leriyle çocuklara yönelik AI destekli hikaye anlatımı ve sosyal etkileşim platformu SketchMind'ı geliştirdim.",
        "Hikaye üretimi, altyazı sistemleri, multimodal etkileşim ve ses tabanlı AI entegrasyonu içeren uçtan uca mobil AI akışları kurdum.",
        "Frontend, backend, AI entegrasyonu ve sistem mimarisi geliştirmelerini bağımsız olarak yürüttüm."
      ]
    }
  ],
  projects: [
    "Whisper Tabanlı Altyazı ve Konuşma İşleme Sistemi",
    "Seyrek Talep Tahminleme Sistemi",
    "Hibrit Görsel Odometri Sistemi",
    "SketchMind AI Destekli Hikaye Anlatımı Platformu"
  ],
  education: [
    {
      degree: "Lisans, Elektronik ve Haberleşme Mühendisliği",
      school: "İstanbul Teknik Üniversitesi (İTÜ)",
      period: "Beklenen Mezuniyet: 2028"
    }
  ],
  skills: [
    "Makine Öğrenmesi",
    "Derin Öğrenme",
    "Zaman Serisi Tahminleme",
    "Seyrek Talep Tahminleme",
    "Özellik Mühendisliği",
    "Sıralı Karar Sistemleri",
    "Pekiştirmeli Öğrenme",
    "Bilgisayarlı Görü",
    "NLP",
    "MLOps",
    "Optimizasyon"
  ],
  researchInterests: [
    "Makine Öğrenmesi Sistemleri",
    "Seyrek Talep Tahminleme",
    "Sıralı Karar Sistemleri",
    "Pekiştirmeli Öğrenme",
    "Otonom Algı Sistemleri",
    "Edge AI ve Gömülü Zeka",
    "Graph-Sheaf Neural Networks"
  ],
  certifications: [
    "PyTorch ile Derin Öğrenme Algoritması - BTK Akademi",
    "Derin Öğrenme ile Doğal Dil İşleme - BTK Akademi",
    "Büyük Veri - BTK Akademi"
  ]
};

export function localizeProfile(profile: Profile, locale: Locale): Profile {
  if (locale === "en") return profile;
  return {
    ...profile,
    ...translatedProfile
  };
}

export function localizeProject(project: Project, locale: Locale): Project {
  if (locale === "en") return project;

  const translation = projectTranslations[project.slug];
  if (!translation) return project;

  return {
    ...project,
    ...translation,
    caseStudy: translation.caseStudy ?? project.caseStudy
  };
}

export function localizeProjects(projects: Project[], locale: Locale): Project[] {
  return projects.map((project) => localizeProject(project, locale));
}

export function localizePost(post: Post, locale: Locale): Post {
  if (locale === "en") return post;

  const translation = postTranslations[post.slug];
  if (!translation) return post;

  return {
    ...post,
    ...translation
  };
}

export function localizePosts(posts: Post[], locale: Locale): Post[] {
  return posts.map((post) => localizePost(post, locale));
}

export function localizeResume(resume: Resume, locale: Locale): Resume {
  if (locale === "en") return resume;

  return {
    ...resume,
    ...translatedResume,
    tools: resume.tools,
    contact: resume.contact
  };
}
