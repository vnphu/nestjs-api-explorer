import { Injectable, Inject, Optional } from '@nestjs/common';
import { parseDocsFile, RouteDoc, DocField } from './api-docs-parser';

export const API_EXPLORER_DOCS_FILE = 'API_EXPLORER_DOCS_FILE';

export { DocField, RouteDoc };

export interface RouteInfo {
  method: string;
  path: string;
  params: string[];      // path params extracted from :param segments
  group: string;
  description: string;
  body: DocField[];
  query: DocField[];
  headers: DocField[];
  response: DocField[];
}

@Injectable()
export class ApiExplorerService {
  private _docsMap: Map<string, RouteDoc> | null = null;

  constructor(
    @Optional() @Inject(API_EXPLORER_DOCS_FILE)
    private readonly docsFile: string | null,
  ) {}

  getRoutes(expressApp: any): RouteInfo[] {
    // Lazy-load docs file once
    if (this._docsMap === null) {
      this._docsMap = this.docsFile ? parseDocsFile(this.docsFile) : new Map();
    }

    const routes = this.scanApp(expressApp);

    return routes.map((r) => {
      const doc = this._docsMap!.get(`${r.method}:${r.path}`);
      return {
        ...r,
        group:       doc?.group       ?? '',
        description: doc?.description ?? '',
        body:        doc?.body        ?? [],
        query:       doc?.query       ?? [],
        headers:     doc?.headers     ?? [],
        response:    doc?.response    ?? [],
      };
    });
  }

  // ── Express route scanning ──────────────────────────────────────

  private scanApp(app: any): Omit<RouteInfo, 'group' | 'description' | 'body' | 'query' | 'headers' | 'response'>[] {
    if (!app) return [];
    const router = app._router || app.router;
    if (!router?.stack) return [];

    const routes: Omit<RouteInfo, 'group' | 'description' | 'body' | 'query' | 'headers' | 'response'>[] = [];
    this.traverseStack(router.stack, '', routes);

    const seen = new Set<string>();
    return routes
      .filter((r) => {
        const key = `${r.method}:${r.path}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
  }

  private traverseStack(stack: any[], prefix: string, out: any[]): void {
    for (const layer of stack) {
      if (layer.route) {
        const fullPath = this.joinPaths(prefix, layer.route.path as string);
        const methods: string[] = Object.keys(layer.route.methods)
          .filter((m) => m !== '_all' && layer.route.methods[m])
          .map((m) => m.toUpperCase());
        for (const method of methods) {
          out.push({ method, path: fullPath, params: this.extractParams(fullPath) });
        }
      } else if (layer.handle?.stack) {
        const layerPath = this.extractPathFromLayer(layer);
        this.traverseStack(layer.handle.stack, prefix + layerPath, out);
      }
    }
  }

  private joinPaths(base: string, segment: string): string {
    if (!segment || segment === '/') return base || '/';
    const b = base.endsWith('/') ? base.slice(0, -1) : base;
    const s = segment.startsWith('/') ? segment : '/' + segment;
    return b + s;
  }

  private extractPathFromLayer(layer: any): string {
    if (!layer.regexp) return '';
    const source: string = layer.regexp.source;
    if (['^\\\/(?=\\\/|$)', '^\\\\/?(?=\\\/|$)', '^\\\\/'].includes(source)) return '';
    const match = source.match(/^\^\\\/(.+?)(?:\\\/?)?(?:\(\?=\\\/\|\\\$\))?$/i);
    if (match) {
      return '/' + match[1].replace(/\\\//g, '/').replace(/\\/g, '').replace(/\?.*$/, '');
    }
    return '';
  }

  private extractParams(path: string): string[] {
    return (path.match(/:([^/]+)/g) ?? []).map((p) => p.slice(1));
  }
}
