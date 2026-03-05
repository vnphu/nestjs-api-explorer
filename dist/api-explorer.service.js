"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiExplorerService = exports.API_EXPLORER_DOCS_FOLDER = exports.API_EXPLORER_DOCS_FILE = void 0;
const common_1 = require("@nestjs/common");
const api_docs_parser_1 = require("./api-docs-parser");
exports.API_EXPLORER_DOCS_FILE = 'API_EXPLORER_DOCS_FILE';
exports.API_EXPLORER_DOCS_FOLDER = 'API_EXPLORER_DOCS_FOLDER';
let ApiExplorerService = class ApiExplorerService {
    constructor(docsFile, docsFolder) {
        this.docsFile = docsFile;
        this.docsFolder = docsFolder;
        this._docsMap = null;
    }
    getRoutes(expressApp) {
        // Lazy-load docs once
        if (this._docsMap === null) {
            if (this.docsFolder) {
                this._docsMap = (0, api_docs_parser_1.parseDocsFolder)(this.docsFolder);
            }
            else if (this.docsFile) {
                this._docsMap = (0, api_docs_parser_1.parseDocsFile)(this.docsFile);
            }
            else {
                this._docsMap = new Map();
            }
        }
        const routes = this.scanApp(expressApp);
        return routes.map((r) => {
            const doc = this._docsMap.get(`${r.method}:${r.path}`);
            return {
                ...r,
                group: doc?.group ?? '',
                description: doc?.description ?? '',
                body: doc?.body ?? [],
                query: doc?.query ?? [],
                headers: doc?.headers ?? [],
                response: doc?.response ?? [],
            };
        });
    }
    // ── Express route scanning ──────────────────────────────────────
    scanApp(app) {
        if (!app)
            return [];
        const router = app._router || app.router;
        if (!router?.stack)
            return [];
        const routes = [];
        this.traverseStack(router.stack, '', routes);
        const seen = new Set();
        return routes
            .filter((r) => {
            const key = `${r.method}:${r.path}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        })
            .sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
    }
    traverseStack(stack, prefix, out) {
        for (const layer of stack) {
            if (layer.route) {
                const fullPath = this.joinPaths(prefix, layer.route.path);
                const methods = Object.keys(layer.route.methods)
                    .filter((m) => m !== '_all' && layer.route.methods[m])
                    .map((m) => m.toUpperCase());
                for (const method of methods) {
                    out.push({ method, path: fullPath, params: this.extractParams(fullPath) });
                }
            }
            else if (layer.handle?.stack) {
                const layerPath = this.extractPathFromLayer(layer);
                this.traverseStack(layer.handle.stack, prefix + layerPath, out);
            }
        }
    }
    joinPaths(base, segment) {
        if (!segment || segment === '/')
            return base || '/';
        const b = base.endsWith('/') ? base.slice(0, -1) : base;
        const s = segment.startsWith('/') ? segment : '/' + segment;
        return b + s;
    }
    extractPathFromLayer(layer) {
        if (!layer.regexp)
            return '';
        const source = layer.regexp.source;
        if (['^\\\/(?=\\\/|$)', '^\\\\/?(?=\\\/|$)', '^\\\\/'].includes(source))
            return '';
        const match = source.match(/^\^\\\/(.+?)(?:\\\/?)?(?:\(\?=\\\/\|\\\$\))?$/i);
        if (match) {
            return '/' + match[1].replace(/\\\//g, '/').replace(/\\/g, '').replace(/\?.*$/, '');
        }
        return '';
    }
    extractParams(path) {
        return (path.match(/:([^/]+)/g) ?? []).map((p) => p.slice(1));
    }
};
exports.ApiExplorerService = ApiExplorerService;
exports.ApiExplorerService = ApiExplorerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(exports.API_EXPLORER_DOCS_FILE)),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)(exports.API_EXPLORER_DOCS_FOLDER)),
    __metadata("design:paramtypes", [Object, Object])
], ApiExplorerService);
//# sourceMappingURL=api-explorer.service.js.map