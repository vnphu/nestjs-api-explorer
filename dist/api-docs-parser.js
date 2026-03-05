"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDocsFile = parseDocsFile;
exports.parseDocsFolder = parseDocsFolder;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const KNOWN_TYPES = new Set(['string', 'number', 'boolean', 'array', 'object']);
/**
 * Rule tokens are either:
 *   - bare keywords: required, isEmail, isUrl, isInt, isFloat, isDate,
 *                    isBoolean, isString, isNumber, isArray, isObject, isUUID,
 *                    isAlpha, isAlphanumeric, isNotEmpty
 *   - parameterized: minLength(n), maxLength(n), min(n), max(n),
 *                    default(val), isIn(a,b,c), matches(regex)
 */
const RULE_RE = /^(required|isEmail|isUrl|isInt|isFloat|isDate|isBoolean|isString|isNumber|isArray|isObject|isUUID|isAlpha|isAlphanumeric|isNotEmpty|minLength\([^)]+\)|maxLength\([^)]+\)|min\([^)]+\)|max\([^)]+\)|default\([^)]+\)|isIn\([^)]+\)|matches\([^)]+\))$/i;
/**
 * Split a comma-separated string while respecting parentheses.
 * e.g.  "string, required, isIn(a,b,c), some description"
 *   →   ["string", "required", "isIn(a,b,c)", "some description"]
 */
function splitTokens(raw) {
    const tokens = [];
    let current = '';
    let depth = 0;
    for (const ch of raw) {
        if (ch === '(') {
            depth++;
            current += ch;
        }
        else if (ch === ')') {
            depth--;
            current += ch;
        }
        else if (ch === ',' && depth === 0) {
            tokens.push(current.trim());
            current = '';
        }
        else {
            current += ch;
        }
    }
    if (current.trim())
        tokens.push(current.trim());
    return tokens.filter(Boolean);
}
/**
 * Parse one field line into a DocField.
 *
 * Format:  <name>: [type,] [rules...,] [description...]
 *
 * Examples:
 *   email: string, required, isEmail
 *   password: string, required, minLength(6), mật khẩu tối thiểu 6 ký tự
 *   role: string, isIn(admin,user,guest)
 *   page: number, default(1)
 *   tags: array
 *   meta: object
 *   Authorization: required, Bearer token
 */
function parseField(line) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes(':'))
        return null;
    const colonIdx = trimmed.indexOf(':');
    const name = trimmed.slice(0, colonIdx).trim();
    const rest = trimmed.slice(colonIdx + 1).trim();
    if (!name)
        return null;
    const tokens = splitTokens(rest);
    let type = '';
    let required = false;
    const rules = [];
    const descParts = [];
    let isFirst = true;
    for (const token of tokens) {
        const t = token.trim();
        if (!t)
            continue;
        // First token may be a type declaration
        if (isFirst) {
            isFirst = false;
            if (KNOWN_TYPES.has(t.toLowerCase())) {
                type = t.toLowerCase();
                continue;
            }
        }
        if (t.toLowerCase() === 'required') {
            required = true;
        }
        else if (RULE_RE.test(t)) {
            rules.push(t);
        }
        else {
            descParts.push(t);
        }
    }
    return {
        name,
        type,
        required,
        rules,
        description: descParts.join(', '),
    };
}
/**
 * Parse a full docs file (absolute path) into a map of
 * `"METHOD:path"` → RouteDoc.
 */
function parseDocsFile(filePath) {
    const map = new Map();
    let raw;
    try {
        const resolved = path.isAbsolute(filePath)
            ? filePath
            : path.resolve(process.cwd(), filePath);
        raw = fs.readFileSync(resolved, 'utf-8');
    }
    catch {
        return map;
    }
    const lines = raw.split(/\r?\n/);
    let currentGroup = '';
    let currentRoute = null;
    let currentSection = null;
    const flush = () => {
        if (!currentRoute)
            return;
        map.set(`${currentRoute.method}:${currentRoute.path}`, currentRoute);
        currentRoute = null;
        currentSection = null;
    };
    for (const rawLine of lines) {
        // ── Group heading  # Group Name ──────────────────────────────
        if (/^#\s+/.test(rawLine) && !/^##\s+/.test(rawLine)) {
            flush();
            currentGroup = rawLine.replace(/^#\s+/, '').trim();
            continue;
        }
        // ── Route heading  ## METHOD /path ───────────────────────────
        const routeMatch = rawLine.match(/^##\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\s+(\/\S*)/i);
        if (routeMatch) {
            flush();
            currentRoute = {
                method: routeMatch[1].toUpperCase(),
                path: routeMatch[2],
                group: currentGroup,
                description: '',
                body: [],
                query: [],
                params: [],
                headers: [],
                response: [],
            };
            currentSection = null;
            continue;
        }
        if (!currentRoute)
            continue;
        // ── Description lines  > text ─────────────────────────────────
        if (/^>\s*/.test(rawLine)) {
            const desc = rawLine.replace(/^>\s*/, '').trim();
            currentRoute.description = currentRoute.description
                ? currentRoute.description + '\n' + desc
                : desc;
            continue;
        }
        // ── Section headers  body: / query: / params: / headers: / response: ──
        if (/^body:\s*$/.test(rawLine.trim())) {
            currentSection = 'body';
            continue;
        }
        if (/^query:\s*$/.test(rawLine.trim())) {
            currentSection = 'query';
            continue;
        }
        if (/^params:\s*$/.test(rawLine.trim())) {
            currentSection = 'params';
            continue;
        }
        if (/^headers:\s*$/.test(rawLine.trim())) {
            currentSection = 'headers';
            continue;
        }
        if (/^response:\s*$/.test(rawLine.trim())) {
            currentSection = 'response';
            continue;
        }
        // ── Separator / blank / comments — skip ──────────────────────
        if (/^---/.test(rawLine.trim()) || rawLine.trim() === '')
            continue;
        // ── Field lines  (indented or starts with content) ────────────
        if (currentSection && rawLine.match(/^\s+\S/)) {
            const field = parseField(rawLine);
            if (field)
                currentRoute[currentSection].push(field);
        }
    }
    flush();
    return map;
}
/**
 * Recursively collect all `.md` files under a directory.
 */
function collectMdFiles(dir) {
    const results = [];
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    }
    catch {
        return results;
    }
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...collectMdFiles(full));
        }
        else if (entry.isFile() && entry.name.endsWith('.md')) {
            results.push(full);
        }
    }
    return results;
}
/**
 * Parse all `.md` files inside a folder (recursively) and merge into one map.
 */
function parseDocsFolder(folderPath) {
    const resolved = path.isAbsolute(folderPath)
        ? folderPath
        : path.resolve(process.cwd(), folderPath);
    const merged = new Map();
    for (const file of collectMdFiles(resolved)) {
        const fileMap = parseDocsFile(file);
        fileMap.forEach((doc, key) => merged.set(key, doc));
    }
    return merged;
}
//# sourceMappingURL=api-docs-parser.js.map