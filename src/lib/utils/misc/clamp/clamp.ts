/**
 * Функция, которая ограничивает число `value` границами [`min`-`max`]
 *
 * @param value - Изначальное число
 * @param min - Минимальное граничное значение
 * @param max - Максимальное граничное значение
 * @returns Переданное значение
 */
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export default clamp;
