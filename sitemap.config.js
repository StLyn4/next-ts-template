'use strict';
const { locales } = require('./i18n');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.PUBLIC_URL,
  priority: 1.0,
  exclude: ['/api/*', '/dynamic-sitemap.xml'],
  alternateRefs: locales.map((locale) => ({
    href: new URL(locale, process.env.PUBLIC_URL).href,
    hreflang: locale,
  })),
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: [new URL('/dynamic-sitemap.xml', process.env.PUBLIC_URL).href],
  },
};
