const MIN_INT32 = -(2**31); // -2147483648
const MAX_INT32 = 2**31 - 1; // 2147483647

/**
 * Генерация случайного числа в диапазоне от `min` до `max`
 *
 * @param min - Минимальное допустимое значение
 * @param max - Максимальное допустимое значение
 * @param intOnly - Возвращать только целые числа
 * @returns Случайное число
 */
const randomBetween = (min = MIN_INT32, max = MAX_INT32, intOnly = true): number => {
  let randomValue = Math.random() * (max - min + 1) + min;

  if (intOnly) {
    randomValue = Math.trunc(randomValue);
  }

  return randomValue;
};

export default randomBetween;
