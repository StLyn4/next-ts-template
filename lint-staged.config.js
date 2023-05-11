const path = require('path');

/**
 * Строит команду для запуска Next.js ESLint для всех заданных файлов
 *
 * @param {string[]} filenames - Пути к файлам, которые необходимо проверить
 * @returns {string} Комманда для запуска линтера для всех заданных файлов
 */
const buildEslintCommand = (filenames) => {
  const files = filenames.map((filename) => path.relative(process.cwd(), filename));
  return `next lint --fix --file ${files.join(' --file ')}`;
};

module.exports = {
  '*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}': [buildEslintCommand],
  '*.{json,yml,yaml}': ['prettier --loglevel warn --write'],
  '*.{md,mdx}': ['prettier --loglevel warn --write', 'markdownlint --fix'],
  '*.{css,scss,sass}': ['stylelint --fix'],
  '*.*': ['cspell --show-context --no-progress --no-must-find-files'],
};
