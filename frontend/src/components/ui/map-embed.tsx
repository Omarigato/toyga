"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapEmbedProps {
  venueName: string;
  address: string;
  gisUrl?: string;
  yandexUrl?: string;
  googleUrl?: string;
  latitude?: number;
  longitude?: number;
  className?: string;
}

export const MapEmbed: React.FC<MapEmbedProps> = ({
  venueName,
  address,
  gisUrl,
  yandexUrl,
  googleUrl,
  latitude = 43.238949,
  longitude = 76.889709,
  className,
}) => {
  const mapIframeUrl = `https://yandex.ru/map-widget/v1/?ll=${longitude}%2C${latitude}&z=16&pt=${longitude}%2C${latitude}%2Cpm2rdm`;

  return (
    <div
      className={cn(
        "rounded-2xl border border-gold/30 bg-[#21213B] overflow-hidden shadow-xl text-white backdrop-blur-md",
        className
      )}
    >
      <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shrink-0 mt-0.5">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold font-serif text-gold leading-tight">
              {venueName}
            </h4>
            <p className="text-xs text-white/70 mt-0.5">{address}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {gisUrl && (
            <a href={gisUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="h-8 text-xs border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                <Navigation className="w-3.5 h-3.5 mr-1" /> 2GIS
              </Button>
            </a>
          )}
          {yandexUrl && (
            <a href={yandexUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="h-8 text-xs border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                <ExternalLink className="w-3.5 h-3.5 mr-1" /> Яндекс
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="relative w-full h-56 bg-[#1A1A2E]">
        <iframe
          src={mapIframeUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
          className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
          title={`Map for ${venueName}`}
        />
      </div>
    </div>
  );
};
