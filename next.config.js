'use strict';
const withTranslate = require('next-translate-plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    const rules = config.module.rules.find((rule) => typeof rule.oneOf === 'object').oneOf;
    const rulesWithMultipleLoaders = rules.filter((rule) => Array.isArray(rule.use));

    // Заставляем воспринимать CSS-классы в `camelCase` при их использовании в JS/TS
    for (const rule of rulesWithMultipleLoaders) {
      for (const loaderInfo of rule.use) {
        if (/css-loader[/\\](?:cjs|dist|src)/.test(loaderInfo.loader)) {
          if (typeof loaderInfo.options.modules === 'object') {
            loaderInfo.options.modules.exportLocalsConvention = 'camelCaseOnly';
          }
        }
      }
    }

    return config;
  },
};

const withPlugins = (plugins, nextConfig) => {
  return plugins.reduce((acc, plugin) => plugin(acc), { ...nextConfig });
};

module.exports = withPlugins([withTranslate, withBundleAnalyzer], nextConfig);
