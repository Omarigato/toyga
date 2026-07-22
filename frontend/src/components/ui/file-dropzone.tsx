"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { UploadCloud, File, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileDropzoneProps {
  accept?: string;
  maxSizeMB?: number;
  onFileSelect?: (file: File) => void;
  className?: string;
  label?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept = "image/*,audio/*",
  maxSizeMB = 10,
  onFileSelect,
  className,
  label = "Сурет немесе музыка жүктеу үшін осы жерге сүйреңіз",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Файл көлемі ${maxSizeMB}MB-тан аспауы тиіс`);
      return;
    }
    setError(null);
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer bg-[#21213B]/60 backdrop-blur-md",
          dragActive
            ? "border-gold bg-gold/10 scale-[1.01]"
            : "border-white/20 hover:border-gold/50 hover:bg-white/5",
          selectedFile && "border-teal/50 bg-teal/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {selectedFile ? (
          <div className="flex items-center space-x-3 text-left w-full">
            <div className="w-10 h-10 rounded-xl bg-teal/20 border border-teal/40 flex items-center justify-center text-teal-300">
              <File className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-teal-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="text-white/50 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-white">{label}</p>
            <p className="text-xs text-white/50 mt-1">
              PNG, JPG, MP3 (Макс. {maxSizeMB}MB)
            </p>
          </>
        )}
      </div>
      {error && <p className="text-xs text-crimson font-medium">{error}</p>}
    </div>
  );
};
