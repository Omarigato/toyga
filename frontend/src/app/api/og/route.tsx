import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Приглашение";
  const date = searchParams.get("date") || "";
  const type = searchParams.get("type") || "wedding";

  const bgColors: Record<string, [string, string]> = {
    wedding: ["#fdf2f4", "#f8e8e0"],
    "kyz-uzatu": ["#f0f4f1", "#e8f0ec"],
    sundet: ["#f0f4f8", "#e8ecf0"],
    birthday: ["#f5f0f8", "#ece8f0"],
    default: ["#faf8f5", "#f0ece5"],
  };

  const [from, to] = bgColors[type] || bgColors.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1920,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${from}, ${to})`,
          fontFamily: "serif",
          padding: 80,
        }}
      >
        {/* Decorative top line */}
        <div
          style={{
            width: 60,
            height: 2,
            background: "#c9a96e",
            marginBottom: 40,
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "#1a1a2e",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 24,
            maxWidth: 800,
          }}
        >
          {title}
        </div>

        {/* Date */}
        {date && (
          <div
            style={{
              fontSize: 32,
              color: "#c9a96e",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              marginBottom: 16,
            }}
          >
            {date}
          </div>
        )}

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#8a8578",
            fontSize: 20,
          }}
        >
          Тойға • Цифровые приглашения
        </div>

        {/* Decorative bottom line */}
        <div
          style={{
            position: "absolute",
            bottom: 100,
            width: 60,
            height: 2,
            background: "#c9a96e",
          }}
        />
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    }
  );
}
