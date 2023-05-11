/** Незашифрованное хранилище */
const storage = {
  /**
   * Установка нового значения по ключу
   *
   * @param key - Ключ
   * @param value - Новое значение (если `undefined`, то произойдёт удаление)
   */
  set: <T>(key: string, value: T): void => {
    if (typeof value === 'undefined') {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  /**
   * Получение значения по ключу
   *
   * @param key - Ключ
   * @returns Текущее значение
   */
  get: <T>(key: string): T | undefined => {
    const jsonValue = localStorage.getItem(key);
    return jsonValue !== null ? JSON.parse(jsonValue) as T : undefined;
  },

  /**
   * Получение списка всех ключей в хранилище
   *
   * @returns Список ключей
   */
  keys: (): string[] => {
    return Object.keys(localStorage);
  },

  /**
   * Проверка наличия записи с указанных ключом в хранилище
   *
   * @param key - Ключ
   * @returns Есть ли запись с таким ключом
   */
  has: (key: string): boolean => {
    return storage.get(key) !== undefined;
  },

  /**
   * Удаление записи с хранилища
   *
   * @param key - Ключ
   */
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  /** Очистка хранилища */
  clear: (): void => {
    localStorage.clear();
  },
} as const;

export default storage;
