import { useDebugValue, useEffect, useState } from 'react';

import { useEvent } from 'app/lib/hooks';
import { storage } from 'app/lib/utils';
import { type StateSetter, isNewStateSetter } from 'app/types';

/**
 * Работа с данными с хранилища по ключу
 *
 * @remarks
 * Для удаления данных следует изменить значение на `undefined`
 *
 * @param key - Ключ по которому будет происходить загрузка / запись
 * @returns Текущее значение, функция для его изменения, а также происходит ли всё ещё загрузка
 */
const useStorage = <T>(key: string): readonly [T | undefined, StateSetter<T | undefined>, boolean] => {
  const [value, setValue] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const setter = useEvent<StateSetter<T | undefined>>((newState) => {
    const newValue = isNewStateSetter(newState) ? newState(value) : newState;
    setValue(newValue);
    void storage.set(key, newValue);
  });

  useEffect(() => {
    setValue(storage.get<T>(key));
    setIsLoading(false);
  }, [key]);

  useDebugValue(value);
  return [value, setter, isLoading] as const;
};

export default useStorage;
