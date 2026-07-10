import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!supabase) {
            setError('Supabase конфигурациясы жоқ. .env файлын тексеріңіз.');
            setLoading(false);
            return;
        }

        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);

        if (authError) {
            setError('Email немесе пароль қате. Қайта тырысыңыз.');
        } else {
            navigate('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-background-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-2xl bg-accent-500 flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-accent-700 font-heading">Toyga.kz</span>
                    </Link>
                    <h1 className="text-lg font-medium text-foreground-700 mt-3">Админ панелі</h1>
                </div>

                <div className="bg-background-50 rounded-2xl border border-background-200 p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-background-200 bg-white text-foreground-900 focus:outline-none focus:border-accent-400 transition-colors"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground-700 mb-1.5">Пароль</label>
                            <input
                                type="password"
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-background-200 bg-white text-foreground-900 focus:outline-none focus:border-accent-400 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-colors disabled:opacity-60"
                        >
                            {loading ? 'Кіруде...' : 'Кіру'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
