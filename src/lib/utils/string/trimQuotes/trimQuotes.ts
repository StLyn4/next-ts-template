import { QUOTED_STRING_PATTERN } from 'app/lib/patterns';

/**
 * Убирает кавычки на концах строки
 *
 * @param string - Строка с кавычками
 * @returns Строка без кавычек на концах
 */
const trimQuotes = (string: string): string => {
  const trimmedStr = string.trim();
  const parsed = trimmedStr.match(QUOTED_STRING_PATTERN);
  return parsed ? parsed[2] : trimmedStr;
};

export default trimQuotes;
