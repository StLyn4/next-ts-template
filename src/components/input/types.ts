export type InputableElement = HTMLInputElement | HTMLTextAreaElement;
export type InputValidatorCallback<T = string> = (value: T) => string | null | undefined;

/** Описание ref поля ввода */
export interface BaseInputRef<T = string> {
  /** Сфокусироваться на поле ввода */
  focus: () => void;

  /** Расфокус поля ввода */
  blur: () => void;

  /** Провести валидацию данных (поле не будет стилизовано в случае передачи ввода в качества аргумента) */
  validate: (value?: T) => string | null;

  /** Сброс ошибок валидатора */
  hideError: () => void;

  /** Прокрутка к текущему компоненту */
  scrollIntoView: Element['scrollIntoView'];
}

export interface BaseInputProps<T = string> {
  /** Отключён ли ввод */
  disabled?: boolean;

  /** Кнопка, которая будет отображаться на виртуальной клавиатуре вместо Enter */
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';

  /** Какого типа виртуальную клавиатуру показывать при вводе */
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'url';

  /** Какого типа данные использовать для автозаполнения, если возможно */
  autoComplete?: 'off' | 'on' |
    'name' | 'honorific-prefix' | 'given-name' | 'additional-name' | 'family-name' | 'honorific-suffix' | 'nickname' |
    'email' | 'username' | 'new-password' | 'current-password' | 'one-time-code' |
    'organization-title' | 'organization' |
    'street-address' | 'address-line1' | 'address-line2' | 'address-line3' |
    'address-level4' |'address-level3' | 'address-level2' | 'address-level1' |
    'country' | 'country-name' | 'postal-code' |
    'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name' |
    'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' |
    'transaction-currency' | 'transaction-amount' |
    'bday' | 'bday-day' | 'bday-month' | 'bday-year' |
    'tel' | 'tel-country-code' | 'tel-national' | 'tel-area-code' | 'tel-local' | 'tel-extension' |
    'language' | 'sex' | 'url' | 'photo' | 'impp' | 'webauthn';

  /** Метка-название поля ввода */
  label?: string;

  /** Подсказка пользователю, которая видна, если текст не введён */
  placeholder?: string;

  /** Данные поля */
  value?: T;

  /** Изначальные данные поля (для неконтролируемого варианта) */
  initialValue?: T;

  /** Ошибка, которая будет отображена под полем */
  errorMessage?: string;

  /** Время минимальной задержки (в мс) между вызовами функций, имеющих её */
  debounceTimeout?: number;

  /** Валидатор содержимого */
  validator?: InputValidatorCallback<T>;

  /** Callback на случай изменения поля */
  onChange?: (value: T) => void;

  /** Callback на случай изменения поля с debounce эффектом */
  onDebouncedChange?: (value: T) => void | Promise<void>;

  /** Callback на случай фокусировки на поле */
  onFocus?: () => void;

  /** Callback на случай потери фокуса */
  onBlur?: () => void;

  /** Callback на случай подтверждения ввода (в основном, нажатием Enter) */
  onConfirm?: (value: T) => void | Promise<void>;
}
