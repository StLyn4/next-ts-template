import { type DeepReadonly } from 'ts-essentials';

import { EnvironmentError } from 'app/lib/errors';
import { parseArray, parseDate } from 'app/lib/utils/string/parsers';
import trimQuotes from 'app/lib/utils/string/trimQuotes';

interface EnvironmentVariables {
  /** Собран ли проект в режиме разработки */
  IS_DEVELOPMENT: boolean;

  /** Базовый адрес для API-запросов, включая протокол */
  API_URL: string;

  /** Адрес, по которому будет развёрнуто приложение, включая протокол */
  PUBLIC_URL: string;

  /** Токен доступа Mapbox */
  MAPBOX_TOKEN: string;

  /** Пример значения с пробелами в объявлении */
  SPACED_EXAMPLE: string;

  /** Пример массива */
  ARRAY_EXAMPLE: number[];

  /** Пример даты */
  DATE_EXAMPLE: Date;
}

/**
 * Получает переменную окружения
 *
 * @param envVariableName - Название переменной окружения
 * @param envVariable - Значение переменной окружения (начиная с `process.env.`)
 * @param optional - Признак, что переменная окружения не обязательна
 * @returns Значение переменной окружения, ошибка, или же пустая строка
 */
const getEnvVariable = (envVariableName: string, envVariable: string | undefined, optional = false): string => {
  const isServerSide = typeof window === 'undefined';
  const isPublicVariable = envVariableName.startsWith('NEXT_PUBLIC_');

  if (typeof envVariable === 'undefined') {
    if (!optional) {
      if (isServerSide || (isPublicVariable && !isServerSide)) {
        throw new EnvironmentError(`Переменная среды исполнения не объявлена: ${envVariableName}`);
      }
    }

    // Serverside-переменная недоступна на стороне клиента, но и ошибки в этом нет.
    // Либо же переменная опциональная и не объявлена
    return '';
  }

  return trimQuotes(envVariable);
};

const env: DeepReadonly<EnvironmentVariables> = {
  IS_DEVELOPMENT: getEnvVariable('NODE_ENV', process.env.NODE_ENV) === 'development',
  API_URL: getEnvVariable('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL),
  PUBLIC_URL: getEnvVariable('PUBLIC_URL', process.env.PUBLIC_URL),
  MAPBOX_TOKEN: getEnvVariable('NEXT_PUBLIC_MAPBOX_TOKEN', process.env.NEXT_PUBLIC_MAPBOX_TOKEN),

  SPACED_EXAMPLE: getEnvVariable('SPACED_EXAMPLE', process.env.SPACED_EXAMPLE),
  ARRAY_EXAMPLE: parseArray(getEnvVariable('ARRAY_EXAMPLE', process.env.ARRAY_EXAMPLE)),
  DATE_EXAMPLE: parseDate(getEnvVariable('DATE_EXAMPLE', process.env.DATE_EXAMPLE)),
};

export default env;
