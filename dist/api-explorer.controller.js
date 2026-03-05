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
exports.createApiExplorerController = createApiExplorerController;
const common_1 = require("@nestjs/common");
const api_explorer_module_1 = require("./api-explorer.module");
const api_explorer_service_1 = require("./api-explorer.service");
const api_explorer_html_1 = require("./api-explorer.html");
/**
 * Creates an ApiExplorer controller bound to the given path at runtime.
 * Using a factory lets us set @Controller(path) dynamically from options
 * without requiring decorators at compile time.
 */
function createApiExplorerController(explorerPath) {
    let ApiExplorerController = class ApiExplorerController {
        constructor(service, options) {
            this.service = service;
            this.options = options;
        }
        getUi(res) {
            const html = (0, api_explorer_html_1.getExplorerHtml)(this.options);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(html);
        }
        getRoutes(req) {
            return this.service.getRoutes(req.app);
        }
    };
    __decorate([
        (0, common_1.Get)(),
        __param(0, (0, common_1.Res)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ApiExplorerController.prototype, "getUi", null);
    __decorate([
        (0, common_1.Get)('routes'),
        __param(0, (0, common_1.Req)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ApiExplorerController.prototype, "getRoutes", null);
    ApiExplorerController = __decorate([
        (0, common_1.Controller)(explorerPath),
        __param(1, (0, common_1.Inject)(api_explorer_module_1.API_EXPLORER_OPTIONS)),
        __metadata("design:paramtypes", [api_explorer_service_1.ApiExplorerService, Object])
    ], ApiExplorerController);
    return ApiExplorerController;
}
//# sourceMappingURL=api-explorer.controller.js.map