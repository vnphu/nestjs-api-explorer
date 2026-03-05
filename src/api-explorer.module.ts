import { DynamicModule, Module } from '@nestjs/common';
import { createApiExplorerController } from './api-explorer.controller';
import { ApiExplorerService, API_EXPLORER_DOCS_FILE, API_EXPLORER_DOCS_FOLDER } from './api-explorer.service';

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

const DEFAULTS: ResolvedApiExplorerOptions = {
  path: 'api-explorer',
  title: 'API Explorer',
  docsFile: null,
  docsFolder: null,
  enabled: true,
};

export const API_EXPLORER_OPTIONS = 'API_EXPLORER_OPTIONS';

@Module({})
export class ApiExplorerModule {
  static register(options: ApiExplorerOptions = {}): DynamicModule {
    const isProduction = process.env.NODE_ENV === 'production';
    const resolved: ResolvedApiExplorerOptions = {
      ...DEFAULTS,
      ...options,
      docsFile: options.docsFile ?? null,
      docsFolder: options.docsFolder ?? null,
    };

    if (!resolved.enabled || isProduction) {
      return { module: ApiExplorerModule };
    }

    const controller = createApiExplorerController(resolved.path);

    return {
      module: ApiExplorerModule,
      controllers: [controller],
      providers: [
        ApiExplorerService,
        {
          provide: API_EXPLORER_OPTIONS,
          useValue: resolved,
        },
        {
          provide: API_EXPLORER_DOCS_FILE,
          useValue: resolved.docsFile,
        },
        {
          provide: API_EXPLORER_DOCS_FOLDER,
          useValue: resolved.docsFolder,
        },
      ],
      exports: [ApiExplorerService],
    };
  }
}
