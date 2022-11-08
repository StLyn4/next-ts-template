/**
 * Переводит первый символ каждого слова в верхний регистр, а остальные - в нижний
 *
 * @param string - Строка
 * @returns Обработанная строка
 */
const titleString = (string: string): string => {
  const words = string.toLowerCase().split(' ');

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
  }

  return words.join(' ');
};

export default titleString;
