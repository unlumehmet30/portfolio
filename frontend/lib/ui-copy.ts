import type { Locale } from "@/lib/locale";

type HomeSystemItem = {
  title: string;
  description: string;
};

type HeroMetric = {
  label: string;
  value: string;
  context: string;
};

type UiCopy = {
  navbar: {
    brandHomeAria: string;
    toggleThemeAria: string;
    openMenuAria: string;
    switchLanguageAria: string;
    languageSwitchLabel: string;
  };
  footer: {
    githubAria: string;
    linkedinAria: string;
    emailAria: string;
  };
  hero: {
    badge: string;
    heading: string;
    introPrimary: string;
    introSecondary: string;
    actions: {
      projects: string;
      downloadCv: string;
      github: string;
      linkedin: string;
      contact: string;
    };
    workbench: {
      cardTitle: string;
      location: string;
      title: string;
      description: string;
      buildNotesTitle: string;
      notes: string[];
      defaultMetrics: HeroMetric[];
    };
  };
  home: {
    workOn: {
      eyebrow: string;
      title: string;
      description: string;
      systems: HomeSystemItem[];
    };
    selectedWork: {
      eyebrow: string;
      title: string;
      description: string;
      allProjects: string;
      empty: string;
    };
    tools: {
      eyebrow: string;
      title: string;
    };
    notes: {
      eyebrow: string;
      title: string;
      readNotes: string;
      empty: string;
    };
  };
  about: {
    metadataTitle: string;
    metadataDescription: string;
    eyebrow: string;
    title: string;
    description: string;
    paragraphs: string[];
    focusAreasTitle: string;
    focusAreas: string[];
  };
  projects: {
    metadataTitle: string;
    metadataDescription: string;
    eyebrow: string;
    title: string;
    description: string;
    empty: string;
  };
  notes: {
    metadataTitle: string;
    metadataDescription: string;
    eyebrow: string;
    title: string;
    description: string;
    empty: string;
    fallbackDetailTitle: string;
  };
  contact: {
    metadataTitle: string;
    metadataDescription: string;
    eyebrow: string;
    title: string;
    description: string;
    email: string;
    github: string;
    linkedin: string;
  };
  contactForm: {
    name: string;
    email: string;
    subject: string;
    message: string;
    nameRequired: string;
    invalidEmail: string;
    minMessage: string;
    sendError: string;
    idleText: string;
    send: string;
  };
  resume: {
    metadataTitle: string;
    metadataDescription: string;
    eyebrow: string;
    title: string;
    downloadPdf: string;
    emptyExperience: string;
    sectionTitles: {
      experience: string;
      projects: string;
      education: string;
      skills: string;
      tools: string;
      researchInterests: string;
      certifications: string;
      contact: string;
    };
    links: {
      email: string;
      github: string;
      linkedin: string;
    };
    fallbackSummary: string;
  };
  projectCard: {
    featured: string;
    caseStudy: string;
    source: string;
  };
  caseStudy: {
    problem: string;
    challenge: string;
    architectureEyebrow: string;
    architectureTitle: string;
    datasetInputs: string;
    technicalDecisions: string;
    implementationDetails: string;
    metricsResults: string;
    lessonsLearned: string;
    futureImprovements: string;
    demo: string;
  };
};

