export const WHATSAPP_NUMBER = "77066403655";

export interface Category {
    id: number;
    slug: string;
    title: string;
    image: string;
    sort_order: number;
}

export interface Template {
    id: number;
    category_slug: string;
    title: string;
    description: string;
    price: string;
    extra_price: string;
    whatsapp_text: string;
    preview_image_url: string;
    is_free: boolean;
}

export interface BlogArticle {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    image: string;
}

export const invitationCategories: Category[] = [
    {
        id: 1,
        slug: "uylen-toy",
        title: "Үйлену той",
        sort_order: 1,
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=200&fit=crop",
    },
    {
        id: 2,
        slug: "kyz-uzatu",
        title: "Қыз ұзату",
        sort_order: 2,
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=200&fit=crop",
    },
    {
        id: 3,
        slug: "sundet-toy",
        title: "Сүндет той",
        sort_order: 3,
        image: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&h=200&fit=crop",
    },
    {
        id: 4,
        slug: "tusaukesar",
        title: "Тұсаукесер",
        sort_order: 4,
        image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=200&fit=crop",
    },
    {
        id: 5,
        slug: "merey-toy",
        title: "Мерей той",
        sort_order: 5,
        image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=200&fit=crop",
    },
    {
        id: 6,
        slug: "besik-toy",
        title: "Бесік той",
        sort_order: 6,
        image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=200&fit=crop",
    },
    {
        id: 7,
        slug: "merey-sundet",
        title: "Мерей той + Сүндет той",
        sort_order: 7,
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=200&fit=crop",
    },
    {
        id: 8,
        slug: "uylen-besik",
        title: "Үйлену той + Бесік той",
        sort_order: 8,
        image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=200&fit=crop",
    },
    {
        id: 9,
        slug: "sundet-tusaukesar",
        title: "Сүндет той + Тұсаукесер",
        sort_order: 9,
        image: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&h=200&fit=crop",
    },
];

export const photoTemplates: Template[] = [
    {
        id: 1,
        category_slug: "uylen-toy",
        title: "Алтын үйлену шақыру",
        description: "Классикалық алтын дизайнда жасалған керемет үйлену той шақыруы",
        price: "800 ₸",
        extra_price: "+ 400 ₸ жаңарту",
        whatsapp_text: "Сәлеметсіз бе! Алтын үйлену шақыру үлгісіне тапсырыс бергім келеді.",
        preview_image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop",
        is_free: false,
    },
    {
        id: 2,
        category_slug: "uylen-toy",
        title: "Раушан гүлді шақыру",
        description: "Нежный гүл суреттерімен безендірілген романтикалық шақыру",
        price: "Тегін",
        extra_price: "+ 400 ₸ жаңарту",
        whatsapp_text: "Сәлеметсіз бе! Раушан гүлді шақыру үлгісіне тапсырыс бергім келеді.",
        preview_image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=500&fit=crop",
        is_free: true,
    },
    {
        id: 3,
        category_slug: "kyz-uzatu",
        title: "Қыз ұзату классик",
        description: "Ұлттық өрнектерімен безендірілген керемет қыз ұзату шақыруы",
        price: "800 ₸",
        extra_price: "+ 400 ₸ жаңарту",
        whatsapp_text: "Сәлеметсіз бе! Қыз ұзату классик үлгісіне тапсырыс бергім келеді.",
        preview_image_url: "https://images.unsplash.com/photo-1596003906949-67221c37965c?w=400&h=500&fit=crop",
        is_free: false,
    },
    {
        id: 4,
        category_slug: "sundet-toy",
        title: "Сүндет той — Аспан",
        description: "Аспан көк түстерімен безендірілген ерекше сүндет той шақыруы",
        price: "800 ₸",
        extra_price: "+ 400 ₸ жаңарту",
        whatsapp_text: "Сәлеметсіз бе! Сүндет той Аспан үлгісіне тапсырыс бергім келеді.",
        preview_image_url: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400&h=500&fit=crop",
        is_free: false,
    },
    {
        id: 5,
        category_slug: "tusaukesar",
        title: "Тұсаукесер — Бақыт",
        description: "Балапандарға арналған жарқын және шапшаң дизайнды шақыру",
        price: "Тегін",
        extra_price: "+ 400 ₸ жаңарту",
        whatsapp_text: "Сәлеметсіз бе! Тұсаукесер Бақыт үлгісіне тапсырыс бергім келеді.",
        preview_image_url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=500&fit=crop",
        is_free: true,
    },
    {
        id: 6,
        category_slug: "merey-toy",
        title: "Мерей той — Алтын жыл",
        description: "Ерекше мерей тойға арналған сәулетті және элегантты шақыру",
        price: "1200 ₸",
        extra_price: "+ 400 ₸ жаңарту",
        whatsapp_text: "Сәлеметсіз бе! Мерей той Алтын жыл үлгісіне тапсырыс бергім келеді.",
        preview_image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=500&fit=crop",
        is_free: false,
    },
];

export const blogArticles: BlogArticle[] = [
    {
        id: 1,
        slug: "kazak-toy-dasturleri",
        title: "Қазақтың үйлену той дәстүрлері",
        excerpt: "Қазақ халқының ғасырлар бойы қалыптасқан той дәстүрлері мен салт-жоралғылары туралы.",
        date: "2026-07-01",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
    },
    {
        id: 2,
        slug: "online-shaqyru-artyqshylyqtary",
        title: "Онлайн шақырудың артықшылықтары",
        excerpt: "Неге қазіргі заманда онлайн той шақыруларды таңдайды? Артықшылықтары мен ерекшеліктері.",
        date: "2026-07-05",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    },
    {
        id: 3,
        slug: "toy-bezendiru-ideyalary",
        title: "2026 жылғы той безендіру идеялары",
        excerpt: "Сәнді және заманауи той безендіру идеялары. Қонақтарыңызды таң қалдырыңыз!",
        date: "2026-07-08",
        image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop",
    },
];