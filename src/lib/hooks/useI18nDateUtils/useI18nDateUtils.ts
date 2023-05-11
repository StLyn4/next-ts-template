import useTranslation from 'next-translate/useTranslation';

import { useEvent } from 'app/lib/hooks';

interface DateUtils {
  /** Получение даты с временем */
  getFullDate: (date: Date | string) => string;

  /** Получение даты без времени */
  getDate: (date: Date | string) => string;

  /** Получение только времени */
  getTime: (date: Date | string) => string;
}

/**
 * Предоставляет инструменты для работы с датами с учётом текущего языка
 *
 * @returns Функции для работы с датами
 */
const useI18nDateUtils = (): DateUtils => {
  const { lang } = useTranslation();

  const getFullDate = useEvent((date: Date | string) => {
    return new Date(date).toLocaleString(lang, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
    });
  });

  const getDate = useEvent((date: Date | string) => {
    return new Date(date).toLocaleString(lang, { year: 'numeric', month: 'long', day: '2-digit' });
  });

  const getTime = useEvent((date: Date | string) => {
    return new Date(date).toLocaleString(lang, { hour: 'numeric', minute: 'numeric' });
  });

  return { getFullDate, getDate, getTime };
};

export default useI18nDateUtils;
