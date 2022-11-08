'use strict';
const path = require('path');

const buildEslintCommand = (filenames) => {
  const files = filenames.map((filename) => path.relative(process.cwd(), filename));
  return `next lint --fix --file ${files.join(' --file ')}`;
};

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
  '*.{json,yml,yaml}': ['prettier --loglevel warn --write'],
  '*.{md,mdx}': ['prettier --loglevel warn --write', 'markdownlint --fix'],
  '*.{css,scss,sass}': ['stylelint --fix'],
  '*.*': ['cspell --show-context --no-progress --no-must-find-files'],
};
