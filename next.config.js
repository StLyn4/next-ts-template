const withTranslate = require('next-translate-plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE_BUNDLE === 'true',
});

/** @typedef {import('next').NextConfig} NextConfig */
/** @type {NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['node_modules'],
  },

  webpack: (config) => {
    const rules = config.module.rules.find((rule) => typeof rule.oneOf === 'object').oneOf;
    const rulesWithMultipleLoaders = rules.filter((rule) => Array.isArray(rule.use));

    // Заставляем воспринимать CSS-классы в `camelCase` при их использовании в JS/TS
    for (const rule of rulesWithMultipleLoaders) {
      for (const loaderInfo of rule.use) {
        if (/css-loader[/\\](?:cjs|dist|src)/.test(loaderInfo.loader)) {
          if (typeof loaderInfo.options.modules === 'object') {
            loaderInfo.options.modules.exportLocalsConvention = 'camelCase';
          }
        }
      }
    }

    return config;
  },
};

/**
 * Стандартный плагин Next.js
 *
 * @callback NextPlugin
 * @param {NextConfig} config - Текущая конфигурация Next.js
 * @returns {NextConfig} Итоговая конфигурация
 */

/**
 * Функция слияния плагинов Next.js
 *
 * @param {NextPlugin[]} plugins - Подключаемые плагины
 * @param {NextConfig} nextConfig - Текущая конфигурация Next.js
 * @returns {NextConfig} Итоговая конфигурация
 */
const withPlugins = (plugins, nextConfig) => {
  return plugins.reduce((acc, plugin) => plugin(acc), nextConfig);
};

module.exports = withPlugins([withTranslate, withBundleAnalyzer], nextConfig);
