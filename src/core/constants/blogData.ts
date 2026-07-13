export interface BlogArticle {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    image: string;
}

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
