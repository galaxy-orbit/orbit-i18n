export type TranslationTree = { [key: string]: string | TranslationTree };

export interface I18nOptions {
  translations: { [locale: string]: { [key: string]: any } };
  defaultLocale: string;
  fallbackLocale?: string;
  interpolation?: { start?: string; end?: string };
}

export class I18nService {
  private translations: Record<string, Record<string, any>>;
  private defaultLocale: string;
  private fallbackLocale?: string;
  private start: string;
  private end: string;

  constructor(options: I18nOptions) {
    this.translations = options.translations;
    this.defaultLocale = options.defaultLocale;
    this.fallbackLocale = options.fallbackLocale;
    this.start = options.interpolation?.start ?? '{';
    this.end = options.interpolation?.end ?? '}';
  }

  t(key: string, params?: Record<string, any>, locale?: string): string {
    const loc = locale ?? this.defaultLocale;
    const value = this.lookup(key, loc)
      ?? (this.fallbackLocale ? this.lookup(key, this.fallbackLocale) : undefined)
      ?? key;
    if (typeof value !== 'string') return key;
    return this.interpolate(value, params);
  }

  has(key: string, locale?: string): boolean {
    return this.lookup(key, locale ?? this.defaultLocale) !== undefined;
  }

  locales(): string[] {
    return Object.keys(this.translations);
  }

  resolveLocale(request: Request): string {
    const url = new URL(request.url);
    const qp = url.searchParams.get('lang') ?? url.searchParams.get('locale');
    if (qp && this.translations[qp]) return qp;

    const headerLocale = request.headers.get('x-locale');
    if (headerLocale && this.translations[headerLocale]) return headerLocale;

    const accept = request.headers.get('accept-language');
    if (accept) {
      for (const part of accept.split(',')) {
        const base = part.trim().split(';')[0];
        const code = base.split('-')[0];
        if (this.translations[code]) return code;
      }
    }
    return this.defaultLocale;
  }

  private lookup(key: string, locale: string): any {
    const tree = this.translations[locale];
    if (!tree) return undefined;
    let node: any = tree;
    for (const part of key.split('.')) {
      if (node === undefined || node === null || typeof node !== 'object') return undefined;
      node = node[part];
    }
    return node;
  }

  private interpolate(text: string, params?: Record<string, any>): string {
    if (!params) return text;
    let out = text;
    for (const [k, v] of Object.entries(params)) {
      out = out.split(`${this.start}${k}${this.end}`).join(String(v));
    }
    return out;
  }
}
