/**
 * Преобразует пиксели в rem
 *
 * @param px - Количество пикселей
 * @param base - Сколько пикселей приходится на один rem
 * @returns Количество rem (с соответствующей приставкой)
 */
const pxToRem = (px: number, base = 16): string => {
  return `${px / base}rem`;
};

export default pxToRem;
