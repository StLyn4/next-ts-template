import { AxiosResponse } from 'axios';

interface ErrorObject {
  message: string;
}

interface ErrorListContainer {
  messages: ErrorObject[];
}

interface StrapiError {
  message: string | ErrorObject | ErrorListContainer[];
}

export interface ApiError {
  /** Статус запроса */
  status: number;

  /** Сообщение об ошибке */
  message: string;
}

/**
 * Получить информацию об ошибке с ответа сервера
 *
 * @param response - Ответ сервера с ошибкой
 * @returns Информацией об ошибке
 */
const extractStrapiError = (response: AxiosResponse<StrapiError>): ApiError => {
  const { status, data } = response;
  let message = 'Неожиданная ошибка';

  if (typeof data.message === 'string') {
    message = data.message;
  } else if (Array.isArray(data.message)) {
    message = data.message[0].messages[0].message;
  } else if (typeof data.message === 'object' && 'message' in data.message) {
    message = data.message.message;
  }

  return { status, message };
};

export default extractStrapiError;
