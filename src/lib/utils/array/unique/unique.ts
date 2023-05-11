/**
 * Удаляет копии значений внутри массива
 *
 * @param arr - Массив значений
 * @returns Копия массива с уникальными значениями
 */
const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr));

export default unique;
