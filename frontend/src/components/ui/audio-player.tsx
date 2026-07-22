"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Music, Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  src?: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src = "https://assets.toyga.kz/audio/wedding_waltz.mp3",
  title = "Үйлену той әуені",
  autoPlay = false,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center space-x-3 rounded-full border border-gold/40 bg-[#1A1A2E]/90 px-4 py-2 text-xs font-semibold text-gold shadow-lg backdrop-blur-xl gold-glow",
        className
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        loop
        autoPlay={autoPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <button
        type="button"
        onClick={togglePlay}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-gold to-[#A68B4B] text-ink transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
      </button>

      <div className="flex items-center space-x-2">
        <Music className={cn("h-4 w-4 text-gold", isPlaying && "animate-pulse")} />
        <span className="max-w-[120px] truncate text-white/90">{title}</span>
      </div>

      <button
        type="button"
        onClick={toggleMute}
        className="text-white/60 hover:text-gold transition-colors p-1"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
};
