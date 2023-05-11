/**
 * Обрезает строку, если она больше `limit` длины
 *
 * @param string - Строка
 * @param limit - Максимальная длина
 * @returns Обрезанная строка
 */
const truncateString = (string: string, limit = Infinity): string => {
  const dots = '...';
  const limitWithDots = limit - dots.length;

  if (string.length > limitWithDots) {
    return string.slice(0, limitWithDots) + dots;
  } else {
    return string;
  }
};

export default truncateString;
