/**
 * Экранирует все специальные символы в RegExp-строке
 *
 * @param string - Строка
 * @returns Экранированная строка
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default escapeRegExp;
