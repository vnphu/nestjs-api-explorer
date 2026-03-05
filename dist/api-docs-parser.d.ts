export interface DocField {
    name: string;
    type: string;
    required: boolean;
    rules: string[];
    description: string;
}
export interface RouteDoc {
    method: string;
    path: string;
    group: string;
    description: string;
    body: DocField[];
    query: DocField[];
    params: DocField[];
    headers: DocField[];
    response: DocField[];
}
/**
 * Parse a full docs file (absolute path) into a map of
 * `"METHOD:path"` → RouteDoc.
 */
export declare function parseDocsFile(filePath: string): Map<string, RouteDoc>;
//# sourceMappingURL=api-docs-parser.d.ts.map