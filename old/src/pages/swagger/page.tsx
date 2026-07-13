import { useEffect } from "react";

/**
 * SwaggerPage — renders Swagger UI by injecting the swagger-ui-dist scripts
 * and a full-page iframe-like container.
 *
 * Accessible at: /swagger
 */
export default function SwaggerPage() {
  useEffect(() => {
    // Dynamically load swagger-ui-dist CSS
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css";
    document.head.appendChild(cssLink);

    // Load swagger-ui-bundle.js
    const bundle = document.createElement("script");
    bundle.src = "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js";

    // Load swagger-ui-standalone-preset.js after bundle
    bundle.onload = () => {
      const preset = document.createElement("script");
      preset.src =
        "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js";
      preset.onload = () => {
        // @ts-expect-error — SwaggerUIBundle is loaded via CDN
        const ui = window.SwaggerUIBundle({
          url: "/openapi.json",
          dom_id: "#swagger-root",
          deepLinking: true,
          presets: [
            // @ts-expect-error
            window.SwaggerUIBundle.presets.apis,
            // @ts-expect-error
            window.SwaggerUIStandalonePreset,
          ],
          plugins: [
            // @ts-expect-error
            window.SwaggerUIBundle.plugins.DownloadUrl,
          ],
          layout: "StandaloneLayout",
          defaultModelsExpandDepth: 1,
          defaultModelExpandDepth: 2,
          displayRequestDuration: true,
          filter: true,
          tryItOutEnabled: true,
          persistAuthorization: true,
          tagsSorter: "alpha",
        });
        return ui;
      };
      document.body.appendChild(preset);
    };
    document.body.appendChild(bundle);

    return () => {
      // Cleanup on unmount
      document.head.removeChild(cssLink);
    };
  }, []);

  return (
    <>
      {/* Topbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          zIndex: 9999,
          background: "linear-gradient(135deg, #1a1a22 0%, #22192e 100%)",
          borderBottom: "1px solid #2a2a36",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 16,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="url(#navGrad)" />
            <path
              d="M8 14l4 4 8-8"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="navGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#c7956e" />
                <stop offset="1" stopColor="#a87350" />
              </linearGradient>
            </defs>
          </svg>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              background: "linear-gradient(135deg, #c7956e, #e8b08a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Toyga API
          </span>
        </a>

        <span
          style={{
            background: "rgba(199,149,110,0.15)",
            color: "#c7956e",
            border: "1px solid rgba(199,149,110,0.3)",
            borderRadius: 20,
            padding: "2px 10px",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.5px",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          v1.0
        </span>

        <a
          href="/"
          style={{
            marginLeft: "auto",
            color: "#8888a0",
            textDecoration: "none",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "Inter, system-ui, sans-serif",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c7956e")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#8888a0")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          toyga.kz
        </a>
      </nav>

      {/* Swagger UI mount point */}
      <div
        id="swagger-root"
        style={{
          marginTop: 60,
          minHeight: "calc(100vh - 60px)",
          background: "#0f0f13",
        }}
      />

      {/* Dark theme override styles */}
      <style>{`
        :root {
          --brand: #c7956e;
          --brand-dark: #a87350;
          --bg: #0f0f13;
          --surface: #1a1a22;
          --border: #2a2a36;
          --text: #e8e8f0;
          --text-muted: #8888a0;
        }
        body { background: var(--bg) !important; }

        /* Hide default swagger topbar */
        .swagger-ui .topbar { display: none !important; }

        /* Info section */
        .swagger-ui .info {
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: 12px !important;
          padding: 24px 28px !important;
          margin-bottom: 24px !important;
        }
        .swagger-ui .info .title { color: var(--text) !important; font-size: 26px !important; font-weight: 700 !important; }
        .swagger-ui .info .description p, .swagger-ui .info p { color: var(--text-muted) !important; }
        .swagger-ui .info .base-url { color: var(--brand) !important; }

        /* Scheme container */
        .swagger-ui .scheme-container {
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: 10px !important;
          padding: 14px 20px !important;
          box-shadow: none !important;
        }

        /* Tags */
        .swagger-ui .opblock-tag {
          border-bottom: 1px solid var(--border) !important;
          color: var(--text) !important;
          font-size: 16px !important;
          font-weight: 600 !important;
        }
        .swagger-ui .opblock-tag:hover { background: rgba(199,149,110,0.05) !important; }

        /* Operation blocks */
        .swagger-ui .opblock {
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: 8px !important;
          margin-bottom: 8px !important;
          box-shadow: none !important;
        }
        .swagger-ui .opblock.opblock-get    { border-left: 3px solid #61affe !important; }
        .swagger-ui .opblock.opblock-post   { border-left: 3px solid #49cc90 !important; }
        .swagger-ui .opblock.opblock-put    { border-left: 3px solid #fca130 !important; }
        .swagger-ui .opblock.opblock-patch  { border-left: 3px solid #50e3c2 !important; }
        .swagger-ui .opblock.opblock-delete { border-left: 3px solid #f93e3e !important; }
        .swagger-ui .opblock .opblock-summary { background: transparent !important; }
        .swagger-ui .opblock .opblock-summary-description { color: var(--text-muted) !important; }
        .swagger-ui .opblock .opblock-summary-path { color: var(--text) !important; }
        .swagger-ui .opblock-summary-method { border-radius: 4px !important; min-width: 68px !important; font-size: 12px !important; font-weight: 700 !important; }
        .swagger-ui .opblock-body { background: rgba(0,0,0,0.2) !important; }

        /* Tables */
        .swagger-ui table thead tr th, .swagger-ui table thead tr td {
          color: var(--text-muted) !important;
          border-bottom: 1px solid var(--border) !important;
        }
        .swagger-ui .parameter__name { color: var(--text) !important; }
        .swagger-ui .parameter__type { color: var(--brand) !important; }

        /* Inputs */
        .swagger-ui input[type=text], .swagger-ui textarea, .swagger-ui select {
          background: var(--bg) !important;
          border: 1px solid var(--border) !important;
          color: var(--text) !important;
          border-radius: 6px !important;
        }

        /* Buttons */
        .swagger-ui .btn { border-radius: 6px !important; font-weight: 600 !important; }
        .swagger-ui .btn.execute { background: var(--brand) !important; border-color: var(--brand) !important; color: #fff !important; }
        .swagger-ui .btn.execute:hover { background: var(--brand-dark) !important; border-color: var(--brand-dark) !important; }
        .swagger-ui .btn.authorize { color: var(--brand) !important; border-color: var(--brand) !important; }
        .swagger-ui .btn.authorize svg { fill: var(--brand) !important; }

        /* Auth modal */
        .swagger-ui .dialog-ux .modal-ux { background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: 12px !important; }
        .swagger-ui .dialog-ux .modal-ux-header { background: transparent !important; border-bottom: 1px solid var(--border) !important; }
        .swagger-ui .dialog-ux .modal-ux-header h3 { color: var(--text) !important; }

        /* Response codes */
        .swagger-ui .responses-inner h4, .swagger-ui .responses-inner h5 { color: var(--text) !important; }
        .swagger-ui .response-col_status { color: var(--text) !important; }
        .swagger-ui .response-col_description__inner p { color: var(--text-muted) !important; }

        /* Code blocks */
        .swagger-ui .highlight-code > pre {
          background: #0a0a10 !important;
          border: 1px solid var(--border) !important;
          border-radius: 8px !important;
        }

        /* Models */
        .swagger-ui section.models {
          background: var(--surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: 10px !important;
        }
        .swagger-ui section.models.is-open h4 { border-bottom: 1px solid var(--border) !important; }
        .swagger-ui .model-title { color: var(--text) !important; }
        .swagger-ui .model { color: var(--text-muted) !important; }

        /* Wrapper layout */
        .swagger-ui .wrapper { max-width: 1200px !important; padding: 24px 20px 80px !important; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
      `}</style>
    </>
  );
}
