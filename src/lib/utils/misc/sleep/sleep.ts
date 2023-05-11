/**
 * Останавливает выполнение асинхронной функции на указанное количество мс
 *
 * @param time - Длительность паузы
 * @returns Promise, который выполнится через указанное время
 */
const sleep = (time: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export default sleep;
