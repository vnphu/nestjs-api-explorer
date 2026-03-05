import { DynamicModule } from '@nestjs/common';
export interface ApiExplorerOptions {
    /**
     * URL path to serve the explorer UI.
     * @default 'api-explorer'
     */
    path?: string;
    /**
     * Title shown in browser tab and UI header.
     * @default 'API Explorer'
     */
    title?: string;
    /**
     * Path to the markdown docs file that describes your API routes.
     * Can be absolute or relative to process.cwd().
     *
     * @example './api-explorer.md'
     * @example '/app/docs/api.md'
     */
    docsFile?: string;
    /**
     * Path to a folder containing markdown docs files (scanned recursively).
     * All `.md` files found will be merged together.
     * Can be absolute or relative to process.cwd().
     *
     * @example './docs'
     * @example '/app/docs/api'
     */
    docsFolder?: string;
    /**
     * Explicitly enable or disable the explorer.
     * The explorer is automatically disabled when NODE_ENV === 'production'.
     * @default true
     */
    enabled?: boolean;
}
export interface ResolvedApiExplorerOptions {
    path: string;
    title: string;
    docsFile: string | null;
    docsFolder: string | null;
    enabled: boolean;
}
export declare const API_EXPLORER_OPTIONS = "API_EXPLORER_OPTIONS";
export declare class ApiExplorerModule {
    static register(options?: ApiExplorerOptions): DynamicModule;
}
//# sourceMappingURL=api-explorer.module.d.ts.map