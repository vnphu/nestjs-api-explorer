import { ResolvedApiExplorerOptions } from './api-explorer.module';
import { ApiExplorerService } from './api-explorer.service';
/**
 * Creates an ApiExplorer controller bound to the given path at runtime.
 * Using a factory lets us set @Controller(path) dynamically from options
 * without requiring decorators at compile time.
 */
export declare function createApiExplorerController(explorerPath: string): {
    new (service: ApiExplorerService, options: ResolvedApiExplorerOptions): {
        readonly service: ApiExplorerService;
        readonly options: ResolvedApiExplorerOptions;
        getUi(res: any): void;
        getRoutes(req: any): import("./api-explorer.service").RouteInfo[];
    };
};
//# sourceMappingURL=api-explorer.controller.d.ts.map