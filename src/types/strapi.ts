import { type XOR } from 'ts-essentials';

/** Ответ API с ошибкой */
export interface ApiError {
  /** Успешно ли завершён запрос */
  success: false;

  /** Статус запроса */
  status?: number;

  /** Сообщение об ошибке */
  message: string;
}

/** Успешный ответ API */
export interface ApiSuccess<T> {
  /** Успешно ли завершён запрос */
  success: true;

  /** Данные запроса */
  data: T;
}

/** Ответ API */
export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

/** Контейнер для одиночной ошибки Strapi */
export interface StrapiErrorObject {
  /** Ошибка Strapi */
  message: StrapiError | string;
}

/** Контейнер для нескольких ошибок Strapi */
export type StrapiErrorList = XOR<
  {
    /** Массив ошибок Strapi */
    messages: StrapiError[];
  },
  {
    /** Массив ошибок Strapi */
    message: StrapiError[];
  }
>

/** Ошибка Strapi */
export type StrapiError = StrapiErrorObject | StrapiErrorList;
