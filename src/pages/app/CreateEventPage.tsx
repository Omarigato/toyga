import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createEvent, getTemplateById } from '@/lib/apiClient';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft, Sparkles } from 'lucide-react';

const eventTypes = [
  'Үйлену той',
  'Қыз ұзату',
  'Сүндет той',
  'Тұсаукесер',
  'Мерей той',
  'Бесік той',
];

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateIdParam = searchParams.get('templateId');
  const templateId = templateIdParam ? parseInt(templateIdParam) : undefined;

  const [templateName, setTemplateName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('Үйлену той');
  const [eventDate, setEventDate] = useState('');
  const [addressText, setAddressText] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [mapLink, setMapLink] = useState('');

  // Auto-slugify title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const slugified = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // collapse duplicate hyphens
    setSlug(slugified);
  };

  useEffect(() => {
    if (templateId) {
      getTemplateById(templateId)
        .then((tpl) => setTemplateName(tpl.title))
        .catch((err) => console.error('Failed to load template info:', err));
    }
  }, [templateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !eventDate || !addressText) {
      toast('Міндетті өрістерді толтырыңыз', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        template_id: templateId,
        title,
        slug,
        type,
        event_date: new Date(eventDate).toISOString(),
        address: {
          address_text: addressText,
          place_name: placeName || null,
          map_link: mapLink || null,
        },
      };

      const event = await createEvent(payload);
      toast('Шақыру жобасы сәтті жасалды!', 'success');
      navigate(`/app/events/${event.id}`);
    } catch (err: any) {
      toast(err.message || 'Қате кетті. Тағы да көріңіз.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-100 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-background-200 py-4 px-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground-700 hover:text-accent-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Артқа қайту</span>
          </button>
          <span className="text-base font-bold text-foreground-900 font-heading">Жаңа шақыру</span>
        </div>
      </header>

      {/* Main card */}
      <main className="max-w-3xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl border border-background-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 bg-accent-50/50 border border-accent-100 p-4 rounded-xl">
            <Sparkles className="w-5 h-5 text-accent-600 animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-semibold text-accent-700 uppercase tracking-wider">Таңдалған дизайн</p>
              <h3 className="text-sm font-bold text-foreground-900">{templateName || 'Жүктелуде...'}</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Шақыру тақырыбы *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Мысалы: Асхат пен Аружанның үйлену тойы"
                className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 focus:ring-2 focus:ring-accent-500 outline-none text-sm font-medium"
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Сілтеме (URL) *</label>
              <div className="flex items-center">
                <span className="h-11 px-3 bg-background-100 border border-r-0 border-background-300 rounded-l-xl text-xs flex items-center font-mono text-foreground-500">
                  /toi/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="askhat-aruzhan"
                  className="flex-1 h-11 px-4 rounded-r-xl border border-background-300 bg-background-50 focus:ring-2 focus:ring-accent-500 outline-none text-sm font-medium font-mono"
                />
              </div>
              <p className="text-[10px] text-foreground-500">Сілтеме тек кіші латын әріптері мен дефистен тұруы тиіс</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Event Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Той түрі *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 focus:ring-2 focus:ring-accent-500 outline-none text-sm font-medium"
                >
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Тойдың күні *</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 focus:ring-2 focus:ring-accent-500 outline-none text-sm font-medium"
                />
              </div>
            </div>

            <hr className="border-background-200 my-2" />

            <h3 className="text-sm font-bold text-foreground-900 font-heading">Өтетін орны</h3>

            {/* Place Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Мейрамхана атауы</label>
              <input
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Мысалы: «Салтанат Сарайы»"
                className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 focus:ring-2 focus:ring-accent-500 outline-none text-sm font-medium"
              />
            </div>

            {/* Address text */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Толық мекенжайы *</label>
              <input
                type="text"
                required
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                placeholder="Мысалы: Алматы қ., Достық даңғылы, 10"
                className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 focus:ring-2 focus:ring-accent-500 outline-none text-sm font-medium"
              />
            </div>

            {/* Map Link */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Карта сілтемесі (2GIS немесе Google Maps)</label>
              <input
                type="url"
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
                placeholder="https://2gis.kz/almaty/geo/..."
                className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 focus:ring-2 focus:ring-accent-500 outline-none text-sm font-medium"
              />
            </div>

            <Button
              type="submit"
              loading={submitting}
              className="w-full h-12 flex items-center justify-center font-bold text-sm text-foreground-950 mt-4"
            >
              Шақыруды жасау
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
