/**
 * Переводит первый символ в верхний регистр, а остальное - в нижний
 *
 * @param string - Строка
 * @returns Обработанная строка
 */
const capitalizeString = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
};

export default capitalizeString;
