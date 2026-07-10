import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
const musicList = [
    { title: "Қазақтың ұлттық әндері", artist: "Традиционалды" },
    { title: "Сүйікті той әндері", artist: "Топ жинағы" },
    { title: "Заманауи қазақ музыкасы", artist: "Жинақ" },
    { title: "Тойға арналған үздік тректер", artist: "2026 жинақ" },
    { title: "Ұлттық аспаптар мен сазы", artist: "Күйлер жинағы" },
    { title: "Той кешінің классикалық музыкасы", artist: "Оркестр" },
];
export default function Musics() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <div className="w-full px-4 md:px-6 lg:px-8 py-12 md:py-16 max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground-900 font-heading mb-4 text-center">
                        Әндер
                    </h1>
                    <p className="text-foreground-600 text-center max-w-xl mx-auto mb-10 md:mb-12">
                        Тойыңыз үшін ұлттық және заманауи қазақ әндерінің үздік жинақтары
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        {musicList.map((music, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-4 md:p-5 rounded-xl bg-background-50 border border-background-200/70 hover:border-accent-300/60 transition-all duration-300"
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent-100 shrink-0">
                                    <i className="ri-music-2-line text-lg text-accent-600" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base font-semibold text-foreground-900 font-heading truncate">
                                        {music.title}
                                    </h3>
                                    <p className="text-sm text-foreground-500">{music.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-10 md:mt-12">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 text-background-50 font-medium hover:bg-primary-600 transition-colors"
                        >
                            Басты бетке оралу
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}