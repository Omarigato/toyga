"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface QRCodeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
  title?: string;
}

export const QRCodeCard: React.FC<QRCodeProps> = ({
  value,
  size = 180,
  fgColor = "#1A1A2E",
  bgColor = "#FFFFFF",
  className,
  title = "QR код арқылы бөлісу",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-gold/30 bg-[#21213B] p-5 text-center shadow-xl backdrop-blur-md",
        className
      )}
    >
      <div className="rounded-xl bg-white p-3 shadow-inner mb-3">
        <QRCodeSVG
          value={value}
          size={size}
          fgColor={fgColor}
          bgColor={bgColor}
          level="H"
        />
      </div>
      {title && <p className="text-xs font-semibold text-gold/90">{title}</p>}
    </div>
  );
};
