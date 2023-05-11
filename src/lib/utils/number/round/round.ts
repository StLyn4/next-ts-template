/**
 * Функция округления с указанной точностью
 *
 * @param value - Изначальное число
 * @param accuracy - С точностью до скольки символов после запятой нужно округлять
 * @returns Округлённое значение
 */
const round = (value: number, accuracy = 0): number => {
  const multiplier = Math.pow(10, accuracy);
  return Math.round(value * multiplier) / multiplier;
};

export default round;
