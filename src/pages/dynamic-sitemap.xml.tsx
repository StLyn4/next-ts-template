import { type GetServerSideProps } from 'next';
import { getServerSideSitemapLegacy, type IAlternateRef, type ISitemapField } from 'next-sitemap';

import { getAbsoluteUrl } from 'app/lib/utils';
import { type Page } from 'app/types';
import i18n from 'root/i18n.json';

/** Пустая страница */
const DynamicSitemap: Page = () => null;

/** Массив относительных ссылок на динамические страницы */
const urls: ReadonlyArray<string> = [
  // '/path/to/dynamic/page',
  // '/some-other-path',
];

/**
 * Получить поле для `getServerSideSitemap` со всеми необходимыми языками
 *
 * @param path - Путь к странице
 * @returns Локализованное поле sitemap
 */
const getLocalizedSitemapField = (path: string): ISitemapField => {
  const lastModificationDate = new Date().toISOString();
  const relativePath = path.startsWith('/') ? path : `/${path}`;

  return {
    loc: getAbsoluteUrl(relativePath),
    lastmod: lastModificationDate,
    changefreq: 'daily',
    priority: 1.0,
    alternateRefs: i18n.locales.map(
      (locale: string): IAlternateRef => ({
        href: getAbsoluteUrl(locale + relativePath),
        hreflang: locale,
      }),
    ),
  };
};

/** Генератор данных для динамической части карты сайта */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const fields = urls.map((url) => getLocalizedSitemapField(url));
  return getServerSideSitemapLegacy(ctx, fields);
};

// Это всё ещё страница, поэтому нужно что-то экспортировать, чтобы Next.js не ругался
export default DynamicSitemap;
