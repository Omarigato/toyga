import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
export default function Suret() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex items-center justify-center py-20">
                <div className="text-center px-4">
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-accent-100">
                        <i className="ri-image-line text-2xl text-accent-600" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground-900 font-heading mb-3">
                        Сурет шақырулар
                    </h1>
                    <p className="text-foreground-600 max-w-md mx-auto mb-6">
                        Бұл бетте барлық сурет шақыру үлгілері көрсетіледі. Жақын арада толық мәліметтер қосылады.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 text-background-50 font-medium hover:bg-primary-600 transition-colors"
                    >
                        Басты бетке оралу
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}