"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ApiExplorerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiExplorerModule = exports.API_EXPLORER_OPTIONS = void 0;
const common_1 = require("@nestjs/common");
const api_explorer_controller_1 = require("./api-explorer.controller");
const api_explorer_service_1 = require("./api-explorer.service");
const DEFAULTS = {
    path: 'api-explorer',
    title: 'API Explorer',
    docsFile: null,
    docsFolder: null,
    enabled: true,
};
exports.API_EXPLORER_OPTIONS = 'API_EXPLORER_OPTIONS';
let ApiExplorerModule = ApiExplorerModule_1 = class ApiExplorerModule {
    static register(options = {}) {
        const isProduction = process.env.NODE_ENV === 'production';
        const resolved = {
            ...DEFAULTS,
            ...options,
            docsFile: options.docsFile ?? null,
            docsFolder: options.docsFolder ?? null,
        };
        if (!resolved.enabled || isProduction) {
            return { module: ApiExplorerModule_1 };
        }
        const controller = (0, api_explorer_controller_1.createApiExplorerController)(resolved.path);
        return {
            module: ApiExplorerModule_1,
            controllers: [controller],
            providers: [
                api_explorer_service_1.ApiExplorerService,
                {
                    provide: exports.API_EXPLORER_OPTIONS,
                    useValue: resolved,
                },
                {
                    provide: api_explorer_service_1.API_EXPLORER_DOCS_FILE,
                    useValue: resolved.docsFile,
                },
                {
                    provide: api_explorer_service_1.API_EXPLORER_DOCS_FOLDER,
                    useValue: resolved.docsFolder,
                },
            ],
            exports: [api_explorer_service_1.ApiExplorerService],
        };
    }
};
exports.ApiExplorerModule = ApiExplorerModule;
exports.ApiExplorerModule = ApiExplorerModule = ApiExplorerModule_1 = __decorate([
    (0, common_1.Module)({})
], ApiExplorerModule);
//# sourceMappingURL=api-explorer.module.js.map