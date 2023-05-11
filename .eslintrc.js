/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
module.exports = {
  root: true, // Это корневые настройки. Всё, что найдено выше, будет проигнорировано
  extends: [
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'next/core-web-vitals',
    'google',
  ],
  rules: { // общие для всех файлов правила
    'valid-jsdoc': 'off', // отключаем встроенную валидацию JSDoc, для JS включаем позже в виде плагина
    'linebreak-style': ['error', 'unix'], // окончание строк - LF (Unix)
    'eol-last': ['error', 'always'], // пустая строка в конце файла
    'comma-dangle': 'error', // "висящая запятая" в конце многострочных объектов
    'curly': ['error', 'all'], // заключение в фигурные скобки всех блоков
    'object-curly-spacing': ['error', 'always'], // пробелы внутри фигурных скобок (кроме {})
    'jsx-quotes': ['error', 'prefer-double'], // двойные кавычки для строк в JSX
    'quotes': ['error', 'single'], // одинарные кавычки для прочих строк
    'no-console': 'error', // `console.*` использовать запрещено
    'no-debugger': 'error', // то же касается `debugger`
    'no-eval': 'error', // ну и `eval`
    'no-return-await': 'error', // вместо `return await asyncFn` стоит использовать `return asyncFn`
    'no-implicit-coercion': 'error', // никакого неявного преобразования типов
    'no-underscore-dangle': 'error', // никаких переменных, названия которых начинаются с "_"
    'no-multiple-empty-lines': ['error', {
      'max': 1, // не более одной пустой строки подряд
      'maxEOF': 1, // разрешаем также одну в конце файла для `eol-last`
      'maxBOF': 0, // и запрещаем пустые строки в начале файла
    }],
    'no-restricted-imports': ['error', {
      'patterns': ['../'], // запрещаем импорты, которые начинаются с "../" (а иначе зачем нам paths?)
    }],
    'max-len': ['error', {
      'code': 120, // максимальная длина строки - 120 символов
      'tabWidth': 2, // считать <Tab> за 2 символа
      'ignoreUrls': true, // игнорируем длину строки, если в ней есть ссылки
      'ignoreStrings': true, // либо строки
      'ignoreTemplateLiterals': true, // либо строки-шаблоны
      'ignoreRegExpLiterals': true, // либо регулярные выражения
    }],
    'indent': ['error', 2, { 'SwitchCase': 1 }], // отступ в блоке - 2 пробела
    'spaced-comment': ['error', 'always', { // пробел перед каждым комментарием (между "//" и текстом)
      'markers': ['/'], // поддержка 3-го "/" (нужно для `/// <reference path="file" />`)
    }],
    'operator-linebreak': ['error', 'after', { // если выражение делится на несколько строк, оператор оставляем в конце
      'overrides': { '?': 'before', ':': 'before' }, // это не касается тернарных выражений
    }], // (`a + b + c` можно разделить как `a +\n b +\n c`, а `a ? 1 : 2` как `a \n? 1 \n: 2`)
    'require-jsdoc': ['error', { // обязательная документация для ... (хотя бы описание в формате "/** ... */")
      'require': {
        'FunctionDeclaration': true, // function fn() { ... }
        'MethodDefinition': true, // fn() { ... }
        'ClassDeclaration': true, // class Class { ... }
        'ArrowFunctionExpression': true, // fn = () => { ... }
        'FunctionExpression': true, // fn = function() { ... }
      },
    }],
    'react/button-has-type': 'error', // для элементов `button` необходимо указывать тип (атрибут `type`)
    'react/iframe-missing-sandbox': 'error', // для элементов `iframe` необходимо указывать атрибут `sandbox`
    'react/hook-use-state': 'error', // убеждаемся что `useState` используется в формате `[val, setVal] = useState()`
    'react/prefer-stateless-function': 'error', // используем только функциональные компоненты
    'react/jsx-props-no-multi-spaces': 'error', // максимум один пробел между пропсами
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'], // закрываем тег на той же колонке, что и открыли
    'react/jsx-curly-brace-presence': ['error', 'never'], // запрещаем лишние фигурные скобки в JSX
    'react/jsx-fragments': ['error', 'syntax'], // Вместо `React.Fragment` используем просто `<></>`
    'react/jsx-indent': ['error', 2], // отступ в JSX - 2 пробела
    'react/jsx-max-props-per-line': ['error', {
      'maximum': 1, // разрешаем максимум один пропс на строку,
      'when': 'multiline', // если открывающий тег занимает несколько строк
    }],
    'react/jsx-tag-spacing': ['error', {
      'closingSlash': 'never', // без пробелов после закрывающего "/" (неправильно: `<Some / >`)
      'beforeSelfClosing': 'always', // пробел перед "/" в самозакрывающимся теге (правильно: `<Some />`)
      'afterOpening': 'never', // без пробелов после открытия тега (неправильно: `< Hello></ Hello>`)
      'beforeClosing': 'never', // без пробелов перед закрытием тега (неправильно: `<Hello ></Hello >`)
    }],
    'react/jsx-wrap-multilines': ['error', { // оборачивать многострочный JSX в скобки (с переносом строки)
      'declaration': 'parens-new-line',
      'assignment': 'parens-new-line',
      'return': 'parens-new-line',
      'arrow': 'parens-new-line',
      'condition': 'parens-new-line',
      'logical': 'parens-new-line',
      'prop': 'parens-new-line',
    }],
    'react/function-component-definition': ['error', { // используем именно стрелочные функции для компонентов
      'namedComponents': 'arrow-function',
      'unnamedComponents': 'arrow-function',
    }],
    'react/no-unstable-nested-components': ['error', { // нельзя объявлять компоненты внутри других компонентов
      'allowAsProps': true, // при этом можно передавать такие компоненты как пропсы
    }],
    'react/forbid-elements': ['error', { // запрет на использование нативных элементов из-за наличия своих аналогов
      'forbid': [
        {
          'element': 'button',
          'message': 'use <Button> instead',
        },
        {
          'element': 'input',
          'message': 'use <Input> / <Checkbox> instead',
        },
        {
          'element': 'textarea',
          'message': 'use <Input type="textarea"> instead',
        },
      ],
    }],
    'import/first': 'error', // импорт происходит в первую очередь
    'import/no-self-import': 'error', // нельзя импортировать самого себя
    'import/no-absolute-path': 'error', // нельзя использовать абсолютные пути (от корня диска)
    'import/no-useless-path-segments': ['error', // нельзя использовать бессмысленные сегменты в пути
      { 'noUselessIndex': true },
    ],
    'import/newline-after-import': ['error', { 'count': 1 }], // одна пустая строка после импортов
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', ['index', 'sibling', 'parent'], 'object'], // порядок импорта
      'newlines-between': 'always', // новая строка между группами выше
      'distinctGroup': false, // не добавляем новые строки между группами, объявленными в `pathGroups` ниже
      'alphabetize': { 'order': 'asc' }, // сортируем по алфавиту внутри групп
      'pathGroupsExcludedImportTypes': ['builtin', 'object'],
      'pathGroups': [
        { 'pattern': 'react*(-*)', 'group': 'external', 'position': 'before' }, // react выше всего (среди зависимостей)
        { 'pattern': 'react*(-*)/**', 'group': 'external', 'position': 'before' },
        { 'pattern': 'next*(-*)', 'group': 'external', 'position': 'before' }, // за ним next
        { 'pattern': 'next*(-*)/**', 'group': 'external', 'position': 'before' },
        { 'pattern': 'app/components/**', 'group': 'internal', 'position': 'after' },
        { 'pattern': 'app/lib/**', 'group': 'internal', 'position': 'after' },
        { 'pattern': 'app/redux/**', 'group': 'internal', 'position': 'after' },
        { 'pattern': 'app/styles/**', 'group': 'index', 'position': 'before' },
        { 'pattern': 'app/**', 'group': 'internal', 'position': 'after' },
        { 'pattern': 'root/**', 'group': 'internal', 'position': 'after' },
        { 'pattern': 'assets/**', 'group': 'index', 'position': 'before' },
      ],
    }],
  },
  overrides: [
    {
      files: ['*.js', '*.mjs', '*.cjs', '*.jsx'], // правила, применимые только к JS
      plugins: ['jsdoc'],
      extends: ['plugin:jsdoc/recommended-error'], // включаем валидацию JSDoc для JS
      settings: {
        'jsdoc': {
          'mode': 'typescript', // необходимо для работы `/** @type {import(...)} */`
        },
      },
      rules: {
        'jsdoc/tag-lines': ['error', 'any', {
          startLines: 1, // после первого блока в JSDoc должна быть 1 пустая строка
        }],
      },
    },
    {
      files: ['*.ts', '*.mts', '*.cts', '*.tsx'], // правила, применимые только к TS
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: './',
      },
      plugins: ['tsdoc', '@typescript-eslint'],
      extends: [
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        'tsdoc/syntax': 'error', // валидация TSDoc
        '@typescript-eslint/explicit-function-return-type': ['error', { // обязательно объявляем возвращаемый тип
          'allowExpressions': true, // кроме функций обратного вызова (callback)
          'allowTypedFunctionExpressions': true, // и если переменная уже типизированная (`fn: Type = () => { ... }`)
        }],
        '@typescript-eslint/member-delimiter-style': 'error', // аналог `comma-dangle` для интерфейсов и типов
        '@typescript-eslint/consistent-type-exports': 'error', // используем модификатор `type` для экспорта типов
        '@typescript-eslint/consistent-type-imports': ['error', { // тоже самое и для импорта
          'prefer': 'type-imports',
          'fixStyle': 'inline-type-imports',
        }],
        '@typescript-eslint/no-misused-promises': ['error', { // более строгая работа с Promise
          'checksVoidReturn': false, // разрешаем возвращать с функций Promise<...>, даже если ожидался строго void
        }],
        '@typescript-eslint/no-namespace': ['error', { // запрещено использовать `namespace`
          'allowDeclarations': true, // разрешаем при использовании с `declare` (полезно для расширения типов)
        }],
      },
    },
    {
      files: ['./src/pages/api/**/*'],
      rules: {
        'no-console': 'off', // разрешаем использовать `console.*` внутри API-файлов
      },
    },
  ],
};
