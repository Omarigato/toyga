import { SealSvg } from "@/shared/ui/seal-svg";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-parchment)]">
      <div className="flex flex-col items-center gap-4">
        <SealSvg size={48} className="text-[var(--color-gold)]" />
        <div className="h-1 w-24 overflow-hidden rounded-full bg-[var(--color-steppe-15)]">
          <div className="h-full w-1/3 animate-[shimmer_1.5s_infinite] rounded-full bg-[var(--color-gold)]" />
        </div>
      </div>
    </div>
  );
}
