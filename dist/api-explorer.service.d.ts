import { RouteDoc, DocField } from './api-docs-parser';
export declare const API_EXPLORER_DOCS_FILE = "API_EXPLORER_DOCS_FILE";
export { DocField, RouteDoc };
export interface RouteInfo {
    method: string;
    path: string;
    params: string[];
    group: string;
    description: string;
    body: DocField[];
    query: DocField[];
    headers: DocField[];
    response: DocField[];
}
export declare class ApiExplorerService {
    private readonly docsFile;
    private _docsMap;
    constructor(docsFile: string | null);
    getRoutes(expressApp: any): RouteInfo[];
    private scanApp;
    private traverseStack;
    private joinPaths;
    private extractPathFromLayer;
    private extractParams;
}
//# sourceMappingURL=api-explorer.service.d.ts.map