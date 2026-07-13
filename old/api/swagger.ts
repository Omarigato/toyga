import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Swagger UI endpoint.
 * Serves a beautiful, interactive API documentation page.
 * Accessible at: GET /api/swagger
 *
 * The OpenAPI specification is loaded from /api/openapi.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Toyga API — Swagger UI</title>
  <meta name="description" content="Interactive API documentation for Toyga wedding invitation platform" />
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
  <style>
    :root {
      --brand: #c7956e;
      --brand-dark: #a87350;
      --bg: #0f0f13;
      --surface: #1a1a22;
      --border: #2a2a36;
      --text: #e8e8f0;
      --text-muted: #8888a0;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
    }

    /* ── Top bar ───────────────────────────────────────────────────── */
    .topbar {
      background: linear-gradient(135deg, #1a1a22 0%, #22192e 100%);
      border-bottom: 1px solid var(--border);
      padding: 0 24px;
      display: flex;
      align-items: center;
      height: 60px;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(10px);
    }

    .topbar-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .topbar-logo svg {
      width: 28px;
      height: 28px;
    }

    .topbar-title {
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(135deg, #c7956e, #e8b08a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .topbar-badge {
      background: rgba(199, 149, 110, 0.15);
      color: var(--brand);
      border: 1px solid rgba(199, 149, 110, 0.3);
      border-radius: 20px;
      padding: 2px 10px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .topbar-link {
      margin-left: auto;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color 0.2s;
    }

    .topbar-link:hover { color: var(--brand); }

    /* ── Swagger UI overrides ──────────────────────────────────────── */
    #swagger-ui {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 20px 80px;
    }

    .swagger-ui {
      font-family: 'Inter', system-ui, sans-serif !important;
    }

    /* Hide default top bar */
    .swagger-ui .topbar { display: none !important; }

    /* Info section */
    .swagger-ui .info {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px 28px !important;
      margin-bottom: 24px !important;
    }

    .swagger-ui .info .title {
      color: var(--text) !important;
      font-size: 26px !important;
      font-weight: 700 !important;
    }

    .swagger-ui .info .description p,
    .swagger-ui .info p {
      color: var(--text-muted) !important;
    }

    .swagger-ui .info .base-url {
      color: var(--brand) !important;
    }

    /* Scheme container */
    .swagger-ui .scheme-container {
      background: var(--surface) !important;
      border: 1px solid var(--border) !important;
      border-radius: 10px !important;
      padding: 14px 20px !important;
      margin-bottom: 20px !important;
      box-shadow: none !important;
    }

    /* Tags / sections */
    .swagger-ui .opblock-tag {
      border-bottom: 1px solid var(--border) !important;
      color: var(--text) !important;
      font-size: 16px !important;
      font-weight: 600 !important;
    }

    .swagger-ui .opblock-tag:hover {
      background: rgba(199, 149, 110, 0.05) !important;
    }

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

    .swagger-ui .opblock .opblock-summary {
      background: transparent !important;
    }

    .swagger-ui .opblock .opblock-summary-description {
      color: var(--text-muted) !important;
    }

    .swagger-ui .opblock .opblock-summary-path {
      color: var(--text) !important;
    }

    /* Method badges */
    .swagger-ui .opblock-summary-method {
      border-radius: 4px !important;
      min-width: 68px !important;
      font-size: 12px !important;
      font-weight: 700 !important;
    }

    /* Expanded block body */
    .swagger-ui .opblock-body {
      background: rgba(0,0,0,0.2) !important;
    }

    /* Tables */
    .swagger-ui table thead tr th,
    .swagger-ui table thead tr td {
      color: var(--text-muted) !important;
      border-bottom: 1px solid var(--border) !important;
    }

    .swagger-ui .parameter__name { color: var(--text) !important; }
    .swagger-ui .parameter__type { color: var(--brand) !important; }

    /* Input fields */
    .swagger-ui input[type=text],
    .swagger-ui textarea,
    .swagger-ui select {
      background: var(--bg) !important;
      border: 1px solid var(--border) !important;
      color: var(--text) !important;
      border-radius: 6px !important;
    }

    /* Buttons */
    .swagger-ui .btn {
      border-radius: 6px !important;
      font-weight: 600 !important;
    }

    .swagger-ui .btn.execute {
      background: var(--brand) !important;
      border-color: var(--brand) !important;
      color: #fff !important;
    }

    .swagger-ui .btn.execute:hover {
      background: var(--brand-dark) !important;
      border-color: var(--brand-dark) !important;
    }

    /* Authorize button */
    .swagger-ui .btn.authorize {
      color: var(--brand) !important;
      border-color: var(--brand) !important;
    }

    .swagger-ui .btn.authorize svg { fill: var(--brand) !important; }

    /* Auth modal */
    .swagger-ui .dialog-ux .modal-ux {
      background: var(--surface) !important;
      border: 1px solid var(--border) !important;
      border-radius: 12px !important;
    }

    .swagger-ui .dialog-ux .modal-ux-header {
      background: transparent !important;
      border-bottom: 1px solid var(--border) !important;
    }

    .swagger-ui .dialog-ux .modal-ux-header h3 {
      color: var(--text) !important;
    }

    /* Response codes */
    .swagger-ui .responses-inner h4,
    .swagger-ui .responses-inner h5 {
      color: var(--text) !important;
    }

    .swagger-ui .response-col_status { color: var(--text) !important; }

    .swagger-ui .response-col_description__inner p {
      color: var(--text-muted) !important;
    }

    /* Code / JSON */
    .swagger-ui .highlight-code > pre {
      background: #0a0a10 !important;
      border: 1px solid var(--border) !important;
      border-radius: 8px !important;
    }

    /* Models section */
    .swagger-ui section.models {
      background: var(--surface) !important;
      border: 1px solid var(--border) !important;
      border-radius: 10px !important;
    }

    .swagger-ui section.models.is-open h4 {
      border-bottom: 1px solid var(--border) !important;
    }

    .swagger-ui .model-title { color: var(--text) !important; }
    .swagger-ui .model { color: var(--text-muted) !important; }

    /* Loading animation */
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      flex-direction: column;
      gap: 16px;
      color: var(--text-muted);
    }

    .loading-dot {
      width: 10px; height: 10px;
      background: var(--brand);
      border-radius: 50%;
      display: inline-block;
      animation: pulse 1.2s ease-in-out infinite;
    }

    .loading-dot:nth-child(2) { animation-delay: 0.2s; }
    .loading-dot:nth-child(3) { animation-delay: 0.4s; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
  </style>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body>

  <!-- Top navigation bar -->
  <nav class="topbar">
    <a href="/" class="topbar-logo">
      <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="14" fill="url(#grad)" />
        <path d="M8 14l4 4 8-8" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stop-color="#c7956e"/>
            <stop offset="1" stop-color="#a87350"/>
          </linearGradient>
        </defs>
      </svg>
    </a>
    <span class="topbar-title">Toyga API</span>
    <span class="topbar-badge">v1.0</span>
    <a href="/" class="topbar-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      toyga.kz
    </a>
  </nav>

  <!-- Swagger UI container -->
  <div id="swagger-ui">
    <div class="loading-state" id="loading">
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
      <p>Loading API docs…</p>
    </div>
  </div>

  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js"></script>
  <script>
    document.getElementById('loading').remove();

    SwaggerUIBundle({
      url: '/api/openapi',
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset,
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl,
      ],
      layout: 'StandaloneLayout',
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 2,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
      persistAuthorization: true,
      tagsSorter: 'alpha',
    });
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
