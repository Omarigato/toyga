"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEvent, useAutosave, usePublishEvent } from "@/shared/lib/queries";
import { useI18n } from "@/shared/i18n/provider";
import { useToast } from "@/shared/ui/toast";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
import { Modal } from "@/shared/ui/modal";
import { generateId } from "@/shared/lib/utils";
import type { CanvasBlock, BlockType } from "@/shared/types";
import { APP_CONFIG } from "@/shared/config";
import { ArrowLeft, Save, Eye, Send, Type, Image, QrCode, Clock, Map, List, Trash2 } from "lucide-react";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { t } = useI18n();
  const { toast } = useToast();
  const { data: event, isLoading } = useEvent(eventId);
  const autosave = useAutosave();
  const publish = usePublishEvent();

  const [blocks, setBlocks] = React.useState<CanvasBlock[]>([]);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [bg, setBg] = React.useState("#ffffff");
  const [preview, setPreview] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (event?.eventContents?.[0]?.canvasJson) {
      const cj = event.eventContents[0].canvasJson;
      setBlocks(cj.blocks || []);
      setBg(cj.background || "#ffffff");
    }
  }, [event]);

  React.useEffect(() => {
    if (!eventId || blocks.length === 0) return;
    const timer = setTimeout(() => {
      autosave.mutate({ eventId, data: { canvasJson: { width: APP_CONFIG.editor.canvasWidth, height: APP_CONFIG.editor.canvasHeight, background: bg, blocks } } });
    }, APP_CONFIG.editor.autosaveIntervalMs);
    return () => clearTimeout(timer);
  }, [blocks, bg, eventId]);

  async function save() {
    setSaving(true);
    try {
      await autosave.mutateAsync({ eventId, data: { canvasJson: { width: APP_CONFIG.editor.canvasWidth, height: APP_CONFIG.editor.canvasHeight, background: bg, blocks } } });
      toast("success", t("editor.save"));
    } catch { toast("error", t("common.error")); }
    finally { setSaving(false); }
  }

  async function publishEvent() {
    try { await publish.mutateAsync(eventId); toast("success", t("editor.publish")); }
    catch { toast("error", t("common.error")); }
  }

  function addBlock(type: BlockType) {
    const block: CanvasBlock = {
      id: generateId(), type, x: 50, y: 50 + blocks.length * 100,
      width: type === "text" ? 400 : 300, height: type === "text" ? 60 : 200,
      rotation: 0, opacity: 1, locked: false, visible: true,
      content: type === "text" ? t("editor.text") : undefined,
      style: { fontSize: 24, color: "#333333", fontFamily: "sans-serif", textAlign: "center" },
    };
    setBlocks((p) => [...p, block]);
    setSelected(block.id);
  }

  function updateBlock(id: string, updates: Partial<CanvasBlock>) {
    setBlocks((p) => p.map((b) => b.id === id ? { ...b, ...updates } : b));
  }

  function deleteBlock(id: string) {
    setBlocks((p) => p.filter((b) => b.id !== id));
    setSelected(null);
  }

  function moveBlock(id: string, dx: number, dy: number) {
    setBlocks((p) => p.map((b) => b.id === id ? { ...b, x: Math.max(0, b.x + dx), y: Math.max(0, b.y + dy) } : b));
  }

  const sel = blocks.find((b) => b.id === selected);
  const tools: Array<{ type: BlockType; icon: any; label: string }> = [
    { type: "text", icon: Type, label: t("editor.text") },
    { type: "image", icon: Image, label: t("editor.image") },
    { type: "qr", icon: QrCode, label: t("editor.qrCode") },
    { type: "countdown", icon: Clock, label: t("editor.countdown") },
    { type: "map", icon: Map, label: t("editor.map") },
    { type: "schedule", icon: List, label: t("editor.schedule") },
  ];

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" /></div>;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-stone-200 bg-white px-4 py-2 dark:border-stone-800 dark:bg-stone-950">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="mr-1 h-4 w-4" /> {t("editor.back")}</Button>
        <div className="flex-1" />
        <Badge variant={event?.status === "published" ? "success" : "secondary"}>{event?.status === "published" ? t("editor.published") : t("editor.draft")}</Badge>
        <Button variant="outline" size="sm" onClick={() => setPreview(true)}><Eye className="mr-1 h-4 w-4" /> {t("editor.preview")}</Button>
        <Button size="sm" onClick={save} isLoading={saving}><Save className="mr-1 h-4 w-4" /> {t("editor.save")}</Button>
        <Button size="sm" onClick={publishEvent} className="bg-emerald-600 hover:bg-emerald-500"><Send className="mr-1 h-4 w-4" /> {t("editor.publish")}</Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Tools */}
        <div className="w-16 border-r border-stone-200 bg-stone-50 p-2 dark:border-stone-800 dark:bg-stone-900">
          <div className="space-y-1">
            {tools.map((tool) => (
              <button key={tool.type} onClick={() => addBlock(tool.type)} className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-200 dark:text-stone-400 dark:hover:bg-stone-800" title={tool.label}>
                <tool.icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-stone-100 p-8 dark:bg-stone-900">
          <div className="mx-auto" style={{ maxWidth: 400 }}>
            <div className="relative mx-auto overflow-hidden rounded-2xl shadow-2xl" style={{ width: "100%", aspectRatio: "9/16", background: bg, maxHeight: "calc(100vh - 10rem)" }}>
              {blocks.filter((b) => b.visible).map((block) => (
                <div key={block.id}
                  className={`absolute cursor-move border-2 transition-all ${selected === block.id ? "border-amber-500 shadow-lg shadow-amber-500/20" : "border-transparent hover:border-amber-300"}`}
                  style={{ left: `${(block.x / APP_CONFIG.editor.canvasWidth) * 100}%`, top: `${(block.y / APP_CONFIG.editor.canvasHeight) * 100}%`, width: `${(block.width / APP_CONFIG.editor.canvasWidth) * 100}%`, height: `${(block.height / APP_CONFIG.editor.canvasHeight) * 100}%`, opacity: block.opacity, transform: `rotate(${block.rotation}deg)` }}
                  onClick={() => setSelected(block.id)}
                  onKeyDown={(e) => {
                    if (block.locked) return;
                    if (e.key === "ArrowLeft") moveBlock(block.id, -10, 0);
                    if (e.key === "ArrowRight") moveBlock(block.id, 10, 0);
                    if (e.key === "ArrowUp") moveBlock(block.id, 0, -10);
                    if (e.key === "ArrowDown") moveBlock(block.id, 0, 10);
                    if (e.key === "Delete" || e.key === "Backspace") deleteBlock(block.id);
                  }}
                  tabIndex={0}
                >
                  {block.type === "text" && <div className="flex h-full w-full items-center justify-center p-2 text-center" style={{ fontSize: block.style?.fontSize || 24, color: block.style?.color || "#333", fontFamily: block.style?.fontFamily || "sans-serif", textAlign: block.style?.textAlign as any }}>{block.content}</div>}
                  {block.type === "image" && block.src ? <img src={block.src} alt="" className="h-full w-full object-cover" /> : block.type === "image" ? <div className="flex h-full w-full items-center justify-center bg-stone-100 dark:bg-stone-800"><Image className="h-8 w-8 text-stone-300" /></div> : null}
                  {block.type === "qr" && <div className="flex h-full w-full items-center justify-center bg-white"><QrCode className="h-12 w-12 text-stone-400" /></div>}
                  {block.type === "countdown" && <div className="flex h-full w-full items-center justify-center bg-amber-50 dark:bg-amber-950/30"><div className="text-center"><Clock className="mx-auto h-6 w-6 text-amber-500" /><p className="mt-1 text-sm font-bold text-amber-700 dark:text-amber-400">00:00:00:00</p></div></div>}
                  {block.type === "map" && <div className="flex h-full w-full items-center justify-center bg-blue-50 dark:bg-blue-950/30"><Map className="h-8 w-8 text-blue-400" /></div>}
                  {block.type === "schedule" && <div className="flex h-full w-full items-center justify-center bg-stone-50 dark:bg-stone-800"><List className="h-8 w-8 text-stone-400" /></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="w-72 overflow-y-auto border-l border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-950">
          <h3 className="mb-4 text-sm font-semibold text-stone-500">{t("editor.properties")}</h3>
          {sel ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge>{sel.type}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => deleteBlock(sel.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              {sel.type === "text" && (
                <>
                  <div><label className="mb-1 block text-xs font-medium">{t("editor.content")}</label><textarea value={sel.content || ""} onChange={(e) => updateBlock(sel.id, { content: e.target.value })} className="w-full rounded-lg border border-stone-200 p-2 text-sm dark:border-stone-800 dark:bg-stone-900" rows={3} /></div>
                  <Input label={t("editor.fontSize")} type="number" value={sel.style?.fontSize || 24} onChange={(e) => updateBlock(sel.id, { style: { ...sel.style, fontSize: Number(e.target.value) } })} />
                  <div><label className="mb-1 block text-xs font-medium">{t("editor.color")}</label><input type="color" value={sel.style?.color || "#333333"} onChange={(e) => updateBlock(sel.id, { style: { ...sel.style, color: e.target.value } })} className="h-10 w-full rounded-lg border border-stone-200 dark:border-stone-800" /></div>
                </>
              )}
              {sel.type === "image" && <Input label={t("editor.url")} value={sel.src || ""} onChange={(e) => updateBlock(sel.id, { src: e.target.value })} placeholder="https://..." />}
              <div className="grid grid-cols-2 gap-2">
                <Input label="X" type="number" value={sel.x} onChange={(e) => updateBlock(sel.id, { x: Number(e.target.value) })} />
                <Input label="Y" type="number" value={sel.y} onChange={(e) => updateBlock(sel.id, { y: Number(e.target.value) })} />
                <Input label={t("editor.width")} type="number" value={sel.width} onChange={(e) => updateBlock(sel.id, { width: Number(e.target.value) })} />
                <Input label={t("editor.height")} type="number" value={sel.height} onChange={(e) => updateBlock(sel.id, { height: Number(e.target.value) })} />
              </div>
              <Input label="Rotation" type="number" value={sel.rotation} onChange={(e) => updateBlock(sel.id, { rotation: Number(e.target.value) })} />
              <div><label className="mb-1 block text-xs font-medium">Opacity</label><input type="range" min="0" max="1" step="0.1" value={sel.opacity} onChange={(e) => updateBlock(sel.id, { opacity: Number(e.target.value) })} className="w-full" /></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div><label className="mb-1 block text-xs font-medium">{t("editor.background")}</label><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-full rounded-lg border border-stone-200 dark:border-stone-800" /></div>
              <p className="text-xs text-stone-400">{t("editor.selectBlock")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal open={preview} onClose={() => setPreview(false)} title={t("editor.preview")} size="xl">
        <div className="flex justify-center">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ width: 360, aspectRatio: "9/16", background: bg }}>
            {blocks.filter((b) => b.visible).map((block) => (
              <div key={block.id} className="absolute" style={{ left: `${(block.x / APP_CONFIG.editor.canvasWidth) * 100}%`, top: `${(block.y / APP_CONFIG.editor.canvasHeight) * 100}%`, width: `${(block.width / APP_CONFIG.editor.canvasWidth) * 100}%`, height: `${(block.height / APP_CONFIG.editor.canvasHeight) * 100}%`, opacity: block.opacity }}>
                {block.type === "text" && <div className="flex h-full w-full items-center justify-center p-2 text-center" style={{ fontSize: block.style?.fontSize || 24, color: block.style?.color || "#333" }}>{block.content}</div>}
                {block.type === "image" && block.src && <img src={block.src} alt="" className="h-full w-full object-cover" />}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
