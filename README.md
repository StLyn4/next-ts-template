# Шаблон приложения Next.js на TypeScript

## DEV (CLI)

```sh
# Запуск сервера в режиме разработки (опционально можно указать порт)
yarn dev [-p 3000]
```

> В большинстве случаев вместо Yarn можно использовать NPM.
> **Но для добавления / удаления зависимостей необходимо использовать Yarn!**

## PROD (CLI)

```sh
# Создание сборки
yarn build [--profile] [--debug]

# Запуск сервера в режиме production с папки .next (опционально можно указать порт)
yarn start [-p 3000]
```

## Документация

```sh
# Запуск сервера Storybook в режиме разработки
yarn docs:dev [-p 6006]

# Создание сборки сайта с документацией
yarn docs:build [-p 6006]
```

## Тесты и линтеры

```sh
# Запуск тестов Storybook Chromatic
yarn test

# Запуск всех линтеров одновременно
yarn lint

# Анализ размера сборки в production режиме
yarn analyze
```

```sh
# Запуск линтера для кода (JS/TS)
yarn lint:code

# Запуск линтера для настроек (JSON/YAML)
yarn lint:configs

# Запуск линтера для стилей (CSS/SCSS/SASS)
yarn lint:styles

# Запуск линтера для Markdown (MD/MDX)
yarn lint:markdown

# Проверка проекта на возможные опечатки
yarn lint:spelling
```

## Проверка безопасности

```sh
# Проверка production зависимостей проекта на наличие уязвимостей
yarn snyk:test
```

## Релиз новой версии

```sh
# Большой буквой указан сегмент, который будет увеличен на 1

# x.y.Z (по умолчанию)
yarn release [patch]
# NPM: npm run release [-- patch]

# x.Y.z
yarn release minor
# NPM: npm run release -- minor

# X.y.z
yarn release major
# NPM: npm run release -- major
```

## Удаление временных файлов

```sh
# Удаление всех временных файлы, а также папок со сборками проекта
yarn clean
```
