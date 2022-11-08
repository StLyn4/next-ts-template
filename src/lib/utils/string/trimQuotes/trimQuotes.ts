import { QUOTED_STRING_PATTERN } from 'app/lib/patterns';

/**
 * Убирает кавычки на концах строки
 *
 * @param str - Строка с кавычками
 * @returns Строка без кавычек на концах
 */
const trimQuotes = (str: string): string => {
  const trimmedStr = str.trim();
  const parsed = trimmedStr.match(QUOTED_STRING_PATTERN);
  return parsed ? parsed[2] : trimmedStr;
};

export default trimQuotes;
