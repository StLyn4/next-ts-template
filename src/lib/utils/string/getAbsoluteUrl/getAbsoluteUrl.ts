import { env } from 'app/lib/constants';

let domain: string;

if (typeof window !== 'undefined') {
  domain = window.location.origin;
} else {
  domain = new URL(env.PUBLIC_URL).origin;
}

/**
 * Создаёт абсолютную ссылку с относительной
 *
 * @param url - Относительная ссылка
 * @returns Абсолютная ссылка
 */
const getAbsoluteUrl = (url: string): string => {
  return new URL(url, domain).href;
};

export default getAbsoluteUrl;
