import { type AxiosResponse } from 'axios';

import { type ApiError, type StrapiError, isStrapiErrorObject, isStrapiErrorList, type StrapiErrorList } from 'app/types';

/**
 * Извлечение текста ошибки с массива ошибок
 *
 * @param err - Контейнер для нескольких ошибок Strapi
 * @returns Строка с ошибками, разделёнными переносом строки, если удалось найти
 */
const extractFromErrorList = (err: StrapiErrorList): string | undefined => {
  const messages: string[] = [];

  if ('messages' in err && Array.isArray(err.messages) && err.messages.length > 0) {
    for (const message of err.messages) {
      const extractedMessage = extractError(message);
      if (typeof extractedMessage !== 'undefined') {
        messages.push(extractedMessage);
      }
    }
  }

  if ('message' in err && Array.isArray(err.message) && err.message.length > 0) {
    for (const message of err.message) {
      const extractedMessage = extractError(message);
      if (typeof extractedMessage !== 'undefined') {
        messages.push(extractedMessage);
      }
    }
  }

  if (messages.length > 0) {
    return messages.join('\n');
  }
};

/**
 * Извлечение текста ошибки
 *
 * @param err - Ошибка в формате Strapi
 * @returns Строка с ошибкой, если удалось найти
 */
const extractError = (err: StrapiError): string | undefined => {
  if (isStrapiErrorObject(err)) {
    if (typeof err.message === 'string') {
      // Добрались до желаемой цели - строки с ошибкой
      return err.message;
    }

    return extractError(err.message);
  }

  if (isStrapiErrorList(err)) {
    return extractFromErrorList(err);
  }
};

/**
 * Получить информацию об ошибке с ответа сервера
 *
 * @param response - Ответ сервера с ошибкой
 * @returns Информацией об ошибке
 */
const extractStrapiError = (response: AxiosResponse<StrapiError>): ApiError => {
  const { status, statusText, data } = response;
  const message = extractError(data) ?? statusText ?? 'Unexpected error';

  return { success: false, status, message };
};

export default extractStrapiError;
