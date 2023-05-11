import { BOOLEAN_PATTERN, DURATION_PATTERN } from 'app/lib/patterns';

/**
 * Проверяет, является ли строка допустимым значением, основываясь на параметре `acceptable`
 *
 * @param value - Строка со значением
 * @param acceptable - Массив допустимых значений
 * @param defaultValue - Значение по умолчанию, если переменная пустая
 * @returns Переданная на проверку строка
 */
export const parseSelect = <const T extends string>(value: string, acceptable: readonly T[], defaultValue?: T): T => {
  if (value === '' && typeof defaultValue !== 'undefined') {
    return defaultValue;
  }

  if (!acceptable.includes(value as T)) {
    const acceptableString = acceptable.join(', ');
    throw new Error(`Ожидалось одно из следующих значений: ${acceptableString}, но вместо этого получили: ${value}`);
  }
  return value as T;
};

/**
 * Парсит число со строки
 *
 * @param value - Строка со значением
 * @param defaultValue - Значение по умолчанию, если переменная пустая
 * @returns Число
 */
export const parseNumber = (value: string, defaultValue = 0): number => {
  if (value === '') {
    return defaultValue;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Ожидалось число, но вместо этого получили: ${value}`);
  }
  return parsed;
};

/**
 * Парсит логическое значение со строки
 *
 * @param value - Строка со значением
 * @param defaultValue - Значение по умолчанию, если переменная пустая
 * @returns Логическое значение
 */
export const parseBoolean = (value: string, defaultValue = false): boolean => {
  if (value === '') {
    return defaultValue;
  }

  if (!BOOLEAN_PATTERN.test(value)) {
    throw new Error(`Ожидалось логическое значение, но вместо этого получили: ${value}`);
  }
  return value.toLowerCase() === 'true';
};

/**
 * Парсит массив со строки
 *
 * @param value - Строка со значением
 * @param defaultValue - Значение по умолчанию, если переменная пустая
 * @returns Массив
 */
export const parseArray = <T>(value: string, defaultValue: T[] = []): T[] => {
  if (value === '') {
    return defaultValue;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(value) as unknown;
  } catch (SyntaxError) {
    throw new Error(`Ожидался массив, но вместо этого получили: ${value}`);
  }

  if (Array.isArray(parsed)) {
    return parsed as T[];
  }

  throw new Error(`Ожидался массив, но вместо этого получили: ${value}`);
};

/**
 * Парсит JSON-объект
 *
 * @param value - Строка со значением
 * @returns Объект
 */
export const parseObject = <T>(value: string): T => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value) as unknown;
  } catch (SyntaxError) {
    throw new Error(`Ожидался объект, но вместо этого получили: ${value}`);
  }

  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed as T;
  }

  throw new Error(`Ожидался объект, но вместо этого получили: ${value}`);
};

/**
 * Парсит продолжительность со строки
 *
 * @param value - Строка со значением (в формате `100ms` / `100s` / `100m` / `100h` / `100d`)
 * @param defaultValue - Значение по умолчанию, если переменная пустая
 * @returns Время в миллисекундах
 */
export const parseDuration = (value: string, defaultValue = 0): number => {
  if (value === '') {
    return defaultValue;
  }

  const parsed = value.match(DURATION_PATTERN);
  if (!parsed) {
    throw new Error(`Ожидалась продолжительность, но вместо этого получили: ${value}`);
  }

  const [, time, unit] = parsed;
  const timeNumber = Number(time);
  if (Number.isNaN(timeNumber)) {
    throw new Error(`Ожидалось число в продолжительности, но вместо этого получили: ${timeNumber}`);
  }

  switch (unit) {
    case 'ms':
      return timeNumber;
    case 's':
      return timeNumber * 1000;
    case 'm':
      return timeNumber * 1000 * 60;
    case 'h':
      return timeNumber * 1000 * 60 * 60;
    case 'd':
      return timeNumber * 1000 * 60 * 60 * 24;
    default:
      throw new Error(`Неизвестная единица измерения продолжительности: ${unit}`);
  }
};

/**
 * Парсит дату со строки
 *
 * @param value - Строка со значением (в формате ISO-8601)
 * @param defaultValue - Значение по умолчанию, если переменная пустая
 * @returns Объект даты
 */
export const parseDate = (value: string, defaultValue = new Date(0)): Date => {
  if (value === '') {
    return defaultValue;
  }

  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Ожидалась дата, но вместо этого получили: ${value}`);
  }
  return parsed;
};
