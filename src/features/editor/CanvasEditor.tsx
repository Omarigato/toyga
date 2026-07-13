import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Type, Palette, AlignLeft, AlignCenter, AlignRight, Save } from 'lucide-react';

// Decent list of licensed Google Fonts
const GOOGLE_FONTS = [
  'Playfair Display',
  'Cormorant Garamond',
  'Marck Script',
  'Forum',
  'Unbounded',
  'PT Serif',
  'Inter',
];

interface EditorProps {
  initialContent: any;
  onSave: (content: any, renderedImageUrl?: string) => Promise<void>;
  isSaving?: boolean;
}

export function CanvasEditor({ initialContent, onSave, isSaving = false }: EditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Textbox | null>(null);
  
  // Toolbar states
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(24);
  const [fillColor, setFillColor] = useState('#000000');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');

  const { toast } = useToast();

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fbCanvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 600,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    setCanvas(fbCanvas);

    // Event listeners
    fbCanvas.on('selection:created', (e) => {
      const obj = e.selected?.[0];
      if (obj && obj.type === 'textbox') {
        const textObj = obj as fabric.Textbox;
        setSelectedObject(textObj);
        setFontFamily(textObj.fontFamily || 'Inter');
        setFontSize(textObj.fontSize || 24);
        setFillColor((textObj.fill as string) || '#000000');
        setTextAlign((textObj.textAlign as 'left' | 'center' | 'right') || 'center');
      } else {
        setSelectedObject(null);
      }
    });

    fbCanvas.on('selection:updated', (e) => {
      const obj = e.selected?.[0];
      if (obj && obj.type === 'textbox') {
        const textObj = obj as fabric.Textbox;
        setSelectedObject(textObj);
        setFontFamily(textObj.fontFamily || 'Inter');
        setFontSize(textObj.fontSize || 24);
        setFillColor((textObj.fill as string) || '#000000');
        setTextAlign((textObj.textAlign as 'left' | 'center' | 'right') || 'center');
      } else {
        setSelectedObject(null);
      }
    });

    fbCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    return () => {
      fbCanvas.dispose();
    };
  }, []);

  // Load content into canvas
  useEffect(() => {
    if (!canvas || !initialContent) return;

    canvas.clear();

    const loadCanvasData = async () => {
      // 1. Load Background
      if (initialContent.background) {
        const bg = initialContent.background;
        if (bg.startsWith('http') || bg.startsWith('/') || bg.startsWith('data:')) {
          try {
            const img = await fabric.FabricImage.fromURL(bg);
            img.set({
              scaleX: canvas.width ? canvas.width / (img.width || 1) : 1,
              scaleY: canvas.height ? canvas.height / (img.height || 1) : 1,
            });
            canvas.backgroundImage = img;
            canvas.renderAll();
          } catch (err) {
            console.error('Failed to load background image:', err);
          }
        } else {
          canvas.backgroundColor = bg;
          canvas.renderAll();
        }
      }

      // 2. Load Objects
      if (initialContent.objects && Array.isArray(initialContent.objects)) {
        for (const obj of initialContent.objects) {
          if (obj.type === 'text') {
            const textObj = new fabric.Textbox(obj.text || 'Мәтін', {
              left: obj.left || 50,
              top: obj.top || 50,
              width: obj.width || 300,
              fontSize: obj.fontSize || 24,
              fontFamily: obj.fontFamily || 'Inter',
              fill: obj.fill || '#000000',
              textAlign: obj.textAlign || 'center',
              id: obj.id,
              selectable: !!obj.editable,
              hasControls: !!obj.editable,
              lockMovementX: !obj.editable,
              lockMovementY: !obj.editable,
              lockScalingX: !obj.editable,
              lockScalingY: !obj.editable,
              lockRotation: !obj.editable,
            } as any);

            canvas.add(textObj);
          } else if (obj.type === 'image') {
            try {
              const img = await fabric.FabricImage.fromURL(obj.src);
              img.set({
                left: obj.left || 50,
                top: obj.top || 50,
                scaleX: obj.scaleX || 1,
                scaleY: obj.scaleY || 1,
                selectable: !!obj.editable,
                hasControls: !!obj.editable,
                lockMovementX: !obj.editable,
                lockMovementY: !obj.editable,
                lockScalingX: !obj.editable,
                lockScalingY: !obj.editable,
                lockRotation: !obj.editable,
              });
              canvas.add(img);
            } catch (err) {
              console.error('Failed to load template object image:', err);
            }
          }
        }
      }

      canvas.renderAll();
    };

    loadCanvasData();
  }, [canvas, initialContent]);

  // Handle properties changes
  const changeFontFamily = (font: string) => {
    if (!canvas || !selectedObject) return;
    setFontFamily(font);
    selectedObject.set('fontFamily', font);
    canvas.renderAll();
  };

  const changeFontSize = (size: number) => {
    if (!canvas || !selectedObject) return;
    setFontSize(size);
    selectedObject.set('fontSize', size);
    canvas.renderAll();
  };

  const changeFillColor = (color: string) => {
    if (!canvas || !selectedObject) return;
    setFillColor(color);
    selectedObject.set('fill', color);
    canvas.renderAll();
  };

  const changeTextAlign = (align: 'left' | 'center' | 'right') => {
    if (!canvas || !selectedObject) return;
    setTextAlign(align);
    selectedObject.set('textAlign', align);
    canvas.renderAll();
  };

  // Compile JSON data for save
  const handleSaveClick = async () => {
    if (!canvas) return;

    // Build template JSON representation
    const objects = canvas.getObjects().map((obj: any) => {
      if (obj instanceof fabric.Textbox) {
        return {
          id: (obj as any).id,
          type: 'text',
          text: obj.text,
          left: obj.left,
          top: obj.top,
          width: obj.width,
          fontSize: obj.fontSize,
          fontFamily: obj.fontFamily,
          fill: obj.fill,
          textAlign: obj.textAlign,
          editable: obj.selectable,
        };
      } else if (obj instanceof fabric.FabricImage) {
        return {
          type: 'image',
          src: obj.getSrc ? obj.getSrc() : '',
          left: obj.left,
          top: obj.top,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          editable: obj.selectable,
        };
      }
      return null;
    }).filter(Boolean);

    const background = canvas.backgroundImage
      ? (canvas.backgroundImage as any).getSrc ? (canvas.backgroundImage as any).getSrc() : ''
      : (canvas.backgroundColor as string);

    const payload = {
      background,
      objects,
    };

    // Export static PNG
    const dataUrl = canvas.toDataURL({
      format: 'png',
      multiplier: 2, // Retain high quality
    });

    try {
      await onSave(payload, dataUrl);
      toast('Шақыру сәтті сақталды!', 'success');
    } catch {
      toast('Сақтау кезінде қате кетті', 'error');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full items-start" ref={containerRef}>
      {/* Canvas container */}
      <div className="flex-1 flex justify-center bg-background-100 p-6 rounded-2xl border border-background-200 w-full overflow-hidden">
        <div className="shadow-2xl rounded-lg overflow-hidden border border-background-300 bg-white">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Editor toolbar panel */}
      <div className="w-full lg:w-80 bg-background-50 p-6 rounded-2xl border border-background-200/80 flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-bold font-heading text-foreground-900 mb-1">Редактор</h3>
          <p className="text-xs text-foreground-500">Қалаған мәтінді екі рет басып өзгертіңіз</p>
        </div>

        {selectedObject ? (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            {/* Font Family Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground-500 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-accent-500" />
                <span>Қаріп түрі</span>
              </label>
              <select
                value={fontFamily}
                onChange={(e) => changeFontFamily(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-background-300 bg-background-50 text-sm font-medium focus:ring-2 focus:ring-accent-500"
              >
                {GOOGLE_FONTS.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground-500">Мәтін өлшемі ({fontSize}px)</label>
              <input
                type="range"
                min="12"
                max="80"
                value={fontSize}
                onChange={(e) => changeFontSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-background-200 rounded-lg appearance-none cursor-pointer accent-accent-500"
              />
            </div>

            {/* Color Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground-500 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-accent-500" />
                <span>Мәтін түсі</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => changeFillColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-background-300 overflow-hidden"
                />
                <input
                  type="text"
                  value={fillColor.toUpperCase()}
                  onChange={(e) => changeFillColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 h-10 px-3 text-sm font-semibold font-mono rounded-lg border border-background-300 bg-background-50"
                />
              </div>
            </div>

            {/* Text Alignment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground-500">Туралау</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => changeTextAlign('left')}
                  className={`flex-1 h-10 flex items-center justify-center border rounded-lg transition-colors ${
                    textAlign === 'left' ? 'bg-accent-500 border-accent-600 text-white' : 'border-background-300 hover:bg-background-100'
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => changeTextAlign('center')}
                  className={`flex-1 h-10 flex items-center justify-center border rounded-lg transition-colors ${
                    textAlign === 'center' ? 'bg-accent-500 border-accent-600 text-white' : 'border-background-300 hover:bg-background-100'
                  }`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => changeTextAlign('right')}
                  className={`flex-1 h-10 flex items-center justify-center border rounded-lg transition-colors ${
                    textAlign === 'right' ? 'bg-accent-500 border-accent-600 text-white' : 'border-background-300 hover:bg-background-100'
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-10 border border-dashed border-background-300 rounded-xl bg-background-100/50">
            <span className="text-xs text-foreground-500 text-center px-4">Баптау үшін қалаған мәтін өрісін басыңыз</span>
          </div>
        )}

        <hr className="border-background-200" />

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSaveClick}
            loading={isSaving}
            className="w-full flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Жобаны сақтау</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
