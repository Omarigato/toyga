import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroSection from './components/HeroSection';
import CategoriesSection from './components/CategoriesSection';
import PhotoTemplatesSection from './components/PhotoTemplatesSection';
import BlogPreviewSection from './components/BlogPreviewSection';
export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                <HeroSection />
                <CategoriesSection />
                <PhotoTemplatesSection />
                <BlogPreviewSection />
            </main>
            <Footer />
        </div>
    );
}