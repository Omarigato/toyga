"use client";

import * as React from "react";
import { useMedia, useUploadMedia, useDeleteMedia } from "@/shared/lib/queries";
import { useI18n } from "@/shared/i18n/provider";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { useToast } from "@/shared/ui/toast";
import { formatBytes } from "@/shared/lib/utils";
import { Upload, Image, Music, Video, Trash2, FileIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function MediaPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { data: media, isLoading } = useMedia();
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith("image") ? "image" : file.type.startsWith("audio") ? "music" : "video";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    try { await uploadMedia.mutateAsync({ formData }); toast("success", t("media.upload")); }
    catch { toast("error", t("common.error")); }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDelete(id: string) {
    if (!confirm(t("media.deleteConfirm"))) return;
    try { await deleteMedia.mutateAsync(id); toast("success", t("events.delete")); }
    catch { toast("error", t("common.error")); }
  }

  const icons: Record<string, any> = { image: Image, music: Music, video: Video };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">{t("media.title")}</h1><p className="text-sm text-stone-500">{t("media.subtitle")}</p></div>
        <div><input ref={fileRef} type="file" accept="image/*,audio/*" className="hidden" onChange={handleUpload} /><Button onClick={() => fileRef.current?.click()} isLoading={uploadMedia.isPending}><Upload className="mr-2 h-4 w-4" /> {t("media.upload")}</Button></div>
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Card key={i}><Skeleton className="h-40 w-full rounded-t-2xl" /><CardContent className="p-4"><Skeleton className="h-4 w-3/4" /></CardContent></Card>)}</div>
      ) : !media?.length ? (
        <Card><CardContent className="py-16 text-center"><FileIcon className="mx-auto h-12 w-12 text-stone-300" /><p className="mt-4 text-lg font-medium">{t("media.noMedia")}</p><Button className="mt-6" onClick={() => fileRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> {t("media.uploadFirst")}</Button></CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((item, i) => {
            const Icon = icons[item.type] || FileIcon;
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="group overflow-hidden">
                  <div className="relative h-40 bg-stone-100 dark:bg-stone-800">
                    {item.type === "image" ? <img src={item.fileUrl} alt={item.fileName} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><Icon className="h-12 w-12 text-stone-300" /></div>}
                    <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="truncate text-sm font-medium">{item.fileName}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                      <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                      <span>{formatBytes(item.size, t)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
