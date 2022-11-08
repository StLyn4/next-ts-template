'use strict';
const project = require('./package.json');

// Названия зависимостей проекта
const dependencies = Object.keys({
  ...(project.dependencies ?? {}),
  ...(project.devDependencies ?? {}),
  ...(project.peerDependencies ?? {}),
  ...(project.optionalDependencies ?? {}),
});

// Слова с которых состоят названия зависимостей
let dependencyWords = dependencies.flatMap((dependency) => {
  // Считаем разделителем любой не буквенно-цифровой символ; убираем пустые строки
  return dependency.split(/[^a-zA-Z\d]/).filter(Boolean);
});

// Чистим массив от дубликатов
dependencyWords = Array.from(new Set(dependencyWords));

/** @type {import('cspell').CSpellSettings} */
module.exports = {
  version: '0.2',
  import: ['@cspell/dict-ru_ru/cspell-ext.json'],
  language: 'en,ru,lorem',
  allowCompoundWords: true,
  cache: {
    useCache: true,
    cacheStrategy: 'content',
    cacheLocation: '.next/cache/cspell/.cache',
  },

  // Не проверяем пути с .gitignore, в добавок к тем, что указаны ниже
  useGitignore: true,
  ignorePaths: [
    '**/.git/**',
    '.vscode',
    '.idea',
    'package-lock.json',
    'yarn.lock',
  ],

  // В этом конфиге мы добавляем лишь слова с названий зависимостей.
  // Остальное должно быть добавлено в spelling-dict.dic
  words: dependencyWords,
  readonly: true,
  dictionaries: ['project-spelling'],
  dictionaryDefinitions: [
    {
      name: 'project-spelling',
      path: './spelling-dict.dic',
      scope: 'workspace',
      addWords: true,
    },
  ],
};
