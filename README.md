<div align="center">

# @galaxy-stack/orbit-i18n

**Internationalization for Orbit** — nested translations, interpolation, fallbacks, request locale resolution.

[![npm version](https://img.shields.io/npm/v/@galaxy-stack/orbit-i18n.svg)](https://www.npmjs.com/package/@galaxy-stack/orbit-i18n)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

Part of the [Orbit framework](https://github.com/galaxy-orbit/orbit) — a NestJS-style backend framework for [Bun](https://bun.sh).

## Installation

```bash
bun add @galaxy-stack/orbit-i18n
```

## Usage

```ts
import { I18nModule, I18nService, Module, Injectable } from '@galaxy-stack/orbit-i18n';

@Module({
  imports: [I18nModule.forRoot({
    translations: {
      en: { greeting: 'Hello {name}!', nav: { home: 'Home' } },
      vi: { greeting: 'Xin chào {name}!' },
    },
    defaultLocale: 'en',
    fallbackLocale: 'en',
  })],
})
export class AppModule {}

@Injectable()
export class GreetingService {
  constructor(private i18n: I18nService) {}
  greet(name: string, locale: string) {
    return this.i18n.t('greeting', { name }, locale);
  }
}
```

`resolveLocale(request)` reads `?lang` → `x-locale` → `accept-language` → default.

## License

MIT
