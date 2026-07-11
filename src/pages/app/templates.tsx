import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCategories, getTemplates, type Category, type Template } from '@/lib/apiClient';

export default function AppTemplates() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') ?? '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => {
        console.error('Failed to load categories', err);
        setError(t('common.error', 'Ошибка загрузки категорий'));
      });
  }, [t]);

  useEffect(() => {
    setLoading(true);
    getTemplates(activeCategory || undefined)
      .then(setTemplates)
      .catch((err) => {
        console.error('Failed to load templates', err);
        setError(t('common.error', 'Ошибка загрузки шаблонов'));
      })
      .finally(() => setLoading(false));
  }, [activeCategory, t]);

  const handleCategoryClick = (slug: string) => {
    if (slug === activeCategory) {
      setSearchParams({});
    } else {
      setSearchParams({ category: slug });
    }
  };

  const handleSelectTemplate = (templateId: number) => {
    // Navigate to create event form with selected template
    navigate(`/app/events/new?templateId=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-background-100 pb-16">
      {/* App Header */}
      <header className="bg-white border-b border-background-200 py-4 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-accent-700 font-heading">Toyga.kz</span>
            <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded font-semibold uppercase">
              {t('nav.profile', 'Кабинет')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/app/events')}
              className="text-sm font-semibold text-foreground-700 hover:text-accent-600 transition-colors"
            >
              {t('nav.events', 'Мои события')}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              {t('nav.logout', 'Выйти')}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="bg-white py-8 border-b border-background-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground-900 font-heading mb-2">
            {t('home.steps.step1', 'Выберите дизайн')}
          </h1>
          <p className="text-foreground-500 max-w-xl mx-auto text-sm sm:text-base">
            {t('home.steps.step1.desc', 'Выберите один из понравившихся дизайнов в нашем каталоге.')}
          </p>
        </div>
      </section>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Categories Horizontal Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          <button
            onClick={() => setSearchParams({})}
            className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              !activeCategory
                ? 'bg-accent-500 text-white shadow-sm'
                : 'bg-white text-foreground-700 border border-background-200 hover:bg-background-50'
            }`}
          >
            {t('home.tabs.all', 'Все')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeCategory === cat.slug
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'bg-white text-foreground-700 border border-background-200 hover:bg-background-50'
              }`}
            >
              {cat.title_kk}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-background-200 animate-pulse">
                <div className="w-full aspect-[4/5] bg-background-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-background-200 rounded w-3/4" />
                  <div className="h-4 bg-background-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-16 bg-white border border-background-200 rounded-2xl mt-6">
            <p className="text-foreground-500 text-base">{t('home.templates.empty', 'В этой категории шаблонов нет')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl overflow-hidden border border-background-200 hover:shadow-lg transition-shadow flex flex-col group"
              >
                {/* Image Wrap */}
                <div className="relative aspect-[4/5] bg-background-100 overflow-hidden">
                  <img
                    src={tpl.preview_image_url || '/placeholder.jpg'}
                    alt={tpl.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {tpl.is_free && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                      {t('common.free', 'Тегін')}
                    </span>
                  )}
                  {tpl.price > 0 && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-accent-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                      {tpl.price} ₸
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-4">
                  <div>
                    <h3 className="font-bold text-foreground-900 leading-snug text-sm group-hover:text-accent-600 transition-colors">
                      {tpl.title}
                    </h3>
                    <p className="text-[11px] text-foreground-400 mt-1 uppercase tracking-wider font-semibold">
                      {tpl.category_title || t('common.template', 'Шаблон')}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className="w-full py-2.5 rounded-xl bg-accent-500 text-white text-xs font-bold hover:bg-accent-600 transition-colors"
                  >
                    {t('home.hero.cta', 'Выбрать дизайн')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
