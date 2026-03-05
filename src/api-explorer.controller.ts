import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import { API_EXPLORER_OPTIONS, ResolvedApiExplorerOptions } from './api-explorer.module';
import { ApiExplorerService } from './api-explorer.service';
import { getExplorerHtml } from './api-explorer.html';

/**
 * Creates an ApiExplorer controller bound to the given path at runtime.
 * Using a factory lets us set @Controller(path) dynamically from options
 * without requiring decorators at compile time.
 */
export function createApiExplorerController(explorerPath: string) {
  @Controller(explorerPath)
  class ApiExplorerController {
    constructor(
      public readonly service: ApiExplorerService,
      @Inject(API_EXPLORER_OPTIONS)
      public readonly options: ResolvedApiExplorerOptions,
    ) {}

    @Get()
    getUi(@Res() res: any): void {
      const html = getExplorerHtml(this.options);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    }

    @Get('routes')
    getRoutes(@Req() req: any) {
      return this.service.getRoutes(req.app);
    }
  }

  return ApiExplorerController;
}