const uiCopy: Record<Locale, UiCopy> = {
  en: {
    navbar: {
      brandHomeAria: "Mehmet Ünlü home",
      toggleThemeAria: "Toggle color theme",
      openMenuAria: "Open navigation menu",
      switchLanguageAria: "Switch language",
      languageSwitchLabel: "TR"
    },
    footer: {
      githubAria: "GitHub",
      linkedinAria: "LinkedIn",
      emailAria: "Email"
    },
    hero: {
      badge: "ITU Electronics and Communication Engineering",
      heading: "Forecasting, computer vision, and making slow data code less painful.",
      introPrimary:
        "I work on forecasting, computer vision, and practical tooling around data and models through hands-on projects and early product work.",
      introSecondary:
        "I like problems where the model is only part of the story: messy data, validation decisions, runtime limits, and the small engineering choices that make an experiment usable.",
      actions: {
        projects: "View Projects",
        downloadCv: "Download CV",
        github: "GitHub",
        linkedin: "LinkedIn",
        contact: "Contact"
      },
      workbench: {
        cardTitle: "Featured case study",
        location: "Istanbul / ITU",
        title: "Forecasting, computer vision, and making slow data code less painful.",
        description:
          "The strongest projects here come from real constraints: many zero-demand rows, drone footage that needs careful motion estimates, and pipelines that must be fast enough to iterate on.",
        buildNotesTitle: "Build notes",
        notes: [
          "Keep validation close to the way the project would actually run.",
          "Measure the boring parts: runtime, memory, leakage, and failure cases.",
          "Write case studies so the tradeoffs are visible, not hidden."
        ],
        defaultMetrics: [
          { label: "Products", value: "20K+", context: "Sparse daily series" },
          { label: "Rows", value: "3M+", context: "Feature workload" },
          { label: "Runtime", value: "40m -> 4m", context: "Pipeline cleanup" },
          { label: "Drone footage", value: "7.5 FPS", context: "VO experiments" }
        ]
      }
    },
    home: {
      workOn: {
        eyebrow: "What I Work On",
        title: "I care about models that survive contact with real data.",
        description:
          "Most of my work starts with an awkward constraint: too many zeros, slow feature code, noisy motion, or a validation setup that needs to be treated carefully.",
        systems: [
          {
            title: "Forecasting",
            description: "Sparse demand, rolling validation, and recursive predictions without peeking into the future."
          },
          {
            title: "Validation",
            description: "Checking whether the setup is fair before trusting the score."
          },
          {
            title: "Speed",
            description: "Replacing slow loops and repeated work with cleaner, faster data transforms."
          },
          {
            title: "Pipelines",
            description: "Small backend and data workflows that keep projects usable end to end."
          },
          {
            title: "Experiments",
            description: "Computer vision, speech processing, and mobile ideas tested as working prototypes."
          }
        ]
      },
      selectedWork: {
        eyebrow: "Selected Work",
        title: "Projects written with the tradeoffs left in.",
        description:
          "Each case study explains the problem, what I tried, what I measured, and where the constraints shaped the implementation.",
        allProjects: "All projects",
        empty: "Start the backend and seed the database to load featured projects."
      },
      tools: {
        eyebrow: "Tools",
        title: "Tools I reach for when the problem calls for them."
      },
      notes: {
        eyebrow: "Notes",
        title: "Short notes from the build log.",
        readNotes: "Read notes",
        empty: "Notes will appear here after the backend is running."
      }
    },
    about: {
      metadataTitle: "About",
      metadataDescription:
        "About Mehmet Ünlü, an ITU Electronics and Communication Engineering student working on forecasting, computer vision, and practical ML projects.",
      eyebrow: "About",
      title: "I learn best by building things that can be tested.",
      description:
        "I am an Electronics and Communication Engineering student at Istanbul Technical University. My work mostly sits around forecasting, computer vision, speech processing, and making ML code easier to run and reason about.",
      paragraphs: [
        "I am drawn to projects where the hard part is not only choosing a model. Forecasting sparse demand, for example, forced me to think about validation, zero-heavy targets, recursive prediction, and whether the features would actually exist at prediction time.",
        "On the computer vision side, I have been experimenting with visual odometry ideas on drone footage. On the product side, I have worked with Flutter, Firebase, and speech or story-generation flows. Some of it is research-like, some of it is product-like, but I try to keep the work concrete.",
        "I care about leaving a trail: what changed, what improved, what failed, and what I would do differently. That is why the projects here are written as case studies instead of only screenshots and tags."
      ],
      focusAreasTitle: "Focus Areas",
      focusAreas: [
        "Sparse demand forecasting and careful validation.",
        "Feature engineering, vectorization, and runtime cleanup.",
        "Computer vision experiments on motion and perception.",
        "Speech processing, subtitles, and practical NLP workflows.",
        "Mobile product prototypes with Flutter and Firebase."
      ]
    },
    projects: {
      metadataTitle: "Projects",
      metadataDescription:
        "Project case studies by Mehmet Ünlü: forecasting, pipeline optimization, visual odometry, speech processing, and Flutter product work.",
      eyebrow: "Projects",
      title: "Selected work, written as case studies.",
      description:
        "These are not just tiles. Each project explains the context, the implementation choices, the measurements, and the parts that still need work.",
      empty: "No projects are available yet. Start the backend and run the Prisma seed command."
    },
    notes: {
      metadataTitle: "Notes",
      metadataDescription:
        "Technical notes, course notes, visual explanations, and cheat sheets by Mehmet Ünlü on AI, ML, forecasting, computer vision, and systems.",
      eyebrow: "Notes",
      title: "Technical notes, diagrams, and build writeups.",
      description:
        "A mixed notebook for blog-style build logs, AI course notes, visual explanations, and compact cheat sheets.",
      empty: "No notes are available yet. Start the backend and seed the database.",
      fallbackDetailTitle: "Note"
    },
    contact: {
      metadataTitle: "Contact",
      metadataDescription:
        "Contact Mehmet Ünlü about forecasting, computer vision, ML project work, or collaboration.",
      eyebrow: "Contact",
      title: "Have a project, question, or collaboration idea?",
      description: "Send a direct message here, or reach me through email, GitHub, or LinkedIn.",
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn"
    },
    contactForm: {
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      nameRequired: "Name is required.",
      invalidEmail: "Please enter a valid email address.",
      minMessage: "Message must be at least 10 characters.",
      sendError: "Could not send your message.",
      idleText: "I usually reply from email after seeing the message here.",
      send: "Send message"
    },
    resume: {
      metadataTitle: "Resume",
      metadataDescription:
        "Resume of Mehmet Ünlü: ITU engineering student working on forecasting, computer vision, optimization, speech processing, and Flutter projects.",
      eyebrow: "Resume",
      title: "Resume and project background.",
      downloadPdf: "Download PDF",
      emptyExperience: "Experience entries will load from the backend API.",
      sectionTitles: {
        experience: "Experience",
        projects: "Projects",
        education: "Education",
        skills: "Skills",
        tools: "Tools",
        researchInterests: "Research Interests",
        certifications: "Certifications",
        contact: "Contact"
      },
      links: {
        email: "Email",
        github: "GitHub",
        linkedin: "LinkedIn"
      },
      fallbackSummary:
        "ITU engineering student working on forecasting, computer vision, optimization, speech processing, and Flutter projects."
    },
    projectCard: {
      featured: "Featured",
      caseStudy: "Case study",
      source: "Source"
    },
    caseStudy: {
      problem: "Problem",
      challenge: "Challenge",
      architectureEyebrow: "Architecture",
      architectureTitle: "How the pieces fit together.",
      datasetInputs: "Dataset / Inputs",
      technicalDecisions: "Technical Decisions",
      implementationDetails: "Implementation Details",
      metricsResults: "Metrics / Results",
      lessonsLearned: "Lessons Learned",
      futureImprovements: "Future Improvements",
      demo: "Demo"
    }
  },
  tr: {
    navbar: {
      brandHomeAria: "Mehmet Ünlü ana sayfa",
      toggleThemeAria: "Tema değiştir",
      openMenuAria: "Gezinme menüsünü aç",
      switchLanguageAria: "Dili değiştir",
      languageSwitchLabel: "EN"
    },
    footer: {
      githubAria: "GitHub",
      linkedinAria: "LinkedIn",
      emailAria: "E-posta"
    },
    hero: {
      badge: "İTÜ Elektronik ve Haberleşme Mühendisliği",
      heading: "Tahminleme, bilgisayarlı görü ve yavaş veri kodunu daha akıcı hale getirmek.",
      introPrimary:
        "Uygulamalı projeler ve erken aşama ürün denemeleriyle tahminleme, bilgisayarlı görü ve veri odaklı sistemler geliştiriyorum.",
      introSecondary:
        "Modelin tek başına yeterli olmadığı problemleri seviyorum: düzensiz veri, doğrulama stratejisi, süre kısıtları ve deneyi kullanılabilir hale getiren mühendislik kararları.",
      actions: {
        projects: "Projeleri Gör",
        downloadCv: "CV'yi İndir",
        github: "GitHub",
        linkedin: "LinkedIn",
        contact: "İletişim"
      },
      workbench: {
        cardTitle: "Seçili vaka analizi",
        location: "İstanbul / İTÜ",
        title: "Tahminleme, bilgisayarlı görü ve performans odaklı veri mühendisliği.",
        description:
          "Buradaki projeler gerçek kısıtlardan doğuyor: sıfır ağırlıklı talep serileri, hassas hareket tahmini isteyen drone görüntüleri ve iterasyonu destekleyecek kadar hızlı olması gereken veri hatları.",
        buildNotesTitle: "Geliştirme notları",
        notes: [
          "Doğrulamayı, ürünün gerçek çalışma koşullarına mümkün olduğunca yakın kur.",
          "Sadece modeli değil; süre, bellek kullanımı, veri sızıntısı ve hata senaryolarını da ölç.",
          "Ödünleşimleri görünür kılmak için projeleri vaka analizi formatında yaz."
        ],
        defaultMetrics: [
          { label: "Ürün", value: "20K+", context: "Seyrek günlük seri" },
          { label: "Satır", value: "3M+", context: "Özellik iş yükü" },
          { label: "Süre", value: "40dk -> 4dk", context: "Veri hattı optimizasyonu" },
          { label: "Drone video", value: "7.5 FPS", context: "Visual odometry denemeleri" }
        ]
      }
    },
    home: {
      workOn: {
        eyebrow: "Odak Alanlarım",
        title: "Gerçek veriyle karşılaşınca ayakta kalan modellere odaklanıyorum.",
        description:
          "Çoğu işim zor bir kısıtla başlıyor: sıfır ağırlıklı hedefler, yavaş özellik üretimi, gürültülü hareket verisi veya dikkatle kurgulanması gereken doğrulama planları.",
        systems: [
          {
            title: "Tahminleme",
            description: "Seyrek talep, kayan pencere doğrulama ve geleceğe bakmadan özyinelemeli tahmin."
          },
          {
            title: "Doğrulama",
            description: "Skora güvenmeden önce kurulumun adil ve gerçekçi olup olmadığını test etme."
          },
          {
            title: "Hız",
            description: "Yavaş döngüleri ve tekrar eden işleri daha temiz, daha hızlı veri dönüşümleriyle sadeleştirme."
          },
          {
            title: "Veri Hatları",
            description: "Projeyi uçtan uca kullanılabilir tutan backend ve veri akışı tasarımları."
          },
          {
            title: "Deneyler",
            description: "Bilgisayarlı görü, konuşma işleme ve mobil fikirlerin çalışan prototipleri."
          }
        ]
      },
      selectedWork: {
        eyebrow: "Seçili Çalışmalar",
        title: "Ödünleşimleri açık bırakan proje anlatımları.",
        description:
          "Her vaka analizi; problemi, denenen yaklaşımı, ölçümleri ve kısıtların uygulamayı nasıl şekillendirdiğini anlatır.",
        allProjects: "Tüm projeler",
        empty: "Öne çıkan projeleri görmek için backend'i çalıştırıp veritabanını seed et."
      },
      tools: {
        eyebrow: "Araçlar",
        title: "Problemin ihtiyacına göre kullandığım araçlar."
      },
      notes: {
        eyebrow: "Notlar",
        title: "Geliştirme sürecinden kısa notlar.",
        readNotes: "Notları oku",
        empty: "Backend çalıştığında notlar burada görünecek."
      }
    },
    about: {
      metadataTitle: "Hakkında",
      metadataDescription:
        "İTÜ Elektronik ve Haberleşme Mühendisliği öğrencisi Mehmet Ünlü hakkında: tahminleme, bilgisayarlı görü ve pratik ML projeleri.",
      eyebrow: "Hakkında",
      title: "En iyi, test edilebilir sistemler geliştirirken öğreniyorum.",
      description:
        "İstanbul Teknik Üniversitesi Elektronik ve Haberleşme Mühendisliği öğrencisiyim. Çalışmalarım ağırlıklı olarak tahminleme, bilgisayarlı görü, konuşma işleme ve ML süreçlerini daha hızlı ve sürdürülebilir hale getirme üzerine.",
      paragraphs: [
        "İlgimi çeken projelerde zor kısım yalnızca model seçimi olmuyor. Örneğin seyrek talep tahmininde doğrulama kurgusu, sıfır ağırlıklı hedefler, özyinelemeli tahmin ve tahmin anında gerçekten mevcut olacak özellikler kritik hale geliyor.",
        "Bilgisayarlı görü tarafında drone görüntülerinde görsel odometri denemeleri yapıyorum. Ürün tarafında ise Flutter, Firebase ve konuşma/hikaye üretimi akışlarıyla çalıştım. Araştırma ile ürün geliştirme arasında, sonucu ölçülebilir tutan bir çizgi izlemeye çalışıyorum.",
        "Süreç boyunca iz bırakmayı önemsiyorum: ne değişti, ne iyileşti, ne çalışmadı ve bir sonraki adımda neyi farklı yapardım. Bu yüzden projeleri yalnızca görsel ve etiketlerle değil, vaka analizi formatında paylaşıyorum."
      ],
      focusAreasTitle: "Odak Alanları",
      focusAreas: [
        "Seyrek talep tahminleme ve sağlam doğrulama.",
        "Özellik mühendisliği, vektörleştirme ve performans iyileştirmesi.",
        "Hareket ve algı üzerine bilgisayarlı görü deneyleri.",
        "Konuşma işleme, altyazı ve pratik NLP akışları.",
        "Flutter ve Firebase ile mobil ürün prototipleri."
      ]
    },
    projects: {
      metadataTitle: "Projeler",
      metadataDescription:
        "Mehmet Ünlü projeleri: tahminleme, veri hattı optimizasyonu, görsel odometri, konuşma işleme ve Flutter ürün çalışmaları.",
      eyebrow: "Projeler",
      title: "Vaka analizi formatında seçili çalışmalar.",
      description:
        "Bunlar sadece kartlar değil. Her proje bağlamı, teknik tercihleri, ölçümleri ve hala geliştirilmesi gereken kısımları anlatır.",
      empty: "Henüz proje yok. Backend'i çalıştırıp Prisma seed komutunu çalıştır."
    },
    notes: {
      metadataTitle: "Notlar",
      metadataDescription:
        "Mehmet Ünlü'den AI, ML, tahminleme, bilgisayarlı görü ve sistemler üzerine teknik notlar, ders notları, görsel anlatımlar ve özet kartları.",
      eyebrow: "Notlar",
      title: "Teknik notlar, çizimler ve geliştirme yazıları.",
      description:
        "Blog tarzı geliştirme notları, AI ders notları, görsel anlatımlar ve kısa özet kartları için düzenli bir arşiv.",
      empty: "Henüz not yok. Backend'i çalıştırıp veritabanını seed et.",
      fallbackDetailTitle: "Not"
    },
    contact: {
      metadataTitle: "İletişim",
      metadataDescription:
        "Tahminleme, bilgisayarlı görü, ML projeleri veya iş birliği için Mehmet Ünlü ile iletişime geçin.",
      eyebrow: "İletişim",
      title: "Proje, soru veya iş birliği fikrin mi var?",
      description: "Buradan doğrudan mesaj atabilir; e-posta, GitHub veya LinkedIn üzerinden ulaşabilirsin.",
      email: "E-posta",
      github: "GitHub",
      linkedin: "LinkedIn"
    },
    contactForm: {
      name: "İsim",
      email: "E-posta",
      subject: "Konu",
      message: "Mesaj",
      nameRequired: "İsim zorunludur.",
      invalidEmail: "Geçerli bir e-posta adresi gir.",
      minMessage: "Mesaj en az 10 karakter olmalı.",
      sendError: "Mesaj gönderilemedi.",
      idleText: "Mesajı gördükten sonra genelde e-posta ile dönüş yapıyorum.",
      send: "Mesaj gönder"
    },
    resume: {
      metadataTitle: "CV",
      metadataDescription:
        "Mehmet Ünlü CV: tahminleme, bilgisayarlı görü, optimizasyon, konuşma işleme ve Flutter projeleri üzerinde çalışan İTÜ öğrencisi.",
      eyebrow: "CV",
      title: "CV ve proje geçmişi.",
      downloadPdf: "PDF İndir",
      emptyExperience: "Deneyim kayıtları backend API'den yüklenecek.",
      sectionTitles: {
        experience: "Deneyim",
        projects: "Projeler",
        education: "Eğitim",
        skills: "Yetenekler",
        tools: "Araçlar",
        researchInterests: "Araştırma Alanları",
        certifications: "Sertifikalar",
        contact: "İletişim"
      },
      links: {
        email: "E-posta",
        github: "GitHub",
        linkedin: "LinkedIn"
      },
      fallbackSummary:
        "Tahminleme, bilgisayarlı görü, optimizasyon, konuşma işleme ve Flutter projeleri üzerinde çalışan İTÜ öğrencisi."
    },
    projectCard: {
      featured: "Öne Çıkan",
      caseStudy: "Vaka analizi",
      source: "Kaynak"
    },
    caseStudy: {
      problem: "Problem",
      challenge: "Zorluk",
      architectureEyebrow: "Mimari",
      architectureTitle: "Parçalar nasıl bir araya geliyor?",
      datasetInputs: "Veri Seti / Girdiler",
      technicalDecisions: "Teknik Kararlar",
      implementationDetails: "Uygulama Detayları",
      metricsResults: "Metrikler / Sonuçlar",
      lessonsLearned: "Çıkarımlar",
      futureImprovements: "Gelecek İyileştirmeler",
      demo: "Demo"
    }
  }
};

export function getUiCopy(locale: Locale) {
  return uiCopy[locale];
}
