import { randomBetween } from 'app/lib/utils';

/**
 * Перемешивает содержимое массива
 *
 * @param array - Массив с любыми входными данными
 * @returns Новый массив с теми же данными, но в случайном порядке
 */
const shuffle = <T>(array: T[]): T[] => {
  const arrayCopy = [...array];

  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = randomBetween(0, i);
    [arrayCopy[j], arrayCopy[i]] = [arrayCopy[i], arrayCopy[j]];
  }

  return arrayCopy;
};

export default shuffle;
