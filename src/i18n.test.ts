import { describe, test, expect } from 'bun:test';
import { I18nService } from './i18n.service';
import { I18nModule } from './i18n.module';

const translations = {
  en: {
    greeting: 'Hello {name}!',
    nav: { home: 'Home', about: 'About' },
    items: 'You have {count} item(s)',
  },
  vi: {
    nav: { about: 'Giới thiệu' },
  },
};

describe('I18nService', () => {
  const i18n = new I18nService({ translations, defaultLocale: 'en', fallbackLocale: 'en' });

  test('simple lookup', () => {
    expect(i18n.t('nav.home')).toBe('Home');
  });

  test('nested keys', () => {
    expect(i18n.t('nav.about')).toBe('About');
  });

  test('interpolation', () => {
    expect(i18n.t('greeting', { name: 'Orbit' })).toBe('Hello Orbit!');
    expect(i18n.t('items', { count: 3 })).toBe('You have 3 item(s)');
  });

  test('locale override', () => {
    expect(i18n.t('nav.about', undefined, 'vi')).toBe('Giới thiệu');
  });

  test('fallback to default locale', () => {
    expect(i18n.t('nav.home', undefined, 'vi')).toBe('Home');
  });

  test('missing key returns key itself', () => {
    expect(i18n.t('no.such.key')).toBe('no.such.key');
  });

  test('has()', () => {
    expect(i18n.has('nav.home')).toBe(true);
    expect(i18n.has('nav.missing')).toBe(false);
  });

  test('locales()', () => {
    expect(i18n.locales().sort()).toEqual(['en', 'vi']);
  });

  test('resolveLocale from query', () => {
    const req = new Request('https://x.test/page?lang=vi');
    expect(i18n.resolveLocale(req)).toBe('vi');
  });

  test('resolveLocale from accept-language', () => {
    const req = new Request('https://x.test/page', { headers: { 'accept-language': 'vi-VN,vi;q=0.9,en;q=0.8' } });
    expect(i18n.resolveLocale(req)).toBe('vi');
  });

  test('resolveLocale falls back to default', () => {
    const req = new Request('https://x.test/page', { headers: { 'accept-language': 'fr' } });
    expect(i18n.resolveLocale(req)).toBe('en');
  });

  test('module exposes service', async () => {
    const { OrbitFactory, Module } = await import('@galaxy-stack/orbit-core');
    @Module({ imports: [I18nModule.forRoot({ translations, defaultLocale: 'en' })] })
    class M {}
    const app = await OrbitFactory.create(M);
    const svc = await app.getContainer().resolve(I18nService);
    expect(svc.t('nav.home')).toBe('Home');
  });
});
