import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUserEvents, userLogout } from '@/lib/apiClient';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Calendar, Eye, FileText, Globe, LogOut, Plus, Settings } from 'lucide-react';

export default function EventsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserEvents()
      .then(setEvents)
      .catch((err) => console.error('Failed to load events', err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await userLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background-100 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-background-200 py-4 px-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-accent-700 font-heading">Toyga.kz</span>
            <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded font-semibold uppercase">
              {t('nav.profile', 'Кабинет')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('nav.logout', 'Шығу')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground-900 font-heading">Менің шақыруларым</h1>
            <p className="text-xs sm:text-sm text-foreground-500 mt-1">Той шақыруларын басқару, қонақтар тізімін толтыру және мәртебесін бақылау</p>
          </div>
          <Button
            onClick={() => navigate('/app/templates')}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5 text-foreground-950" />
            <span>Жаңа шақыру жасау</span>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-background-200 animate-pulse space-y-4">
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white border border-background-200 rounded-2xl shadow-sm">
            <FileText className="w-12 h-12 text-foreground-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground-900 mb-1">Шақырулар әлі жасалмаған</h3>
            <p className="text-sm text-foreground-500 mb-6 max-w-sm mx-auto">
              Бірінші шақыруды жасау үшін төмендегі батырманы басып, дизайнды таңдаңыз.
            </p>
            <Button onClick={() => navigate('/app/templates')}>
              Дизайн таңдау
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-background-200 hover:shadow-lg transition-all duration-300 flex flex-col p-6 relative group overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-accent-500" />
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    event.status === 'published' ? 'bg-green-550/10 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {event.status === 'published' ? 'Жарияланған' : 'Жоба'}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-xs text-foreground-500">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{event.view_count || 0} қаралды</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground-900 font-heading mb-2 leading-snug group-hover:text-primary-600 transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-xs text-foreground-600">
                    <Calendar className="w-4 h-4 text-accent-600" />
                    <span>{new Date(event.event_date).toLocaleDateString('kk-KZ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground-600">
                    <Globe className="w-4 h-4 text-accent-600" />
                    <span className="font-mono text-[11px] truncate max-w-[200px]">/toi/{event.slug}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => navigate(`/app/events/${event.id}`)}
                  >
                    <Settings className="w-4 h-4" />
                    Басқару
                  </Button>
                  
                  {event.status === 'published' && (
                    <a
                      href={`/toi/${event.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl border border-accent-300 hover:bg-accent-50 text-accent-700 hover:text-accent-800 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      Көру
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
