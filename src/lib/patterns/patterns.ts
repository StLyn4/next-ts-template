// Для визуализации регулярных выражений рекомендуется использовать https://regexper.com/

export const EMAIL_PATTERN = /(?:[a-z\d!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z\d!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z\d](?:[a-z\d-]*[a-z\d])?|\[(?:(2(5[0-5]|[0-4]\d)|1\d\d|[1-9]?\d)\.){3}(?:(2(5[0-5]|[0-4]\d)|1\d\d|[1-9]?\d)|[a-z\d-]*[a-z\d]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/i;
export const PASSWORD_PATTERN = /^(?=.*[a-zA-Z])[\w~@#$%^&*+=`|{}:;!.?"()\[\]-]{16,64}$/;
export const ALLOWED_URL_PROTOCOLS_PATTERN = /^https?$/;
export const QUOTED_STRING_PATTERN = /^(["'])(.*)(\1)$/;
export const BOOLEAN_PATTERN = /^(true|false)$/i;
export const DURATION_PATTERN = /([+-]?\d+(?:\.\d+)?)(ms|s|m|h|d)/i;
