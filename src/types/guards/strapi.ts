import { type AxiosResponse } from 'axios';

import { type StrapiErrorObject, type StrapiErrorList, type StrapiError } from 'app/types';

/** Проверяет, является ли значение объектом-контейнером для ошибки Strapi */
export const isStrapiErrorObject = (err: unknown): err is StrapiErrorObject => {
  if (typeof err === 'object' && err && 'message' in err) {
    if (typeof err.message === 'string') {
      return true;
    }

    return isStrapiError(err.message);
  }

  return false;
};

/** Проверяет, является ли значение массивом-контейнером для нескольких ошибок Strapi */
export const isStrapiErrorList = (err: unknown): err is StrapiErrorList => {
  if (typeof err === 'object' && err) {
    // Проверяем, есть ли массив `messages`, содержащий исключительно `StrapiError`
    if ('messages' in err && Array.isArray(err.messages) && err.messages.length > 0) {
      for (const message of err.messages) {
        if (!isStrapiError(message)) {
          return false;
        }
      }
      return true;
    }

    // Аналогичная проверка, но для поля `message` (иногда встречается)
    if ('message' in err && Array.isArray(err.message) && err.message.length > 0) {
      for (const message of err.message) {
        if (!isStrapiError(message)) {
          return false;
        }
      }
      return true;
    }
  }

  return false;
};

/** Проверяет инициировано ли объект - ошибкой Strapi */
export const isStrapiError = (err: unknown): err is StrapiError => {
  if (typeof err === 'object' && err) {
    if (isStrapiErrorObject(err)) {
      return true;
    }

    if (isStrapiErrorList(err)) {
      return true;
    }
  }

  return false;
};

/** Проверяет содержит ли ответ Axios ошибку Strapi */
export const isStrapiErrorResponse = (response: AxiosResponse): response is AxiosResponse<StrapiError> => {
  return isStrapiError(response.data);
};
