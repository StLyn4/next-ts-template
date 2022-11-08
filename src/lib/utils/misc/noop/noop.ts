/**
 * Функция-заглушка, которая принимает любое количество аргументов и ничего не делает
 *
 * @param args - Что угодно
 */
// void args === undefined. Это нужно чтобы args был помечен как используемый
const noop = (...args: unknown[]): void => void args;

export default noop;
