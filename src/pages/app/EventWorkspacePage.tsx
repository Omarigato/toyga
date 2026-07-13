import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getEventById,
  updateEvent,
  getInvitationLayout,
  saveInvitationLayout,
  getEventGuests,
  addEventGuest,
  importEventGuests,
  deleteGuestContact,
  getEventMedia,
  addEventMedia,
  deleteEventMedia,
  createOrder,
} from '@/lib/apiClient';
import { CanvasEditor } from '@/features/editor/CanvasEditor';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  ArrowLeft,
  Settings,
  Users,
  Image as ImageIcon,
  CreditCard,
  Layers,
  Copy,
  Trash2,
  Upload,
  UserPlus,
  QrCode,
  CheckCircle,
} from 'lucide-react';

const eventTypes = ['Үйлену той', 'Қыз ұзату', 'Сүндет той', 'Тұсаукесер', 'Мерей той', 'Бесік той'];

type TabType = 'editor' | 'info' | 'guests' | 'media' | 'payment';

export default function EventWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = parseInt(id || '0');

  const [activeTab, setActiveTab] = useState<TabType>('editor');
  const [event, setEvent] = useState<any>(null);
  const [invitationLayout, setInvitationLayout] = useState<any>(null);
  const [guests, setGuests] = useState<any[]>([]);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isSavingLayout, setIsSavingLayout] = useState(false);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const { toast } = useToast();

  // Detail Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [addressText, setAddressText] = useState('');
  const [mapLink, setMapLink] = useState('');

  // Guest Form States
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestGreeting, setGuestGreeting] = useState('');
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  
  // Guest Import States
  const [excelPasteText, setExcelPasteText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Media States
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Payment Form States
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [isRequestingPayment, setIsRequestingPayment] = useState(false);

  // Load everything
  useEffect(() => {
    if (!eventId) return;

    const loadWorkspace = async () => {
      try {
        const [eventData, layoutData, guestsData, mediaData] = await Promise.all([
          getEventById(eventId),
          getInvitationLayout(eventId),
          getEventGuests(eventId),
          getEventMedia(eventId),
        ]);

        setEvent(eventData);
        setTitle(eventData.title || '');
        setSlug(eventData.slug || '');
        setType(eventData.type || '');
        setEventDate(eventData.event_date ? eventData.event_date.split('T')[0] : '');
        setPlaceName(eventData.place_name || '');
        setAddressText(eventData.address_text || '');
        setMapLink(eventData.map_link || '');

        // If content field does not exist, initialize a blank layout
        setInvitationLayout(layoutData.content || {
          background: eventData.template_preview_img || '#fbfbfb',
          objects: [
            { id: 'title', type: 'text', text: eventData.title, left: 50, top: 120, fontSize: 28, fontFamily: 'Cormorant Garamond', fill: '#cfa658', editable: true }
          ]
        });

        setGuests(guestsData);
        setMediaItems(mediaData);
      } catch (err: any) {
        console.error('Failed to load workspace data:', err);
        toast('Workspace-ті жүктеу кезінде қате кетті', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadWorkspace();
  }, [eventId]);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInfo(true);
    try {
      const updated = await updateEvent(eventId, {
        title,
        slug,
        type,
        eventDate: new Date(eventDate).toISOString(),
        address: {
          address_text: addressText,
          place_name: placeName || null,
          map_link: mapLink || null,
        },
      });
      setEvent(updated);
      toast('Ақпарат сәтті жаңартылды!', 'success');
    } catch (err: any) {
      toast(err.message || 'Жаңарту кезінде қате кетті', 'error');
    } finally {
      setIsSavingInfo(false);
    }
  };

  const handleSaveLayout = async (content: any, dataUrl?: string) => {
    setIsSavingLayout(true);
    try {
      await saveInvitationLayout(eventId, {
        content,
        rendered_image_data: dataUrl,
      });
      toast('Дизайн сәтті сақталды!', 'success');
    } catch (err: any) {
      toast('Дизайнды сақтау кезінде қате кетті', 'error');
      throw err;
    } finally {
      setIsSavingLayout(false);
    }
  };

  const handleAddSingleGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) return;

    setIsAddingGuest(true);
    try {
      const added = await addEventGuest(eventId, {
        full_name: guestName,
        phone: guestPhone.trim(),
        greeting_text: guestGreeting || undefined,
      });
      setGuests((prev) => [added, ...prev]);
      setGuestName('');
      setGuestPhone('');
      setGuestGreeting('');
      toast('Қонақ сәтті қосылды!', 'success');
    } catch (err: any) {
      toast(err.message || 'Қонақты қосу кезiнде қате кетті', 'error');
    } finally {
      setIsAddingGuest(false);
    }
  };

  const handleExcelImport = async () => {
    if (!excelPasteText.trim()) return;

    setIsImporting(true);
    try {
      const lines = excelPasteText.split('\n');
      const listToImport: any[] = [];

      for (const line of lines) {
        if (!line.trim()) continue;
        
        // Split by tabs (copy from Excel) or commas
        const parts = line.includes('\t') ? line.split('\t') : line.split(',');
        const full_name = parts[0]?.trim();
        const phone = parts[1]?.trim() || '';
        const greeting_text = parts[2]?.trim() || '';

        if (full_name) {
          listToImport.push({
            full_name,
            phone: phone || '77770000000',
            greeting_text: greeting_text || null,
          });
        }
      }

      if (listToImport.length === 0) {
        toast('Деректер табылған жоқ. Үлгіге сәйкес енгізіңіз.', 'error');
        setIsImporting(false);
        return;
      }

      const imported = await importEventGuests(eventId, listToImport);
      setGuests((prev) => [...imported, ...prev]);
      setExcelPasteText('');
      setShowImportArea(false);
      toast(`${imported.length} қонақ сәтті импортталды!`, 'success');
    } catch (err: any) {
      toast(err.message || 'Импорттау кезінде қате кетті', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteGuest = async (guestId: number) => {
    if (!window.confirm('Бұл қонақты өшіруді растайсыз ба?')) return;

    try {
      await deleteGuestContact(guestId);
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
      toast('Қонақ өшірілді', 'success');
    } catch {
      toast('Қонақты өшіру кезінде қате кетті', 'error');
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', file.type.startsWith('video/') ? 'client/videos' : 'client/photos');
    formData.append('event_id', eventId.toString());

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const uploadResult = await res.json();

      const added = await addEventMedia(eventId, {
        url: uploadResult.url,
        type: file.type.startsWith('video/') ? 'video' : 'image',
      });

      setMediaItems((prev) => [...prev, added]);
      toast('Медиа сәтті жүктелді!', 'success');
    } catch (err: any) {
      toast(err.message || 'Жүктеу кезінде қате кетті', 'error');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!window.confirm('Бұл файлды өшіруді растайсыз ба?')) return;

    try {
      await deleteEventMedia(eventId, mediaId);
      setMediaItems((prev) => prev.filter((m) => m.id !== mediaId));
      toast('Файл өшірілді', 'success');
    } catch {
      toast('Медианы өшіру кезінде қате кетті', 'error');
    }
  };

  const handleRequestPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerName || !payerPhone) return;

    setIsRequestingPayment(true);
    try {
      await createOrder({
        template_id: event.template_id,
        invitation_id: eventId,
        client_name: payerName,
        client_phone: payerPhone,
        channel: 'whatsapp',
      });
      toast('Төлемді растау сұранысы жіберілді. Менеджер жақын арада растайды!', 'success');
      setPayerName('');
      setPayerPhone('');
      // Reload event status
      const updatedEvent = await getEventById(eventId);
      setEvent(updatedEvent);
    } catch (err: any) {
      toast(err.message || 'Сұраныс жіберу сәтсіз аяқталды', 'error');
    } finally {
      setIsRequestingPayment(false);
    }
  };

  const copyRSVPLink = (slug: string) => {
    const link = `${window.location.origin}/toi/${event.slug}?g=${slug}`;
    navigator.clipboard.writeText(link);
    toast('Жеке шақыру сілтемесі көшірілді!', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-100 flex flex-col items-center justify-center gap-4">
        <Skeleton className="h-10 w-48 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-100 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-background-200 py-4 px-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/app/events')}
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground-700 hover:text-accent-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Кабинетке қайту</span>
          </button>
          <span className="text-sm font-bold text-foreground-900 font-heading truncate max-w-[200px] sm:max-w-none">
            {event.title}
          </span>
        </div>
      </header>

      {/* Main container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* Workspace tabs bar */}
        <div className="flex bg-white p-1 rounded-xl border border-background-200 overflow-x-auto gap-1 mb-8 shadow-sm scrollbar-none">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'editor' ? 'bg-accent-500 text-foreground-950 shadow-sm' : 'text-foreground-700 hover:bg-background-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            Редактор
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'info' ? 'bg-accent-500 text-foreground-950 shadow-sm' : 'text-foreground-700 hover:bg-background-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            Ақпарат
          </button>
          <button
            onClick={() => setActiveTab('guests')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'guests' ? 'bg-accent-500 text-foreground-950 shadow-sm' : 'text-foreground-700 hover:bg-background-50'
            }`}
          >
            <Users className="w-4 h-4" />
            Қонақтар ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'media' ? 'bg-accent-500 text-foreground-950 shadow-sm' : 'text-foreground-700 hover:bg-background-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Медиа ({mediaItems.length})
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'payment' ? 'bg-accent-500 text-foreground-950 shadow-sm' : 'text-foreground-700 hover:bg-background-50'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Оплата
          </button>
        </div>

        {/* Tab contents */}
        <div className="w-full">
          {/* 1. EDITOR */}
          {activeTab === 'editor' && (
            <div className="w-full animate-in fade-in duration-300">
              <CanvasEditor
                initialContent={invitationLayout}
                onSave={handleSaveLayout}
                isSaving={isSavingLayout}
              />
            </div>
          )}

          {/* 2. INFORMATION FORM */}
          {activeTab === 'info' && (
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-background-200 shadow-sm animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-foreground-900 font-heading mb-6">Шақыру мәліметтері</h2>
              <form onSubmit={handleSaveInfo} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Шақыру тақырыбы</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 outline-none text-sm font-medium focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Сілтеме (Slug)</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 outline-none text-sm font-medium font-mono focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Той түрі</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 outline-none text-sm font-medium focus:ring-2 focus:ring-accent-500"
                    >
                      {eventTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Тойдың күні</label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 outline-none text-sm font-medium focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                </div>

                <hr className="border-background-200" />
                <h3 className="text-sm font-bold text-foreground-900 font-heading">Мекенжайы</h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Мейрамхана атауы</label>
                  <input
                    type="text"
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    placeholder="Мысалы: «Салтанат Сарайы»"
                    className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 outline-none text-sm font-medium focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Толық мекенжайы</label>
                  <input
                    type="text"
                    required
                    value={addressText}
                    onChange={(e) => setAddressText(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 outline-none text-sm font-medium focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-foreground-700 uppercase tracking-wider">Карта сілтемесі</label>
                  <input
                    type="url"
                    value={mapLink}
                    onChange={(e) => setMapLink(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-background-300 bg-background-50 outline-none text-sm font-medium focus:ring-2 focus:ring-accent-500"
                  />
                </div>

                <Button
                  type="submit"
                  loading={isSavingInfo}
                  className="w-full h-12 flex items-center justify-center font-bold text-sm text-foreground-950 mt-4"
                >
                  Ақпаратты сақтау
                </Button>
              </form>
            </div>
          )}

          {/* 3. GUEST LIST MANAGEMENT */}
          {activeTab === 'guests' && (
            <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in duration-300">
              {/* List panel */}
              <div className="flex-1 bg-white p-6 rounded-2xl border border-background-200 shadow-sm w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground-900 font-heading">Қонақтар тізімі</h2>
                    <p className="text-xs text-foreground-500">Қонақтарыңыздың RSVP сілтемелерін көшіріп жіберіңіз</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowImportArea(!showImportArea)}
                    className="text-xs flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Excel-ден импорттау
                  </Button>
                </div>

                {/* Import Area */}
                {showImportArea && (
                  <div className="mb-6 p-5 border border-dashed border-accent-300 bg-accent-50/20 rounded-xl space-y-4">
                    <p className="text-xs text-foreground-600 leading-relaxed">
                      Excel кестесінен қонақтардың <strong>Аты-жөні</strong> және <strong>Телефоны</strong> бағандарын көшіріп алып, төмендегі өріске қойыңыз (Әр қонақ жаңа жолда болу керек):
                    </p>
                    <textarea
                      rows={5}
                      value={excelPasteText}
                      onChange={(e) => setExcelPasteText(e.target.value)}
                      placeholder="Асхат Әлиев&#9;77771234567&#10;Аружан Асанова&#9;77779876543"
                      className="w-full p-3 border border-background-300 rounded-xl bg-white text-xs font-mono outline-none focus:ring-2 focus:ring-accent-500"
                    />
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" size="sm" onClick={() => setShowImportArea(false)}>Күшін жою</Button>
                      <Button size="sm" loading={isImporting} onClick={handleExcelImport}>Импорттау</Button>
                    </div>
                  </div>
                )}

                {guests.length === 0 ? (
                  <div className="text-center py-16 bg-background-50 rounded-xl border border-dashed border-background-300">
                    <Users className="w-10 h-10 text-foreground-450 mx-auto mb-2" />
                    <p className="text-sm text-foreground-500">Қонақтар тізімі әзірге бос</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-background-200 text-xs font-bold text-foreground-500 uppercase tracking-wider">
                          <th className="pb-3">Аты-жөні</th>
                          <th className="pb-3">Телефон</th>
                          <th className="pb-3">Шақыру сілтемесі</th>
                          <th className="pb-3 text-right">Әрекеттер</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-background-100">
                        {guests.map((g) => (
                          <tr key={g.id} className="hover:bg-background-50/50">
                            <td className="py-3 font-semibold text-foreground-900">{g.full_name}</td>
                            <td className="py-3 text-xs text-foreground-600 font-mono">{g.phone}</td>
                            <td className="py-3">
                              <button
                                onClick={() => copyRSVPLink(g.personal_slug)}
                                className="inline-flex items-center gap-1 text-xs text-accent-700 hover:text-accent-800 font-semibold transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                Сілтеме
                              </button>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDeleteGuest(g.id)}
                                className="p-1.5 text-foreground-400 hover:text-red-600 transition-colors"
                                aria-label="Өшіру"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Add form panel */}
              <div className="w-full lg:w-80 bg-white p-6 rounded-2xl border border-background-200 shadow-sm flex flex-col gap-4">
                <h3 className="text-base font-bold text-foreground-900 font-heading flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-accent-500" />
                  <span>Қонақ қосу</span>
                </h3>
                <form onSubmit={handleAddSingleGuest} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-foreground-600">Қонақтың аты *</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Асхат Әлиев"
                      className="w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-foreground-600">Телефон нөмірі *</label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="77771234567"
                      className="w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-foreground-600">Арнайы тілек (мысалы: Құрметті Ақа!)</label>
                    <input
                      type="text"
                      value={guestGreeting}
                      onChange={(e) => setGuestGreeting(e.target.value)}
                      placeholder="Құрметті Асхат!"
                      className="w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-medium"
                    />
                  </div>
                  <Button
                    type="submit"
                    loading={isAddingGuest}
                    className="w-full flex items-center justify-center gap-1.5 font-bold"
                  >
                    <span>Қосу</span>
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* 4. GALLERY MEDIA */}
          {activeTab === 'media' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-background-200 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground-900 font-heading">Галерея суреттері мен видеолары</h2>
                  <p className="text-xs text-foreground-500">Той шақырудың галерея бөлімінде көрсетілетін медиа файлдарды жүктеңіз</p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-400 text-foreground-950 text-xs font-bold transition-all shadow hover:shadow-lg hover:shadow-accent-500/10">
                  <Upload className="w-4 h-4 text-foreground-950" />
                  Файл таңдау
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    disabled={isUploadingMedia}
                    className="hidden"
                  />
                </label>
              </div>

              {isUploadingMedia && (
                <div className="mb-6 p-4 bg-background-50 border border-background-300 rounded-xl flex items-center gap-3">
                  <div className="animate-spin w-5 h-5 rounded-full border-2 border-accent-500 border-t-transparent" />
                  <span className="text-xs font-semibold text-foreground-700">Файл жүктелуде, күте тұрыңыз...</span>
                </div>
              )}

              {mediaItems.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-background-300 rounded-2xl">
                  <ImageIcon className="w-12 h-12 text-foreground-300 mx-auto mb-4" />
                  <h3 className="text-sm font-bold text-foreground-900 mb-1">Медиа файлдар жүктелмеген</h3>
                  <p className="text-xs text-foreground-500 max-w-xs mx-auto">
                    Максимум 20 фотосурет және 3 видео жүктеуге болады
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square rounded-xl border border-background-200 overflow-hidden bg-background-50"
                    >
                      {item.type === 'video' ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt="Галерея файлы"
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {/* Delete button overlay */}
                      <button
                        onClick={() => handleDeleteMedia(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white transition-colors opacity-0 group-hover:opacity-100 shadow"
                        aria-label="Өшіру"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. PAYMENT AND CHECKOUT */}
          {activeTab === 'payment' && (
            <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-background-200 shadow-sm animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-foreground-900 font-heading mb-4">Шақыруды белсендіру</h2>
              
              {event.status === 'published' ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                  <h3 className="text-lg font-bold text-green-800">Шақыру белсенді! 🎉</h3>
                  <p className="text-xs sm:text-sm text-green-700 max-w-sm mx-auto">
                    Төлем сәтті қабылданып, шақыру толығымен жарияланды. Қонақтарыңыз сілтеме арқылы қарай алады.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-5 bg-amber-50 border border-amber-250 rounded-xl space-y-2">
                    <p className="text-sm font-semibold text-amber-800">Жоба мәртебесі: Белсенді емес</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Шақыруды қонақтарға жіберіп, RSVP жауаптарын жинау үшін белсендіру төлемін жасау қажет.
                    </p>
                  </div>

                  <div className="border border-background-200 p-5 rounded-xl space-y-4 bg-background-50/50">
                    <h3 className="text-sm font-bold text-foreground-900 font-heading flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-accent-600" />
                      <span>Kaspi QR немесе Қосымша арқылы төлеу</span>
                    </h3>
                    <p className="text-xs text-foreground-600 leading-relaxed">
                      Қазіргі уақытта Kaspi арқылы төлемдер қол режимінде қабылданады. Менеджердің Kaspi Gold картасына төлеген соң, төмендегі өрісті толтырып «Төлемді растауды сұрау» батырмасын басыңыз.
                    </p>

                    <div className="border-t border-background-200 pt-4 space-y-2 text-xs font-semibold text-foreground-700">
                      <div className="flex justify-between">
                        <span>Төлем сомасы:</span>
                        <span className="text-accent-700 font-bold">1 200 ₸</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Менеджердің Kaspi телефоны:</span>
                        <span className="font-mono text-accent-700 font-bold">+7 777 133 52 50</span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleRequestPayment} className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-foreground-600">Төлеушінің толық аты-жөні *</label>
                      <input
                        type="text"
                        required
                        value={payerName}
                        onChange={(e) => setPayerName(e.target.value)}
                        placeholder="Мысалы: Асхат Әлиев"
                        className="w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-foreground-600">Байланыс телефоны *</label>
                      <input
                        type="tel"
                        required
                        value={payerPhone}
                        onChange={(e) => setPayerPhone(e.target.value)}
                        placeholder="77771234567"
                        className="w-full h-10 px-3 rounded-lg border border-background-300 text-sm font-medium"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      loading={isRequestingPayment}
                      className="w-full flex items-center justify-center gap-1.5 font-bold text-foreground-950"
                    >
                      <span>Төлемді растауды сұрау</span>
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
