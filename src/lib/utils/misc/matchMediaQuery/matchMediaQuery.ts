import { noop } from 'app/lib/utils';

export type MediaQueryCallback = (event: MediaQueryListEvent) => void;
export type RemoveListenerCallback = () => void;

/**
 * Прикрепление слушателя на случай изменения значения
 *
 * @param queryList - Объект media-query, к которому будет прикреплён слушатель
 * @param callback - Слушатель
 * @returns Функция для отвязки слушателя
 */
const attachMediaListener = (queryList: MediaQueryList, callback: MediaQueryCallback): RemoveListenerCallback => {
  try {
    queryList.addEventListener('change', callback);
    return () => queryList.removeEventListener('change', callback);
  } catch (err) {
    // Поддержка Safari в macOS Catalina и ниже
    queryList.addListener(callback);
    return () => queryList.removeListener(callback);
  }
};

/**
 * Выполняет проверку указанного медиавыражения
 *
 * @param query - Медиавыражение, который необходимо проверить
 * @param onChange - Слушатель на случай изменения значения
 * @returns Результат выполнения запроса, функция для отвязки слушателя (заглушка, если слушатель не указан)
 */
const matchMediaQuery = (query: string, onChange?: MediaQueryCallback): readonly [boolean, RemoveListenerCallback] => {
  const queryList = window.matchMedia(query);

  if (onChange) {
    const removeListener = attachMediaListener(queryList, onChange);
    return [queryList.matches, removeListener] as const;
  }

  return [queryList.matches, noop] as const;
};

export default matchMediaQuery;
