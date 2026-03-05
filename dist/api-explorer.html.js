"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExplorerHtml = getExplorerHtml;
function getExplorerHtml(options) {
    const { title, path } = options;
    const config = JSON.stringify({ title, path });
    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:         #f4f6fb;
      --bg-white:   #ffffff;
      --bg-sidebar: #ffffff;
      --bg-input:   #f8fafc;
      --bg-hover:   #f1f5f9;
      --bg-active:  #eff6ff;
      --border:     #e2e8f0;
      --border-2:   #cbd5e1;
      --text:       #0f172a;
      --text-muted: #64748b;
      --text-dim:   #94a3b8;
      --accent:     #3b82f6;
      --accent-bg:  #eff6ff;
      --accent-bdr: #bfdbfe;

      /* method colors */
      --get-bg:  #f0fdf4; --get-bdr: #bbf7d0; --get-fg:  #15803d;
      --post-bg: #eff6ff; --post-bdr:#bfdbfe; --post-fg: #1d4ed8;
      --put-bg:  #fff7ed; --put-bdr: #fed7aa; --put-fg:  #c2410c;
      --patch-bg:#fefce8; --patch-bdr:#fde68a;--patch-fg:#92400e;
      --del-bg:  #fef2f2; --del-bdr: #fecaca; --del-fg:  #dc2626;
      --head-bg: #faf5ff; --head-bdr:#e9d5ff; --head-fg: #7c3aed;
      --opt-bg:  #f8fafc; --opt-bdr: #e2e8f0; --opt-fg:  #475569;

      --radius:    8px;
      --radius-sm: 5px;
      --shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
      --shadow:    0 4px 12px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.05);
      --font-ui:   'Inter', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    html, body { height: 100%; overflow: hidden; background: var(--bg); color: var(--text); font-family: var(--font-ui); font-size: 13px; line-height: 1.5; }

    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-dim); }

    /* ── Layout ── */
    #app { display: flex; flex-direction: column; height: 100vh; }

    /* ── Header ── */
    #header {
      display: flex; align-items: center; gap: 12px;
      padding: 0 18px; height: 54px; flex-shrink: 0;
      background: var(--bg-white);
      border-bottom: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      z-index: 10;
    }
    .logo { display: flex; align-items: center; gap: 9px; text-decoration: none; }
    .logo-icon {
      width: 30px; height: 30px; border-radius: 8px;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(59,130,246,.35);
    }
    .logo-icon svg { color: #fff; }
    .logo-text { font-weight: 700; font-size: 15px; color: var(--text); letter-spacing: -0.4px; }
    .logo-text span { color: var(--accent); }

    .env-tag {
      font-size: 10px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase;
      padding: 2px 8px; border-radius: 20px;
      background: var(--bg-hover); border: 1px solid var(--border); color: var(--text-muted);
    }
    .env-tag.dev { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }

    .header-sep { width: 1px; height: 22px; background: var(--border); margin: 0 4px; }
    .header-spacer { flex: 1; }

    #base-url-group { display: flex; align-items: center; gap: 0; flex: 1; max-width: 380px; }
    .base-url-label {
      font-size: 11px; font-weight: 600; color: var(--text-muted); padding: 0 10px;
      white-space: nowrap; letter-spacing: 0.3px;
    }
    #base-url {
      flex: 1; height: 34px; padding: 0 11px;
      background: var(--bg-input); border: 1.5px solid var(--border);
      border-radius: var(--radius); color: var(--text); font-family: var(--font-mono);
      font-size: 12px; outline: none; transition: border-color .15s;
    }
    #base-url:focus { border-color: var(--accent); background: var(--bg-white); box-shadow: 0 0 0 3px rgba(59,130,246,.1); }

    .icon-btn {
      width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
      border-radius: var(--radius); border: 1.5px solid var(--border);
      background: var(--bg-white); color: var(--text-muted);
      cursor: pointer; transition: all .15s; flex-shrink: 0; position: relative;
    }
    .icon-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }
    .icon-btn.active { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }
    .icon-btn .dot {
      position: absolute; top: -3px; right: -3px;
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--get-fg); border: 2px solid var(--bg-white);
    }

    /* ── Global Auth Dropdown ── */
    #global-auth-dropdown {
      position: absolute; top: 56px; right: 16px; z-index: 100;
      width: 340px; background: var(--bg-white);
      border: 1.5px solid var(--border); border-radius: var(--radius);
      box-shadow: var(--shadow); padding: 16px;
    }
    #global-auth-dropdown.hidden { display: none; }
    .gauth-title {
      font-size: 12px; font-weight: 700; color: var(--text);
      margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
    }
    .gauth-title svg { color: var(--accent); }
    .gauth-active-badge {
      font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 10px;
      background: var(--get-bg); border: 1px solid var(--get-bdr); color: var(--get-fg);
    }
    .gauth-type-row { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 14px; }
    .gauth-type-btn {
      padding: 4px 11px; border-radius: 20px; border: 1.5px solid var(--border);
      background: var(--bg-input); color: var(--text-muted);
      font-size: 11px; font-weight: 500; cursor: pointer; transition: all .12s;
    }
    .gauth-type-btn:hover { border-color: var(--accent); color: var(--accent); }
    .gauth-type-btn.active { border-color: var(--accent); background: var(--accent-bg); color: var(--accent); font-weight: 600; }
    .gauth-footer { margin-top: 14px; display: flex; gap: 8px; }
    .gauth-save-btn {
      flex: 1; height: 32px; background: var(--accent); color: #fff; border: none;
      border-radius: var(--radius-sm); font-size: 12px; font-weight: 600; cursor: pointer; transition: background .15s;
    }
    .gauth-save-btn:hover { background: #2563eb; }
    .gauth-clear-btn {
      height: 32px; padding: 0 12px; background: var(--bg-input); color: var(--text-muted);
      border: 1.5px solid var(--border); border-radius: var(--radius-sm);
      font-size: 12px; cursor: pointer; transition: all .15s;
    }
    .gauth-clear-btn:hover { border-color: var(--del-fg); color: var(--del-fg); }

    /* ── Main ── */
    #main { display: flex; flex: 1; overflow: hidden; }

    /* ── Sidebar ── */
    #sidebar {
      width: 268px; flex-shrink: 0; display: flex; flex-direction: column;
      background: var(--bg-sidebar); border-right: 1px solid var(--border);
      overflow: hidden;
    }
    .sidebar-header {
      padding: 12px 14px 8px; border-bottom: 1px solid var(--border);
    }
    .sidebar-title {
      font-size: 11px; font-weight: 600; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 8px;
    }
    #search-wrap { position: relative; }
    #search {
      width: 100%; height: 32px; padding: 0 10px 0 32px;
      background: var(--bg-input); border: 1.5px solid var(--border);
      border-radius: var(--radius-sm); color: var(--text); font-family: var(--font-ui);
      font-size: 12px; outline: none; transition: all .15s;
    }
    #search:focus { border-color: var(--accent); background: var(--bg-white); box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
    #search::placeholder { color: var(--text-dim); }
    .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-dim); pointer-events: none; }

    #route-list { flex: 1; overflow-y: auto; padding: 4px 8px 16px; min-height: 0; }
    .route-count { font-size: 10px; color: var(--text-dim); padding: 8px 6px 4px; font-weight: 500; }

    .route-group { margin-bottom: 4px; }
    .route-group-header {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 8px 4px; cursor: pointer; user-select: none;
      border-radius: var(--radius-sm);
      transition: background .12s;
    }
    .route-group-header:hover { background: var(--bg-hover); }
    .route-group-name {
      font-size: 11px; font-weight: 700; color: var(--text);
      text-transform: uppercase; letter-spacing: 0.5px; flex: 1;
    }
    .route-group-count {
      font-size: 10px; font-weight: 600; color: var(--text-dim);
      background: var(--bg-hover); border: 1px solid var(--border);
      padding: 1px 6px; border-radius: 10px;
    }
    .route-group-chevron {
      color: var(--text-dim); transition: transform .2s; flex-shrink: 0;
    }
    .route-group-chevron.collapsed { transform: rotate(-90deg); }
    .route-group-body { padding-left: 4px; }
    .route-group-body.collapsed { display: none; }

    .route-item {
      display: flex; align-items: center; gap: 8px;
      padding: 7px 9px; border-radius: var(--radius-sm);
      cursor: pointer; transition: background .12s; border: 1.5px solid transparent;
      margin-bottom: 1px;
    }
    .route-item:hover { background: var(--bg-hover); }
    .route-item.active {
      background: var(--accent-bg); border-color: var(--accent-bdr);
    }
    .route-item.active .route-path { color: var(--text); font-weight: 500; }

    .method-badge {
      font-family: var(--font-mono); font-size: 9px; font-weight: 700;
      padding: 2px 6px; border-radius: 4px; letter-spacing: 0.2px;
      min-width: 46px; text-align: center; text-transform: uppercase;
      flex-shrink: 0; border-width: 1px; border-style: solid;
    }
    .method-GET    { background: var(--get-bg);   border-color: var(--get-bdr);   color: var(--get-fg);   }
    .method-POST   { background: var(--post-bg);  border-color: var(--post-bdr);  color: var(--post-fg);  }
    .method-PUT    { background: var(--put-bg);   border-color: var(--put-bdr);   color: var(--put-fg);   }
    .method-PATCH  { background: var(--patch-bg); border-color: var(--patch-bdr); color: var(--patch-fg); }
    .method-DELETE { background: var(--del-bg);   border-color: var(--del-bdr);   color: var(--del-fg);   }
    .method-HEAD   { background: var(--head-bg);  border-color: var(--head-bdr);  color: var(--head-fg);  }
    .method-OPTIONS{ background: var(--opt-bg);   border-color: var(--opt-bdr);   color: var(--opt-fg);   }

    .route-desc {
      display: block; font-size: 10px; color: var(--text-dim); margin-top: 1px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;
    }
    .route-path {
      font-family: var(--font-mono); font-size: 11.5px; color: var(--text-muted);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;
    }
    .empty-routes { padding: 32px 16px; text-align: center; color: var(--text-dim); font-size: 12px; line-height: 1.7; }

    /* ── Sidebar resize ── */
    #sidebar-resize { width: 4px; cursor: col-resize; background: transparent; flex-shrink: 0; transition: background .15s; }
    #sidebar-resize:hover, #sidebar-resize.dragging { background: var(--accent); opacity: .4; }

    /* ── Content ── */
    #content { flex: 1; display: flex; flex-direction: row; overflow: hidden; min-width: 0; }
    #content-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

    /* ── Summary Panel ── */
    #summary-panel {
      width: 400px; flex-shrink: 0; border-left: 1px solid var(--border);
      background: var(--bg-white); display: flex; flex-direction: column; overflow: hidden;
    }
    #summary-panel.hidden { display: none; }
    .summary-header {
      padding: 10px 14px 8px; border-bottom: 1px solid var(--border); flex-shrink: 0;
      display: flex; align-items: center; justify-content: space-between;
    }
    .summary-header-title { font-size: 11px; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.5px; }
    .summary-copy-btn {
      display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500;
      color: var(--text-muted); background: none; border: 1px solid var(--border);
      border-radius: var(--radius-sm); padding: 3px 8px; cursor: pointer; transition: all 0.15s;
    }
    .summary-copy-btn:hover { background: var(--bg-input); color: var(--accent); border-color: var(--accent); }
    .summary-copy-btn.copied { color: #16a34a; border-color: #86efac; background: #f0fdf4; }
    #summary-body { flex: 1; overflow-y: auto; padding: 10px 14px 16px; display: flex; flex-direction: column; gap: 14px; }
    .summary-section { display: flex; flex-direction: column; gap: 6px; }
    .summary-section-label {
      font-size: 10px; font-weight: 700; color: var(--text-dim);
      text-transform: uppercase; letter-spacing: 0.7px;
    }
    .summary-url {
      font-family: var(--font-mono); font-size: 11px; color: var(--text);
      word-break: break-all; line-height: 1.6; background: var(--bg-input);
      border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 6px 8px;
    }
    .summary-url .url-path-param { color: var(--put-fg); font-weight: 600; }
    .summary-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
      font-size: 11px; padding: 3px 0; border-bottom: 1px dashed var(--border);
    }
    .summary-row:last-child { border-bottom: none; }
    .summary-key { font-family: var(--font-mono); color: var(--accent); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .summary-val { font-family: var(--font-mono); color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .summary-none { font-size: 11px; color: var(--text-dim); font-style: italic; }
    .summary-method-pill {
      display: inline-block; font-family: var(--font-mono); font-size: 10px; font-weight: 700;
      padding: 2px 7px; border-radius: 4px; margin-right: 6px; vertical-align: middle;
      border-width: 1px; border-style: solid;
    }
    .summary-auth-row {
      display: flex; align-items: center; gap: 6px; font-size: 11px;
      padding: 4px 8px; background: var(--bg-input); border-radius: var(--radius-sm);
      border: 1px solid var(--border);
    }
    .summary-auth-icon { color: var(--accent); flex-shrink: 0; }
    .summary-auth-label { color: var(--text-muted); }
    .summary-auth-val { font-family: var(--font-mono); color: var(--text); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .summary-body-preview {
      font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);
      background: var(--bg-input); border: 1px solid var(--border); border-radius: var(--radius-sm);
      padding: 6px 8px; max-height: 100px; overflow-y: auto; white-space: pre-wrap; word-break: break-all; line-height: 1.5;
    }
    .summary-empty {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 8px; padding: 20px; color: var(--text-dim); text-align: center;
    }
    .summary-empty p { font-size: 11px; line-height: 1.6; }
    /* ── DocField rows (body/query/headers/response from docs file) ── */
    .df-row { padding: 5px 0; border-bottom: 1px dashed var(--border); }
    .df-row:last-child { border-bottom: none; }
    .df-top { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
    .df-bottom { margin-top: 2px; }
    .df-name { font-family: var(--font-mono); font-size: 11px; font-weight: 600; color: var(--accent); }
    .df-type { font-size: 9px; font-weight: 600; padding: 1px 5px; border-radius: 3px; background: var(--bg-input); border: 1px solid var(--border); color: var(--text-muted); }
    .df-req  { font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 3px; background: #fef2f2; border: 1px solid #fecaca; color: var(--del-fg); }
    .df-opt  { font-size: 9px; font-weight: 500; padding: 1px 5px; border-radius: 3px; background: var(--bg-input); border: 1px solid var(--border); color: var(--text-dim); }
    .df-rules { font-size: 10px; color: var(--text-dim); font-family: var(--font-mono); }
    .df-desc { font-size: 10px; color: var(--text-muted); font-style: italic; }

    /* ── URL bar ── */
    #url-bar {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 16px; border-bottom: 1px solid var(--border);
      background: var(--bg-white); flex-shrink: 0;
    }
    #method-pill {
      font-family: var(--font-mono); font-size: 11px; font-weight: 700;
      padding: 5px 11px; border-radius: var(--radius-sm); flex-shrink: 0;
      border-width: 1px; border-style: solid;
    }
    #url-display {
      flex: 1; height: 38px; padding: 0 12px;
      background: var(--bg-input); border: 1.5px solid var(--border);
      border-radius: var(--radius); color: var(--text); font-family: var(--font-mono);
      font-size: 12px; outline: none; transition: all .15s;
    }
    #url-display:focus { border-color: var(--accent); background: var(--bg-white); }

    #send-btn {
      height: 38px; padding: 0 22px; border-radius: var(--radius);
      background: var(--accent); border: none; color: #fff;
      font-family: var(--font-ui); font-weight: 600; font-size: 13px;
      cursor: pointer; transition: all .15s; flex-shrink: 0; letter-spacing: 0.2px;
      box-shadow: 0 1px 4px rgba(59,130,246,.3);
    }
    #send-btn:hover { background: #2563eb; box-shadow: 0 2px 8px rgba(59,130,246,.4); }
    #send-btn:active { background: #1d4ed8; }
    #send-btn:disabled { background: var(--bg-hover); color: var(--text-dim); box-shadow: none; cursor: not-allowed; }
    .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; vertical-align: middle; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Panels ── */
    #panels { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); padding: 8px; gap: 0; }

    /* ── Tabs ── */
    .tab-bar {
      display: flex; align-items: center; gap: 0; padding: 0 16px;
      background: var(--bg-white); border-bottom: 1px solid var(--border);
      flex-shrink: 0; height: 40px;
    }
    .tab-btn {
      display: flex; align-items: center; gap: 5px;
      padding: 0 14px; height: 40px;
      font-family: var(--font-ui); font-size: 12.5px; font-weight: 500;
      color: var(--text-muted); background: transparent; border: none;
      border-bottom: 2px solid transparent; cursor: pointer; transition: all .15s;
      white-space: nowrap; margin-bottom: -1px;
    }
    .tab-btn:hover { color: var(--text); }
    .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }

    .tab-badge {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 17px; height: 17px; padding: 0 4px;
      font-size: 10px; font-weight: 700; border-radius: 9px;
      background: var(--accent-bg); color: var(--accent); border: 1px solid var(--accent-bdr);
    }

    .tab-panel { display: none; flex: 1; min-height: 0; }
    .tab-panel.active { display: flex; flex-direction: column; gap: 6px; flex: 1; overflow-y: auto; padding: 14px 16px; min-height: 0; }

    /* ── Request Panel ── */
    #req-panel {
      display: flex; flex-direction: column; overflow: hidden;
      background: var(--bg-white);
      border-radius: var(--radius);
      border: 1px solid var(--border); box-shadow: var(--shadow-sm);
      flex: 0 0 300px; /* default height, user can drag to resize */
    }
    #req-panel-inner { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-height: 0; }

    .section-label {
      font-size: 10.5px; font-weight: 600; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 0.6px; padding-bottom: 8px;
    }
    .divider { height: 1px; background: var(--border); margin: 10px 0; }

    /* ── KV rows ── */
    .kv-row { display: grid; grid-template-columns: 20px 1fr 1fr 26px; gap: 5px; align-items: center; }
    .kv-checkbox { width: 14px; height: 14px; accent-color: var(--accent); cursor: pointer; flex-shrink: 0; }
    .kv-input {
      height: 30px; padding: 0 9px;
      background: var(--bg-input); border: 1.5px solid var(--border);
      border-radius: var(--radius-sm); color: var(--text); font-family: var(--font-mono);
      font-size: 11.5px; outline: none; transition: all .15s;
    }
    .kv-input:focus { border-color: var(--accent); background: var(--bg-white); }
    .kv-input::placeholder { color: var(--text-dim); }
    .kv-remove {
      width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
      border-radius: 4px; border: none; background: transparent;
      color: var(--text-dim); cursor: pointer; font-size: 16px; line-height: 1;
      transition: all .12s;
    }
    .kv-remove:hover { background: #fee2e2; color: #dc2626; }
    .add-row-btn {
      display: flex; align-items: center; gap: 6px; padding: 5px 2px;
      font-size: 12px; font-weight: 500; color: var(--accent);
      background: none; border: none; cursor: pointer; transition: opacity .12s; margin-top: 4px;
    }
    .add-row-btn:hover { opacity: .75; }

    /* Path params */
    .param-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: center; }
    .param-name {
      font-family: var(--font-mono); font-size: 11.5px; color: var(--put-fg);
      padding: 5px 10px; background: var(--put-bg); border-radius: var(--radius-sm);
      border: 1px solid var(--put-bdr); font-weight: 500;
    }

    /* Auth */
    .auth-type-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
    .auth-type-btn {
      padding: 5px 13px; border-radius: 20px;
      border: 1.5px solid var(--border);
      background: var(--bg-input); color: var(--text-muted);
      font-family: var(--font-ui); font-size: 12px; font-weight: 500;
      cursor: pointer; transition: all .12s;
    }
    .auth-type-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }
    .auth-type-btn.active { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); font-weight: 600; }

    /* Body */
    .body-type-row { display: flex; gap: 6px; margin-bottom: 10px; }
    .body-type-btn {
      padding: 4px 12px; border-radius: 20px;
      border: 1.5px solid var(--border); background: var(--bg-input);
      color: var(--text-muted); font-family: var(--font-mono); font-size: 11px;
      cursor: pointer; transition: all .12s;
    }
    .body-type-btn:hover { border-color: var(--accent); color: var(--accent); }
    .body-type-btn.active { border-color: var(--accent); background: var(--accent-bg); color: var(--accent); font-weight: 600; }

    #body-editor {
      flex: 1; min-height: 100px; padding: 10px 12px; resize: none;
      background: var(--bg-input); border: 1.5px solid var(--border);
      border-radius: var(--radius); color: var(--text); font-family: var(--font-mono);
      font-size: 12px; line-height: 1.65; outline: none; tab-size: 2; transition: all .15s;
    }
    #body-editor:focus { border-color: var(--accent); background: var(--bg-white); }

    #format-btn {
      align-self: flex-start; padding: 4px 11px; border-radius: var(--radius-sm);
      border: 1.5px solid var(--border); background: var(--bg-white);
      color: var(--text-muted); font-family: var(--font-ui); font-size: 11px; font-weight: 500;
      cursor: pointer; transition: all .12s; margin-top: 6px;
    }
    #format-btn:hover { border-color: var(--accent); color: var(--accent); }

    /* Select */
    .styled-select {
      height: 30px; padding: 0 9px; background: var(--bg-input); border: 1.5px solid var(--border);
      border-radius: var(--radius-sm); color: var(--text); font-family: var(--font-ui);
      font-size: 12px; outline: none; cursor: pointer; transition: all .15s;
    }
    .styled-select:focus { border-color: var(--accent); }

    /* ── Resize Handle ── */
    #resize-handle {
      height: 8px; cursor: row-resize; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: transparent; transition: background .15s;
    }
    #resize-handle::after {
      content: ''; display: block; width: 40px; height: 3px;
      border-radius: 2px; background: var(--border); transition: background .15s;
    }
    #resize-handle:hover::after, #resize-handle.dragging::after { background: var(--accent); }

    /* ── Response Panel ── */
    #res-panel {
      display: flex; flex-direction: column; overflow: hidden;
      background: var(--bg-white);
      border-radius: var(--radius);
      border: 1px solid var(--border); box-shadow: var(--shadow-sm);
      flex: 1; min-height: 140px;
    }

    #res-header {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 16px; border-bottom: 1px solid var(--border); flex-shrink: 0; min-height: 42px;
      background: var(--bg-white);
    }
    .res-label { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }

    .status-pill {
      font-family: var(--font-mono); font-size: 11px; font-weight: 700;
      padding: 3px 10px; border-radius: 20px; border-width: 1px; border-style: solid;
    }
    .status-2xx { background: var(--get-bg);   border-color: var(--get-bdr);   color: var(--get-fg); }
    .status-3xx { background: #eff6ff;          border-color: #bfdbfe;          color: #1d4ed8; }
    .status-4xx { background: var(--put-bg);   border-color: var(--put-bdr);   color: var(--put-fg); }
    .status-5xx { background: var(--del-bg);   border-color: var(--del-bdr);   color: var(--del-fg); }
    .status-err { background: var(--del-bg);   border-color: var(--del-bdr);   color: var(--del-fg); }

    .res-meta { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); }
    .res-spacer { flex: 1; }

    #copy-btn {
      display: flex; align-items: center; gap: 5px; padding: 4px 11px;
      border-radius: var(--radius-sm); border: 1.5px solid var(--border);
      background: var(--bg-white); color: var(--text-muted);
      font-family: var(--font-ui); font-size: 11px; font-weight: 500;
      cursor: pointer; transition: all .12s;
    }
    #copy-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }

    #res-body { flex: 1; overflow-y: auto; padding: 14px 16px; }
    #res-empty {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      flex: 1; min-height: 100px; gap: 10px; color: var(--text-dim); padding: 20px;
    }
    #res-empty p { font-size: 12.5px; text-align: center; line-height: 1.6; color: var(--text-muted); }
    #res-empty kbd {
      display: inline-block; padding: 1px 6px; border-radius: 4px;
      background: var(--bg-hover); border: 1px solid var(--border);
      font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);
    }

    #res-headers-list { display: flex; flex-direction: column; gap: 2px; padding: 12px 16px; overflow-y: auto; flex: 1; }
    .res-header-row {
      display: grid; grid-template-columns: 200px 1fr; gap: 12px;
      padding: 5px 0; border-bottom: 1px solid var(--border); font-size: 12px;
    }
    .res-header-row:last-child { border-bottom: none; }
    .res-header-key { font-family: var(--font-mono); font-weight: 600; color: var(--accent); }
    .res-header-val { font-family: var(--font-mono); color: var(--text-muted); word-break: break-all; }

    /* ── JSON highlight ── */
    pre.json-body {
      font-family: var(--font-mono); font-size: 12.5px; line-height: 1.7;
      white-space: pre-wrap; word-break: break-all; color: var(--text);
    }
    .json-key     { color: #0f766e; }
    .json-string  { color: #16a34a; }
    .json-number  { color: #d97706; }
    .json-boolean { color: #7c3aed; }
    .json-null    { color: #94a3b8; font-style: italic; }
    .raw-body { font-family: var(--font-mono); font-size: 12px; line-height: 1.7; color: var(--text-muted); white-space: pre-wrap; word-break: break-all; }

    /* ── No-route state ── */
    #no-route-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      flex: 1; gap: 12px; color: var(--text-dim); padding: 40px;
    }
    #no-route-state .icon-wrap {
      width: 64px; height: 64px; border-radius: 16px;
      background: var(--bg-hover); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
    }
    #no-route-state h3 { font-size: 15px; font-weight: 600; color: var(--text-muted); }
    #no-route-state p { font-size: 12.5px; color: var(--text-dim); max-width: 260px; text-align: center; line-height: 1.7; }

    /* ── Helpers ── */
    .flex-col { display: flex; flex-direction: column; }
    .gap-6 { gap: 6px; }
    .hidden { display: none !important; }
    .text-muted { color: var(--text-muted); font-size: 12px; line-height: 1.6; }
    .field-label { font-size: 11px; font-weight: 600; color: var(--text-muted); margin-bottom: 5px; display: block; }
    .field-group { display: flex; flex-direction: column; }
  </style>
</head>
<body>
<div id="app">

  <!-- Header -->
  <header id="header">
    <div class="logo">
      <div class="logo-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
      </div>
      <span class="logo-text">API<span>Explorer</span></span>
    </div>
    <span class="env-tag" id="env-tag">ENV</span>
    <div class="header-sep"></div>
    <div class="header-spacer"></div>
    <div id="base-url-group">
      <span class="base-url-label">Base URL</span>
      <input id="base-url" type="url" spellcheck="false" />
    </div>
    <button class="icon-btn" id="global-auth-btn" title="Global Authentication">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </button>
    <button class="icon-btn" id="reload-btn" title="Reload routes">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
    </button>
  </header>

  <!-- Global Auth Dropdown -->
  <div id="global-auth-dropdown" class="hidden">
    <div class="gauth-title">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      Global Authentication
      <span class="gauth-active-badge hidden" id="gauth-active-badge">Active</span>
    </div>
    <div class="gauth-type-row">
      <button class="gauth-type-btn active" data-gauth="none">None</button>
      <button class="gauth-type-btn" data-gauth="bearer">Bearer Token</button>
      <button class="gauth-type-btn" data-gauth="apikey">API Key</button>
    </div>
    <div id="gauth-none-panel" class="text-muted" style="font-size:12px">No global auth. Per-request auth (Auth tab) still applies.</div>
    <div id="gauth-bearer-panel" class="hidden flex-col gap-6">
      <div class="field-group">
        <label class="field-label">Bearer Token</label>
        <input class="kv-input" id="gauth-bearer-token" type="text" style="width:100%" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…" spellcheck="false" autocomplete="off" />
      </div>
    </div>
    <div id="gauth-apikey-panel" class="hidden flex-col gap-6">
      <div class="field-group">
        <label class="field-label">Key Name</label>
        <input class="kv-input" id="gauth-apikey-name" type="text" style="width:100%" placeholder="X-API-Key" value="X-API-Key" spellcheck="false" />
      </div>
      <div class="field-group">
        <label class="field-label">Key Value</label>
        <input class="kv-input" id="gauth-apikey-value" type="text" style="width:100%" placeholder="your-secret-key" autocomplete="off" spellcheck="false" />
      </div>
      <div class="field-group">
        <label class="field-label">Add To</label>
        <select class="styled-select" id="gauth-apikey-in" style="width:160px">
          <option value="header">Header</option>
          <option value="query">Query String</option>
        </select>
      </div>
    </div>
    <div class="gauth-footer">
      <button class="gauth-save-btn" id="gauth-save-btn">Apply Globally</button>
      <button class="gauth-clear-btn" id="gauth-clear-btn">Clear</button>
    </div>
  </div>

  <!-- Main -->
  <div id="main">

    <!-- Sidebar -->
    <aside id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-title">Routes</div>
        <div id="search-wrap">
          <svg class="search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input id="search" type="text" placeholder="Search routes…" autocomplete="off" spellcheck="false" />
        </div>
      </div>
      <div id="route-list"></div>
    </aside>

    <div id="sidebar-resize"></div>

    <!-- Content -->
    <div id="content">
    <div id="content-main">

      <!-- URL bar -->
      <div id="url-bar">
        <span id="method-pill" class="method-badge method-GET" style="visibility:hidden">GET</span>
        <input id="url-display" type="text" spellcheck="false" placeholder="Select a route from the sidebar…" readonly />
        <button id="send-btn" disabled>Send</button>
      </div>

      <!-- Panels -->
      <div id="panels">

        <!-- Request Panel -->
        <div id="req-panel">
          <div class="tab-bar" id="req-tab-bar">
            <button class="tab-btn active" data-tab="params">Params</button>
            <button class="tab-btn" data-tab="headers">Headers</button>
            <button class="tab-btn" data-tab="auth">Auth</button>
            <button class="tab-btn" data-tab="body">Body</button>
          </div>
          <div id="req-panel-inner">

            <!-- Params -->
            <div class="tab-panel active" id="tab-params">
              <div id="path-params-section" class="hidden">
                <div class="section-label">Path Parameters</div>
                <div id="path-params-rows" class="flex-col gap-6"></div>
                <div class="divider"></div>
              </div>
              <div class="section-label">Query Parameters</div>
              <div id="query-params-rows" class="flex-col gap-6"></div>
              <button class="add-row-btn" id="add-query-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add parameter
              </button>
            </div>

            <!-- Headers -->
            <div class="tab-panel" id="tab-headers">
              <div id="req-headers-rows" class="flex-col gap-6"></div>
              <button class="add-row-btn" id="add-header-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add header
              </button>
            </div>

            <!-- Auth -->
            <div class="tab-panel" id="tab-auth">
              <div class="auth-type-row">
                <button class="auth-type-btn active" data-auth="none">None</button>
                <button class="auth-type-btn" data-auth="bearer">Bearer Token</button>
                <button class="auth-type-btn" data-auth="basic">Basic Auth</button>
                <button class="auth-type-btn" data-auth="apikey">API Key</button>
              </div>
              <div id="auth-none-panel" class="text-muted">No authentication will be sent with this request.</div>
              <div id="auth-bearer-panel" class="hidden flex-col gap-6">
                <div class="field-group">
                  <label class="field-label">Token</label>
                  <input class="kv-input" id="bearer-token" type="text" style="width:100%" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…" autocomplete="off" spellcheck="false" />
                </div>
              </div>
              <div id="auth-basic-panel" class="hidden flex-col gap-6">
                <div class="field-group">
                  <label class="field-label">Username</label>
                  <input class="kv-input" id="basic-username" type="text" style="width:100%" placeholder="username" autocomplete="off" spellcheck="false" />
                </div>
                <div class="field-group">
                  <label class="field-label">Password</label>
                  <input class="kv-input" id="basic-password" type="password" style="width:100%" placeholder="••••••••" autocomplete="off" />
                </div>
              </div>
              <div id="auth-apikey-panel" class="hidden flex-col gap-6">
                <div class="field-group">
                  <label class="field-label">Key Name</label>
                  <input class="kv-input" id="apikey-name" type="text" style="width:100%" placeholder="X-API-Key" value="X-API-Key" spellcheck="false" />
                </div>
                <div class="field-group">
                  <label class="field-label">Key Value</label>
                  <input class="kv-input" id="apikey-value" type="text" style="width:100%" placeholder="your-secret-key" autocomplete="off" spellcheck="false" />
                </div>
                <div class="field-group">
                  <label class="field-label">Add To</label>
                  <select class="styled-select" id="apikey-in" style="width:160px">
                    <option value="header">Header</option>
                    <option value="query">Query String</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="tab-panel" id="tab-body">
              <div class="body-type-row">
                <button class="body-type-btn active" data-body="none">None</button>
                <button class="body-type-btn" data-body="json">JSON</button>
                <button class="body-type-btn" data-body="form">Form</button>
                <button class="body-type-btn" data-body="text">Text</button>
              </div>
              <div id="body-editor-wrap" class="hidden flex-col" style="flex:1">
                <textarea id="body-editor" placeholder='{\n  "key": "value"\n}'></textarea>
                <button id="format-btn">⌥ Format JSON</button>
              </div>
              <div id="body-none-msg" class="text-muted">No request body will be sent with this request.</div>
            </div>

          </div>
        </div>

        <!-- Resize handle -->
        <div id="resize-handle"></div>

        <!-- Response Panel -->
        <div id="res-panel">
          <div id="res-header">
            <span class="res-label">Response</span>
            <span id="status-pill"></span>
            <span class="res-meta" id="res-time"></span>
            <span class="res-meta" id="res-size"></span>
            <div class="res-spacer"></div>
            <button id="copy-btn" class="hidden">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy
            </button>
          </div>
          <div class="tab-bar" id="res-tab-bar">
            <button class="tab-btn active" data-tab="body">Body</button>
            <button class="tab-btn" data-tab="headers">Headers <span class="tab-badge" id="res-headers-count" style="display:none"></span></button>
          </div>
          <div id="res-body-panel" style="flex:1;overflow:hidden;display:flex;flex-direction:column">
            <div id="res-empty">
              <div class="icon-wrap" style="width:52px;height:52px;border-radius:14px;background:var(--bg-hover);border:1px solid var(--border);display:flex;align-items:center;justify-content:center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <p>Select a route and click <strong>Send</strong><br/>or press <kbd>⌘ Enter</kbd> to make a request.</p>
            </div>
            <div id="res-body" class="hidden"></div>
          </div>
          <div id="res-headers-panel" class="hidden" style="flex:1;overflow:hidden;display:flex;flex-direction:column">
            <div id="res-headers-list"></div>
          </div>
        </div>

      </div>
    </div><!-- content-main -->

    <!-- Summary Panel -->
    <div id="summary-panel" class="hidden">
      <div class="summary-header">
        <span class="summary-header-title">Request Summary</span>
        <button id="summary-copy-btn" class="summary-copy-btn hidden" title="Copy summary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <span id="summary-copy-label">Copy</span>
        </button>
      </div>
      <div id="summary-body">
        <div class="summary-empty" id="summary-empty">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <p>Select a route to see the request summary</p>
        </div>
        <div id="summary-content" class="hidden" style="display:flex;flex-direction:column;gap:14px"></div>
      </div>
    </div>

  </div><!-- content -->
  </div><!-- main -->
</div><!-- app -->

<script>
const CONFIG = ${config};

// ── State ──────────────────────────────────────────────────────────
const S = {
  routes: [], filtered: [], selected: null,
  pathParams: {}, queryParams: [], reqHeaders: [],
  auth: { type: 'none', bearerToken: '', basicUsername: '', basicPassword: '', apiKeyName: 'X-API-Key', apiKeyValue: '', apiKeyIn: 'header' },
  body: { type: 'none', content: '' },
  response: null, reqTab: 'params', resTab: 'body', loading: false, _uid: 0, collapsedGroups: new Set(),
  globalAuth: { type: 'none', bearerToken: '', apiKeyName: 'X-API-Key', apiKeyValue: '', apiKeyIn: 'header' },
};
function uid() { return ++S._uid; }

// ── Elements ───────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = {
  envTag: $('env-tag'), baseUrl: $('base-url'), reloadBtn: $('reload-btn'),
  search: $('search'), routeList: $('route-list'),
  methodPill: $('method-pill'), urlDisplay: $('url-display'), sendBtn: $('send-btn'),
  reqTabBar: $('req-tab-bar'),
  pathParamsSec: $('path-params-section'), pathParamsRows: $('path-params-rows'),
  queryParamsRows: $('query-params-rows'), addQueryBtn: $('add-query-btn'),
  reqHeadersRows: $('req-headers-rows'), addHeaderBtn: $('add-header-btn'),
  bearerToken: $('bearer-token'), basicUsername: $('basic-username'), basicPassword: $('basic-password'),
  apikeyName: $('apikey-name'), apikeyValue: $('apikey-value'), apikeyIn: $('apikey-in'),
  bodyEditor: $('body-editor'), formatBtn: $('format-btn'),
  bodyEditorWrap: $('body-editor-wrap'), bodyNoneMsg: $('body-none-msg'),
  resizeHandle: $('resize-handle'), sidebarResize: $('sidebar-resize'),
  statusPill: $('status-pill'), resTime: $('res-time'), resSize: $('res-size'),
  copyBtn: $('copy-btn'), resHeadersCount: $('res-headers-count'),
  resTabBar: $('res-tab-bar'), resEmpty: $('res-empty'), resBody: $('res-body'),
  resBodyPanel: $('res-body-panel'), resHeadersPanel: $('res-headers-panel'),
  resHeadersList: $('res-headers-list'),
  reqPanel: $('req-panel'), resPanel: $('res-panel'), panels: $('panels'),
  sidebar: $('sidebar'),
};

// ── Init ───────────────────────────────────────────────────────────
function init() {
  el.baseUrl.value = window.location.origin;
  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
  el.envTag.textContent = isLocal ? 'dev' : 'staging';
  if (isLocal) el.envTag.classList.add('dev');
  bindEvents();
  loadRoutes();
  renderSummary();
}

// ── Routes ─────────────────────────────────────────────────────────
async function loadRoutes() {
  el.reloadBtn.querySelector('svg').style.animation = 'spin .6s linear infinite';
  try {
    const res = await fetch('/' + CONFIG.path + '/routes');
    S.routes = await res.json();
    applyFilter(); renderRouteList();
  } catch {
    el.routeList.innerHTML = '<div class="empty-routes">⚠️ Could not load routes.<br/>Is the server running?</div>';
  } finally {
    el.reloadBtn.querySelector('svg').style.animation = '';
  }
}

function applyFilter() {
  const q = el.search.value.trim().toLowerCase();
  // Exclude the explorer's own routes
  const explorerPrefix = '/' + CONFIG.path;
  const base = S.routes.filter(r => !r.path.startsWith(explorerPrefix));
  S.filtered = q ? base.filter(r => r.path.toLowerCase().includes(q) || r.method.toLowerCase().includes(q)) : base;
}

function groupRoutes(routes) {
  const groups = {};
  routes.forEach(r => {
    // Use group from docs file if available, otherwise fall back to first path segment
    const key = r.group || (r.path.split('/').filter(Boolean)[0] || 'general');
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });
  return groups;
}

function renderRouteItem(r) {
  const active = S.selected?.method === r.method && S.selected?.path === r.path ? ' active' : '';
  return \`<div class="route-item\${active}" data-method="\${r.method}" data-path="\${esc(r.path)}">
    <span class="method-badge method-\${r.method}">\${r.method}</span>
    <span class="route-path" title="\${esc(r.path)}">\${esc(r.path)}</span>
  </div>\`;
}

function renderRouteList() {
  if (!S.filtered.length) {
    el.routeList.innerHTML = \`<div class="empty-routes">\${S.routes.length ? 'No routes match your search.' : 'No routes found.'}</div>\`;
    return;
  }

  const searching = el.search.value.trim().length > 0;
  const total = S.filtered.length;

  // When searching, show flat list; otherwise group by prefix
  if (searching) {
    el.routeList.innerHTML =
      \`<div class="route-count">\${total} result\${total !== 1 ? 's' : ''}</div>\` +
      S.filtered.map(renderRouteItem).join('');
  } else {
    const groups = groupRoutes(S.filtered);
    el.routeList.innerHTML =
      \`<div class="route-count">\${total} route\${total !== 1 ? 's' : ''}</div>\` +
      Object.entries(groups).map(([name, routes]) => {
        const isCollapsed = S.collapsedGroups && S.collapsedGroups.has(name) ? 'collapsed' : '';
        return \`<div class="route-group" data-group="\${esc(name)}">
          <div class="route-group-header" data-toggle="\${esc(name)}">
            <svg class="route-group-chevron \${isCollapsed}" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            <span class="route-group-name">/\${esc(name)}</span>
            <span class="route-group-count">\${routes.length}</span>
          </div>
          <div class="route-group-body \${isCollapsed}">\${routes.map(renderRouteItem).join('')}</div>
        </div>\`;
      }).join('');
  }

  // Click handlers for route items
  el.routeList.querySelectorAll('.route-item').forEach(item => {
    item.addEventListener('click', () => {
      const route = S.routes.find(r => r.method === item.dataset.method && r.path === item.dataset.path);
      if (route) selectRoute(route);
    });
  });

  // Collapse/expand group headers
  el.routeList.querySelectorAll('[data-toggle]').forEach(header => {
    header.addEventListener('click', () => {
      const name = header.dataset.toggle;
      if (!S.collapsedGroups) S.collapsedGroups = new Set();
      const group = header.closest('.route-group');
      const body = group.querySelector('.route-group-body');
      const chevron = group.querySelector('.route-group-chevron');
      if (S.collapsedGroups.has(name)) {
        S.collapsedGroups.delete(name);
        body.classList.remove('collapsed');
        chevron.classList.remove('collapsed');
      } else {
        S.collapsedGroups.add(name);
        body.classList.add('collapsed');
        chevron.classList.add('collapsed');
      }
    });
  });
}

function selectRoute(route) {
  S.selected = route;
  S.pathParams = {};
  (route.params || []).forEach(p => { S.pathParams[p] = ''; });
  S.response = null;
  renderResponse(); renderUrlBar(); renderPathParams(); renderRouteList(); renderSummary();
  el.sendBtn.disabled = false;
  el.methodPill.style.visibility = 'visible';

  // Auto-switch to Params tab (always — it shows both path & query params)
  el.reqTabBar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  el.reqTabBar.querySelector('[data-tab="params"]').classList.add('active');
  document.querySelectorAll('#req-panel-inner .tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-params').classList.add('active');

  // Auto-fill body editor from body schema if available
  const bodyMethods = ['POST', 'PUT', 'PATCH'];
  if (bodyMethods.includes(route.method) && route.body?.length) {
    const template = {};
    route.body.forEach(f => {
      if (f.type === 'number')       template[f.name] = 0;
      else if (f.type === 'boolean') template[f.name] = false;
      else if (f.type === 'array')   template[f.name] = [];
      else if (f.type === 'object')  template[f.name] = {};
      else                           template[f.name] = '';
    });
    S.body.content = JSON.stringify(template, null, 2);
    S.body.type = 'json';
    el.bodyEditor.value = S.body.content;
    // Sync body type radio
    document.querySelectorAll('[name="body-type"]').forEach(r => {
      r.checked = r.value === 'json';
    });
    el.formatBtn.style.display = '';
  }

  // Auto-switch to Body tab for methods that send a body
  if (bodyMethods.includes(route.method) && !route.params.length) {
    el.reqTabBar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    el.reqTabBar.querySelector('[data-tab="body"]').classList.add('active');
    document.querySelectorAll('#req-panel-inner .tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-body').classList.add('active');
  }
}

// ── URL ────────────────────────────────────────────────────────────
function buildUrl() {
  if (!S.selected) return '';
  const raw = el.baseUrl.value;
  const base = raw.endsWith('/') ? raw.slice(0, -1) : raw;
  let path = S.selected.path;
  Object.entries(S.pathParams).forEach(([k, v]) => {
    path = path.replace(':' + k, encodeURIComponent(v || (':' + k)));
  });
  // Per-route apikey in query (overrides global if set)
  const perRouteQpAuth = S.auth.type === 'apikey' && S.auth.apiKeyIn === 'query' && S.auth.apiKeyValue
    ? [[S.auth.apiKeyName, S.auth.apiKeyValue]] : [];
  // Global apikey in query (only if per-route auth is 'none')
  const globalQpAuth = S.auth.type === 'none' && S.globalAuth.type === 'apikey' && S.globalAuth.apiKeyIn === 'query' && S.globalAuth.apiKeyValue
    ? [[S.globalAuth.apiKeyName, S.globalAuth.apiKeyValue]] : [];
  const qp = [...S.queryParams.filter(p => p.enabled && p.key).map(p => [p.key, p.value]), ...perRouteQpAuth, ...globalQpAuth];
  const qs = qp.map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
  return base + path + (qs ? '?' + qs : '');
}

function renderUrlBar() {
  if (!S.selected) return;
  el.methodPill.textContent = S.selected.method;
  el.methodPill.className = 'method-badge method-' + S.selected.method;
  el.urlDisplay.value = buildUrl();
}

// ── Params / Headers ───────────────────────────────────────────────
function renderPathParams() {
  const params = S.selected?.params || [];
  el.pathParamsSec.classList.toggle('hidden', !params.length);
  if (!params.length) return;
  el.pathParamsRows.innerHTML = params.map(p => \`
    <div class="param-row">
      <span class="param-name">:\${esc(p)}</span>
      <input class="kv-input" data-path-param="\${esc(p)}" placeholder="value" value="\${esc(S.pathParams[p] || '')}" spellcheck="false" />
    </div>\`).join('');
  el.pathParamsRows.querySelectorAll('[data-path-param]').forEach(input => {
    input.addEventListener('input', () => { S.pathParams[input.dataset.pathParam] = input.value; renderUrlBar(); renderSummary(); });
  });
}

function renderQueryParams() {
  el.queryParamsRows.innerHTML = S.queryParams.map(p => \`
    <div class="kv-row" data-id="\${p.id}">
      <input type="checkbox" class="kv-checkbox" \${p.enabled ? 'checked' : ''} data-action="toggle-query" data-id="\${p.id}" />
      <input class="kv-input" placeholder="key" value="\${esc(p.key)}" data-action="key-query" data-id="\${p.id}" spellcheck="false" />
      <input class="kv-input" placeholder="value" value="\${esc(p.value)}" data-action="val-query" data-id="\${p.id}" spellcheck="false" />
      <button class="kv-remove" data-action="remove-query" data-id="\${p.id}">×</button>
    </div>\`).join('');
  el.queryParamsRows.querySelectorAll('[data-action]').forEach(bindKvAction);
}

function renderReqHeaders() {
  el.reqHeadersRows.innerHTML = S.reqHeaders.map(h => \`
    <div class="kv-row" data-id="\${h.id}">
      <input type="checkbox" class="kv-checkbox" \${h.enabled ? 'checked' : ''} data-action="toggle-header" data-id="\${h.id}" />
      <input class="kv-input" placeholder="Header-Name" value="\${esc(h.key)}" data-action="key-header" data-id="\${h.id}" spellcheck="false" />
      <input class="kv-input" placeholder="value" value="\${esc(h.value)}" data-action="val-header" data-id="\${h.id}" spellcheck="false" />
      <button class="kv-remove" data-action="remove-header" data-id="\${h.id}">×</button>
    </div>\`).join('');
  el.reqHeadersRows.querySelectorAll('[data-action]').forEach(bindKvAction);
}

function bindKvAction(node) {
  const { action, id } = node.dataset; const pid = +id;
  const handlers = {
    'toggle-query':  () => { const p = S.queryParams.find(x=>x.id===pid); if(p){p.enabled=node.checked;renderUrlBar();} },
    'key-query':     () => { const p = S.queryParams.find(x=>x.id===pid); if(p){p.key=node.value;renderUrlBar();} },
    'val-query':     () => { const p = S.queryParams.find(x=>x.id===pid); if(p){p.value=node.value;renderUrlBar();} },
    'remove-query':  () => { S.queryParams=S.queryParams.filter(x=>x.id!==pid); renderQueryParams(); renderUrlBar(); },
    'toggle-header': () => { const h = S.reqHeaders.find(x=>x.id===pid); if(h) h.enabled=node.checked; },
    'key-header':    () => { const h = S.reqHeaders.find(x=>x.id===pid); if(h) h.key=node.value; },
    'val-header':    () => { const h = S.reqHeaders.find(x=>x.id===pid); if(h) h.value=node.value; },
    'remove-header': () => { S.reqHeaders=S.reqHeaders.filter(x=>x.id!==pid); renderReqHeaders(); },
  };
  const evt = action.startsWith('toggle') || action.startsWith('remove') ? 'change' : 'input';
  if (action.startsWith('remove')) node.addEventListener('click', handlers[action]);
  else node.addEventListener(evt, handlers[action]);
}

// ── Send ───────────────────────────────────────────────────────────
async function sendRequest() {
  if (!S.selected || S.loading) return;
  S.loading = true;
  el.sendBtn.innerHTML = '<span class="spinner"></span>';
  el.sendBtn.disabled = true;

  const headers = {};
  S.reqHeaders.filter(h => h.enabled && h.key).forEach(h => { headers[h.key] = h.value; });

  // Apply global auth first (lower priority)
  if (S.globalAuth.type === 'bearer' && S.globalAuth.bearerToken)
    headers['Authorization'] = 'Bearer ' + S.globalAuth.bearerToken;
  else if (S.globalAuth.type === 'apikey' && S.globalAuth.apiKeyIn === 'header' && S.globalAuth.apiKeyValue)
    headers[S.globalAuth.apiKeyName || 'X-API-Key'] = S.globalAuth.apiKeyValue;

  // Per-route auth overrides global (higher priority)
  if (S.auth.type === 'bearer' && S.auth.bearerToken) headers['Authorization'] = 'Bearer ' + S.auth.bearerToken;
  else if (S.auth.type === 'basic') headers['Authorization'] = 'Basic ' + btoa(S.auth.basicUsername + ':' + S.auth.basicPassword);
  else if (S.auth.type === 'apikey' && S.auth.apiKeyIn === 'header' && S.auth.apiKeyValue) headers[S.auth.apiKeyName || 'X-API-Key'] = S.auth.apiKeyValue;
  if (S.body.type === 'json') headers['Content-Type'] = 'application/json';
  else if (S.body.type === 'form') headers['Content-Type'] = 'application/x-www-form-urlencoded';
  else if (S.body.type === 'text') headers['Content-Type'] = 'text/plain';

  const method = S.selected.method;
  const noBody = ['GET','HEAD','DELETE','OPTIONS'].includes(method);
  const body = (!noBody && S.body.type !== 'none') ? S.body.content || null : null;

  const t0 = performance.now();
  try {
    const res = await fetch(buildUrl(), { method, headers, ...(body ? {body} : {}) });
    const elapsed = Math.round(performance.now() - t0);
    const text = await res.text();
    const resHeaders = {};
    res.headers.forEach((v, k) => { resHeaders[k] = v; });
    const bytes = new TextEncoder().encode(text).length;
    S.response = { status: res.status, statusText: res.statusText, time: elapsed, size: bytes < 1024 ? bytes + ' B' : (bytes/1024).toFixed(1) + ' KB', body: text, headers: resHeaders };
  } catch(err) {
    S.response = { status: 0, statusText: 'Network Error', time: Math.round(performance.now()-t0), size: '—', body: String(err), headers: {}, error: true };
  } finally {
    S.loading = false; el.sendBtn.innerHTML = 'Send'; el.sendBtn.disabled = false;
    renderResponse();
  }
}

// ── Response ───────────────────────────────────────────────────────
function renderResponse() {
  const r = S.response;
  if (!r) {
    el.statusPill.textContent = ''; el.statusPill.className = 'status-pill';
    el.resTime.textContent = ''; el.resSize.textContent = '';
    el.copyBtn.classList.add('hidden');
    el.resEmpty.classList.remove('hidden'); el.resBody.classList.add('hidden');
    el.resHeadersList.innerHTML = '';
    el.resHeadersCount.style.display = 'none';
    return;
  }
  const sc = r.status;
  let cls = 'status-pill ';
  if (r.error||sc===0) cls+='status-err';
  else if(sc<300) cls+='status-2xx';
  else if(sc<400) cls+='status-3xx';
  else if(sc<500) cls+='status-4xx';
  else cls+='status-5xx';
  el.statusPill.className = cls;
  el.statusPill.textContent = r.error ? 'Error' : sc + ' ' + r.statusText;
  el.resTime.textContent = r.time + ' ms';
  el.resSize.textContent = r.size;
  el.copyBtn.classList.remove('hidden');
  el.resEmpty.classList.add('hidden'); el.resBody.classList.remove('hidden');

  try {
    const parsed = JSON.parse(r.body);
    el.resBody.innerHTML = '<pre class="json-body">' + syntaxHighlight(JSON.stringify(parsed, null, 2)) + '</pre>';
  } catch {
    el.resBody.innerHTML = '<pre class="raw-body">' + esc(r.body) + '</pre>';
  }

  const hEntries = Object.entries(r.headers);
  if (hEntries.length) {
    el.resHeadersCount.textContent = hEntries.length;
    el.resHeadersCount.style.display = 'inline-flex';
  } else {
    el.resHeadersCount.style.display = 'none';
  }
  el.resHeadersList.innerHTML = hEntries.map(([k,v]) =>
    \`<div class="res-header-row"><span class="res-header-key">\${esc(k)}</span><span class="res-header-val">\${esc(v)}</span></div>\`
  ).join('');
}

// ── Summary Panel ──────────────────────────────────────────────────
function renderSummary() {
  const panel = $('summary-panel');
  const empty = $('summary-empty');
  const content = $('summary-content');

  const copyBtn = $('summary-copy-btn');

  if (!S.selected) {
    panel.classList.remove('hidden');
    empty.style.display = 'flex';
    content.classList.add('hidden');
    copyBtn.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');
  empty.style.display = 'none';
  content.classList.remove('hidden');
  content.style.display = 'flex';
  copyBtn.classList.remove('hidden');

  const method = S.selected.method;
  const fullUrl = buildUrl();

  // Highlight path params in URL
  let urlHtml = esc(fullUrl);
  (S.selected.params || []).forEach(p => {
    const val = S.pathParams[p];
    if (val) urlHtml = urlHtml.replace(esc(encodeURIComponent(val)), \`<span class="url-path-param">\${esc(val)}</span>\`);
  });

  // Active query params
  const activeQuery = S.queryParams.filter(p => p.enabled && p.key);

  // Active headers (custom + auth)
  const activeHeaders = S.reqHeaders.filter(h => h.enabled && h.key);

  // Auth being used
  const effectiveAuth = S.auth.type !== 'none' ? S.auth : S.globalAuth;
  let authHtml = '';
  if (effectiveAuth.type === 'bearer') {
    const tok = effectiveAuth.bearerToken;
    authHtml = \`<div class="summary-auth-row">
      <svg class="summary-auth-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <span class="summary-auth-label">Bearer</span>
      <span class="summary-auth-val">\${tok ? tok.slice(0,24) + (tok.length > 24 ? '…' : '') : '<em>no token</em>'}</span>
      \${S.auth.type === 'none' ? '<span style="font-size:9px;color:var(--text-dim);margin-left:auto">global</span>' : ''}
    </div>\`;
  } else if (effectiveAuth.type === 'basic') {
    authHtml = \`<div class="summary-auth-row">
      <svg class="summary-auth-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span class="summary-auth-label">Basic</span>
      <span class="summary-auth-val">\${esc(effectiveAuth.basicUsername || '—')}</span>
    </div>\`;
  } else if (effectiveAuth.type === 'apikey') {
    authHtml = \`<div class="summary-auth-row">
      <svg class="summary-auth-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
      <span class="summary-auth-label">\${esc(effectiveAuth.apiKeyName)}</span>
      <span class="summary-auth-val">\${effectiveAuth.apiKeyIn === 'query' ? '(query)' : '(header)'}</span>
      \${S.auth.type === 'none' && S.globalAuth.type !== 'none' ? '<span style="font-size:9px;color:var(--text-dim);margin-left:auto">global</span>' : ''}
    </div>\`;
  } else {
    authHtml = '<span class="summary-none">No auth</span>';
  }

  // Body
  let bodyHtml = '';
  if (['POST','PUT','PATCH'].includes(method) && S.body.type !== 'none' && S.body.content) {
    const preview = S.body.content.slice(0, 200) + (S.body.content.length > 200 ? '…' : '');
    bodyHtml = \`<div class="summary-section">
      <div class="summary-section-label">Body <span style="font-weight:400;text-transform:none;color:var(--text-dim)">\${S.body.type}</span></div>
      <div class="summary-body-preview">\${esc(preview)}</div>
    </div>\`;
  }

  content.innerHTML = \`
    <!-- URL -->
    <div class="summary-section">
      <div class="summary-section-label">
        <span class="summary-method-pill method-\${method}" style="border-color:inherit">\${method}</span>
        Endpoint
      </div>
      <div class="summary-url">\${urlHtml}</div>
      \${S.selected.description ? \`<div style="font-size:11px;color:var(--text-muted);margin-top:5px;line-height:1.5">\${esc(S.selected.description)}</div>\` : ''}
    </div>

    <!-- Path params -->
    \${(S.selected.params || []).length ? \`<div class="summary-section">
      <div class="summary-section-label">Path Params</div>
      \${S.selected.params.map(p => \`<div class="summary-row">
        <span class="summary-key">:\${esc(p)}</span>
        <span class="summary-val">\${S.pathParams[p] ? esc(S.pathParams[p]) : '<em style="color:var(--del-fg)">empty</em>'}</span>
      </div>\`).join('')}
    </div>\` : ''}

    <!-- Query params -->
    <div class="summary-section">
      <div class="summary-section-label">Query Params</div>
      \${activeQuery.length
        ? activeQuery.map(p => \`<div class="summary-row">
            <span class="summary-key">\${esc(p.key)}</span>
            <span class="summary-val">\${esc(p.value)}</span>
          </div>\`).join('')
        : '<span class="summary-none">None</span>'}
    </div>

    <!-- Headers -->
    <div class="summary-section">
      <div class="summary-section-label">Headers</div>
      \${activeHeaders.length
        ? activeHeaders.map(h => \`<div class="summary-row">
            <span class="summary-key">\${esc(h.key)}</span>
            <span class="summary-val">\${esc(h.value)}</span>
          </div>\`).join('')
        : '<span class="summary-none">None</span>'}
    </div>

    <!-- Auth -->
    <div class="summary-section">
      <div class="summary-section-label">Auth</div>
      \${authHtml}
    </div>

    \${bodyHtml}

    \${renderDocFields('Body Schema', S.selected.body)}
    \${renderDocFields('Query Params', S.selected.query)}
    \${renderDocFields('Required Headers', S.selected.headers)}
    \${renderDocFields('Response', S.selected.response)}
  \`;
}

// ── Copy Summary ───────────────────────────────────────────────────
function copySummary() {
  if (!S.selected) return;
  const r = S.selected;
  const lines = [];

  lines.push(\`\${r.method} \${buildUrl()}\`);
  if (r.description) lines.push(\`\`, ...r.description.split('\\n').map(l => \`# \${l}\`));

  if (r.params?.length) {
    lines.push(\`\`, \`[Path Params]\`);
    r.params.forEach(p => lines.push(\`  \${p}: \${S.pathParams[p] || ''}\`));
  }

  const activeQuery = S.queryParams.filter(p => p.enabled && p.key);
  if (activeQuery.length) {
    lines.push(\`\`, \`[Query Params]\`);
    activeQuery.forEach(p => lines.push(\`  \${p.key}: \${p.value}\`));
  }

  if (r.query?.length) {
    lines.push(\`\`, \`[Query Schema]\`);
    r.query.forEach(f => lines.push(\`  \${f.name}: \${f.type}\${f.required ? ' (required)' : ''}\${f.rules?.length ? ' | ' + f.rules.join(', ') : ''}\${f.description ? ' — ' + f.description : ''}\`));
  }

  const activeHeaders = S.reqHeaders.filter(h => h.enabled && h.key);
  if (activeHeaders.length) {
    lines.push(\`\`, \`[Headers]\`);
    activeHeaders.forEach(h => lines.push(\`  \${h.key}: \${h.value}\`));
  }

  if (r.headers?.length) {
    lines.push(\`\`, \`[Required Headers]\`);
    r.headers.forEach(f => lines.push(\`  \${f.name}\${f.required ? ' (required)' : ''}\${f.description ? ' — ' + f.description : ''}\`));
  }

  if (r.body?.length) {
    lines.push(\`\`, \`[Body Schema]\`);
    r.body.forEach(f => lines.push(\`  \${f.name}: \${f.type}\${f.required ? ' (required)' : ' (optional)'}\${f.rules?.length ? ' | ' + f.rules.join(', ') : ''}\${f.description ? ' — ' + f.description : ''}\`));
  }

  if (['POST','PUT','PATCH'].includes(r.method) && S.body.type !== 'none' && S.body.content) {
    lines.push(\`\`, \`[Body Content (\${S.body.type})]\`, S.body.content);
  }

  if (r.response?.length) {
    lines.push(\`\`, \`[Response Schema]\`);
    r.response.forEach(f => lines.push(\`  \${f.name}: \${f.type}\${f.description ? ' — ' + f.description : ''}\`));
  }

  navigator.clipboard.writeText(lines.join('\\n')).then(() => {
    const btn = $('summary-copy-btn');
    const label = $('summary-copy-label');
    btn.classList.add('copied');
    label.textContent = 'Copied!';
    setTimeout(() => { btn.classList.remove('copied'); label.textContent = 'Copy'; }, 1800);
  });
}

// Render a list of DocField items (body/query/headers/response) in the summary panel
function renderDocFields(label, fields) {
  if (!fields || fields.length === 0) return '';
  return \`<div class="summary-section">
    <div class="summary-section-label">\${label}</div>
    \${fields.map(f => {
      const typeTag  = f.type    ? \`<span class="df-type">\${esc(f.type)}</span>\` : '';
      const reqTag   = f.required ? '<span class="df-req">required</span>' : '<span class="df-opt">optional</span>';
      const rulesTxt = f.rules?.length ? \`<span class="df-rules">\${esc(f.rules.join(' · '))}</span>\` : '';
      const descTxt  = f.description ? \`<span class="df-desc">\${esc(f.description)}</span>\` : '';
      return \`<div class="df-row">
        <div class="df-top">
          <span class="df-name">\${esc(f.name)}</span>
          \${typeTag}\${reqTag}\${rulesTxt}
        </div>
        \${descTxt ? \`<div class="df-bottom">\${descTxt}</div>\` : ''}
      </div>\`;
    }).join('')}
  </div>\`;
}

function syntaxHighlight(json) {
  return json.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/("(?:\\\\u[\\da-fA-F]{4}|\\\\[^u]|[^\\\\\\"])*"(?:\\s*:)?|\\b(?:true|false|null)\\b|-?\\d+(?:\\.\\d+)?(?:[eE][+\\-]?\\d+)?)/g, m => {
      let c = 'json-number';
      if(/^"/.test(m)) c = /:$/.test(m) ? 'json-key' : 'json-string';
      else if(/true|false/.test(m)) c = 'json-boolean';
      else if(/null/.test(m)) c = 'json-null';
      return \`<span class="\${c}">\${m}</span>\`;
    });
}

function esc(s) {
  return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Tabs ───────────────────────────────────────────────────────────
function initTabs(barEl, prefix) {
  barEl.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      barEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      if (prefix === 'req') {
        document.querySelectorAll('#req-panel-inner .tab-panel').forEach(p => p.classList.remove('active'));
        const panel = $('tab-' + tab);
        if (panel) panel.classList.add('active');
      } else {
        $('res-body-panel').classList.toggle('hidden', tab !== 'body');
        $('res-headers-panel').classList.toggle('hidden', tab !== 'headers');
      }
    });
  });
}

// ── Resize ─────────────────────────────────────────────────────────
function initPanelResize() {
  let drag=false, startY=0, startH=0;
  el.resizeHandle.addEventListener('mousedown', e => {
    drag=true; startY=e.clientY; startH=el.reqPanel.offsetHeight;
    el.resizeHandle.classList.add('dragging');
    document.body.style.cssText += ';cursor:row-resize;user-select:none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if(!drag) return;
    const maxH = el.panels.offsetHeight - 148;
    const h = Math.max(120, Math.min(startH + e.clientY - startY, maxH));
    el.reqPanel.style.flex = '0 0 ' + h + 'px';
  });
  document.addEventListener('mouseup', () => {
    if(!drag) return; drag=false;
    el.resizeHandle.classList.remove('dragging');
    document.body.style.cursor=''; document.body.style.userSelect='';
  });
}

function initSidebarResize() {
  let drag=false, startX=0, startW=0;
  el.sidebarResize.addEventListener('mousedown', e => {
    drag=true; startX=e.clientX; startW=el.sidebar.offsetWidth;
    el.sidebarResize.classList.add('dragging');
    document.body.style.cssText += 'cursor:col-resize;user-select:none';
  });
  document.addEventListener('mousemove', e => {
    if(!drag) return;
    el.sidebar.style.width = Math.max(160, Math.min(startW + e.clientX - startX, 480)) + 'px';
  });
  document.addEventListener('mouseup', () => {
    if(!drag) return; drag=false;
    el.sidebarResize.classList.remove('dragging');
    document.body.style.cursor=''; document.body.style.userSelect='';
  });
}

// ── Events ─────────────────────────────────────────────────────────
function bindEvents() {
  el.reloadBtn.addEventListener('click', loadRoutes);
  el.search.addEventListener('input', () => { applyFilter(); renderRouteList(); });

  // ── Global Auth ──
  const gauthBtn    = $('global-auth-btn');
  const gauthDrop   = $('global-auth-dropdown');
  const gauthBadge  = $('gauth-active-badge');
  const gauthBearer = $('gauth-bearer-token');
  const gauthKeyName= $('gauth-apikey-name');
  const gauthKeyVal = $('gauth-apikey-value');
  const gauthKeyIn  = $('gauth-apikey-in');

  gauthBtn.addEventListener('click', e => {
    e.stopPropagation();
    gauthDrop.classList.toggle('hidden');
    gauthBtn.classList.toggle('active', !gauthDrop.classList.contains('hidden'));
  });
  document.addEventListener('click', e => {
    if (!gauthDrop.contains(e.target) && e.target !== gauthBtn) {
      gauthDrop.classList.add('hidden');
      gauthBtn.classList.remove('active');
    }
  });

  document.querySelectorAll('.gauth-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gauth-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const t = btn.dataset.gauth;
      ['none','bearer','apikey'].forEach(x => $('gauth-'+x+'-panel').classList.toggle('hidden', x !== t));
    });
  });

  $('gauth-save-btn').addEventListener('click', () => {
    const activeBtn = document.querySelector('.gauth-type-btn.active');
    const type = activeBtn ? activeBtn.dataset.gauth : 'none';
    S.globalAuth = {
      type,
      bearerToken: gauthBearer.value,
      apiKeyName: gauthKeyName.value || 'X-API-Key',
      apiKeyValue: gauthKeyVal.value,
      apiKeyIn: gauthKeyIn.value,
    };
    const isActive = type !== 'none' && (S.globalAuth.bearerToken || S.globalAuth.apiKeyValue);
    gauthBadge.classList.toggle('hidden', !isActive);
    gauthBtn.classList.toggle('active', isActive);
    // Show dot indicator
    const dot = gauthBtn.querySelector('.dot');
    if (isActive && !dot) {
      const d = document.createElement('span'); d.className = 'dot';
      gauthBtn.appendChild(d);
    } else if (!isActive && dot) dot.remove();
    gauthDrop.classList.add('hidden');
    renderUrlBar(); renderSummary();
  });

  $('gauth-clear-btn').addEventListener('click', () => {
    S.globalAuth = { type: 'none', bearerToken: '', apiKeyName: 'X-API-Key', apiKeyValue: '', apiKeyIn: 'header' };
    document.querySelectorAll('.gauth-type-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-gauth="none"]').classList.add('active');
    ['none','bearer','apikey'].forEach(x => $('gauth-'+x+'-panel').classList.toggle('hidden', x !== 'none'));
    gauthBearer.value = ''; gauthKeyVal.value = '';
    gauthBadge.classList.add('hidden');
    gauthBtn.classList.remove('active');
    gauthBtn.querySelector('.dot')?.remove();
    renderUrlBar();
  });
  el.baseUrl.addEventListener('input', () => { renderUrlBar(); renderSummary(); });
  el.sendBtn.addEventListener('click', sendRequest);

  $('summary-copy-btn').addEventListener('click', copySummary);

  el.addQueryBtn.addEventListener('click', () => {
    S.queryParams.push({ id: uid(), key: '', value: '', enabled: true });
    renderQueryParams();
  });
  el.addHeaderBtn.addEventListener('click', () => {
    S.reqHeaders.push({ id: uid(), key: '', value: '', enabled: true });
    renderReqHeaders();
  });

  document.querySelectorAll('.auth-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.auth-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); S.auth.type = btn.dataset.auth;
      ['none','bearer','basic','apikey'].forEach(t => {
        $('auth-'+t+'-panel').classList.toggle('hidden', t !== S.auth.type);
      });
    });
  });
  el.bearerToken.addEventListener('input', () => { S.auth.bearerToken = el.bearerToken.value; });
  el.basicUsername.addEventListener('input', () => { S.auth.basicUsername = el.basicUsername.value; });
  el.basicPassword.addEventListener('input', () => { S.auth.basicPassword = el.basicPassword.value; });
  el.apikeyName.addEventListener('input', () => { S.auth.apiKeyName = el.apikeyName.value; });
  el.apikeyValue.addEventListener('input', () => { S.auth.apiKeyValue = el.apikeyValue.value; });
  el.apikeyIn.addEventListener('change', () => { S.auth.apiKeyIn = el.apikeyIn.value; renderUrlBar(); });

  document.querySelectorAll('.body-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.body-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); S.body.type = btn.dataset.body;
      const show = S.body.type !== 'none';
      el.bodyEditorWrap.classList.toggle('hidden', !show);
      el.bodyNoneMsg.classList.toggle('hidden', show);
      el.formatBtn.style.display = S.body.type === 'json' ? '' : 'none';
    });
  });
  el.bodyEditor.addEventListener('input', () => { S.body.content = el.bodyEditor.value; renderSummary(); });
  el.formatBtn.addEventListener('click', () => {
    try {
      el.bodyEditor.value = JSON.stringify(JSON.parse(el.bodyEditor.value), null, 2);
      S.body.content = el.bodyEditor.value;
    } catch {
      el.bodyEditor.style.borderColor = '#ef4444';
      setTimeout(() => { el.bodyEditor.style.borderColor = ''; }, 800);
    }
  });
  el.copyBtn.addEventListener('click', () => {
    if (!S.response) return;
    navigator.clipboard.writeText(S.response.body).then(() => {
      const o = el.copyBtn.innerHTML;
      el.copyBtn.textContent = '✓ Copied';
      setTimeout(() => { el.copyBtn.innerHTML = o; }, 1500);
    });
  });

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !el.sendBtn.disabled) sendRequest();
  });

  initTabs(el.reqTabBar, 'req');
  initTabs(el.resTabBar, 'res');
  initPanelResize();
  initSidebarResize();
}

init();
</script>
</body>
</html>`;
}
//# sourceMappingURL=api-explorer.html.js.map