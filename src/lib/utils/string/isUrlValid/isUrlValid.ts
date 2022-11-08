import { ALLOWED_URL_PROTOCOLS_PATTERN } from 'app/lib/patterns';

/**
 * Проверяет валидность ссылка (разрешает только HTTP(S) протокол)
 *
 * @param url - Ссылка для проверки
 * @returns Валидна ли ссылка
 */
const isUrlValid = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const isProtocolValid = Boolean(urlObj.protocol.match(ALLOWED_URL_PROTOCOLS_PATTERN));
    const isHrefNotEmpty = Boolean(urlObj.href);

    return isProtocolValid && isHrefNotEmpty;
  } catch (err) {
    if (err instanceof TypeError) {
      // new URL(...) выбрасывает TypeError при невалидной ссылке
      return false;
    } else {
      throw err;
    }
  }
};

export default isUrlValid;
