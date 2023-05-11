/**
 * Функция-заглушка, которая принимает любое количество аргументов и ничего не делает
 *
 * @param args - Что угодно
 */
const noop = (...args: unknown[]): void => {
  // void args === undefined. Это нужно чтобы args был помечен как используемый
  return void args;
};

export default noop;
