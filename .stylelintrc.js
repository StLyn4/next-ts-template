/** @type { import('stylelint').Config } */
module.exports = {
  extends: ['stylelint-config-recommended-scss', 'stylelint-config-css-modules'],
  rules: {
    'max-line-length': 120, // максимальная длина строки - 120 символов
    'indentation': 2, // отступ в блоке - 2 пробела
    'linebreaks': 'unix', // окончание строк - LF (Unix)
    'max-empty-lines': 1, // не больше одной пустой строки подряд
    'no-empty-first-line': true, // запрещаем пустые строки в начале файла
    'no-eol-whitespace': true, // никаких пробелов в конце строки
    'string-quotes': 'single', // одинарные кавычки для строк
    'declaration-block-trailing-semicolon': 'always', // всегда ставим ";" после параметров
    'no-extra-semicolons': true, // никаких лишних ";" (больше одного раза)
    'function-comma-space-after': 'always-single-line', // пробел после запятой в параметрах функций
    'function-comma-space-before': 'never', // никах пробелов перед запятыми в параметрах функций
    'selector-combinator-space-after': 'always', // пробел после символов-комбинаторов в селекторах
    'selector-combinator-space-before': 'always', // перед ними тоже (пример: `a > b`)
    'declaration-colon-space-after': 'always-single-line', // пробел после двоеточия в объявлении свойства
    'declaration-colon-space-before': 'never', // перед ним же нельзя
    'declaration-block-single-line-max-declarations': 0, // запрещаем однострочные блоки
    'color-named': 'never', // не используем именнованных цветов (black, white, red...), а только точные значения
    'color-hex-case': 'upper', // HEX-цвета всегда в верхнем регистре (#ffffff -> #FFFFFF)
    'color-hex-length': 'long', // всегда используем длинную запись HEX-цветов (#ABC -> #AABBCC)
    'unit-disallowed-list': ['rem'], // запрещаем использовать `rem`. `px` будет автоматически преобразован в `rem`
    'length-zero-no-unit': true, // не используем единицы измерения с нулевыми значениями (0px -> 0)
    'at-rule-disallowed-list': 'import', // запрещаем использовать @import (во благо @use)
    'scss/function-no-unknown': null, // не используем необъявленные функции
  },
};
