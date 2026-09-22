import type { DynamicModule } from '@galaxy-stack/orbit-core';
import { I18nService, type I18nOptions } from './i18n.service';

export const I18N_OPTIONS = Symbol('I18N_OPTIONS');
export const I18N_SERVICE = Symbol('I18N_SERVICE');

export class I18nModule {
  static forRoot(options: I18nOptions): DynamicModule {
    return {
      module: I18nModule,
      global: true,
      providers: [
        { provide: I18N_OPTIONS, useValue: options },
        {
          provide: I18N_SERVICE,
          useFactory: (opts: I18nOptions) => new I18nService(opts),
          inject: [I18N_OPTIONS],
        },
        { provide: I18nService, useExisting: I18N_SERVICE },
      ],
      exports: [I18N_SERVICE, I18nService, I18N_OPTIONS],
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<I18nOptions> | I18nOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: I18nModule,
      global: true,
      providers: [
        { provide: I18N_OPTIONS, useFactory: options.useFactory, inject: options.inject ?? [] },
        {
          provide: I18N_SERVICE,
          useFactory: (opts: I18nOptions) => new I18nService(opts),
          inject: [I18N_OPTIONS],
        },
        { provide: I18nService, useExisting: I18N_SERVICE },
      ],
      exports: [I18N_SERVICE, I18nService, I18N_OPTIONS],
    };
  }
}

export { I18nService };
export type { I18nOptions };
