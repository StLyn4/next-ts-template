import React, { useState, useRef, useImperativeHandle, useMemo } from 'react';
import PhoneInputComponent, { isPossiblePhoneNumber, type Country } from 'react-phone-number-input/input';
import classNames from 'classnames';

import InputMessages from 'app/components/input/InputMessages';
import { type BaseInputRef, type BaseInputProps, type InputValidatorCallback } from 'app/components/input/types';
import VectorButton from 'app/components/ui/VectorButton';
import Clickable, { type ClickCallback } from 'app/components/utils/Clickable';
import { useEvent, useInputState } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export type PhoneInputRef = BaseInputRef;

export interface PhoneInputProps extends BaseInputProps {
  /** Размер поля */
  size?: 'large' | 'small';

  /** Иконка слева */
  iconLeft?: string;

  /** Иконка справа */
  iconRight?: string;

  /** Callback на случай нажатия на иконку слева */
  onIconLeftClick?: ClickCallback;

  /** Callback на случай нажатия на иконку справа */
  onIconRightClick?: ClickCallback;

  /** Номера какой страны разрешены к вводу */
  country?: Country;

  /** Если номер введён в национальном формате, то он будет обработан как номер указанной страны */
  defaultCountry?: Country;
}

/** Поле ввода номера телефона */
const PhoneInput: React.ForwardRefRenderFunction<PhoneInputRef, PhoneInputProps> = ({
  size = 'large',
  disabled = false,
  enterKeyHint,
  inputMode = 'tel',
  autoComplete = 'tel',
  label,
  placeholder = '',
  value: controlledValue,
  initialValue = '',
  errorMessage = '',
  debounceTimeout = 500,
  validator,
  onChange: onControlledChange,
  onDebouncedChange,
  onFocus,
  onBlur,
  onConfirm,
  iconLeft,
  iconRight,
  onIconLeftClick,
  onIconRightClick,
  country,
  defaultCountry,
}, ref) => {
  const { value, error, handleChange, handleValidate, handleHideError } = useInputState(
    controlledValue,
    initialValue,
    errorMessage,
    debounceTimeout,
    onControlledChange,
    onDebouncedChange,
    validator,
  );

  // Для работы с фокусировкой
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const hasError = error.length > 0;

  const isInputValid = useMemo(() => {
    return !hasError && isPossiblePhoneNumber(value);
  }, [hasError, value]);

  const handleFocus = useEvent(() => {
    if (!focused) {
      setFocused(true);
      onFocus?.();
    }
  });

  const handleBlur = useEvent(() => {
    if (focused) {
      setFocused(false);
      onBlur?.();
    }
  });

  const handleConfirm = useEvent(() => {
    if (onConfirm && isInputValid) {
      blurField();
      void onConfirm(value);
    }
  });

  const handleKeyPress = useEvent((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleConfirm();
    }
  });

  const handleFieldChange = useEvent((value: string | undefined) => {
    handleChange(value ?? '');
  });

  const focusField = useEvent(() => {
    const { current: fieldElement } = inputFieldRef;
    if (fieldElement && !focused) {
      fieldElement.focus();
    }
  });

  const blurField = useEvent(() => {
    const { current: fieldElement } = inputFieldRef;
    if (fieldElement && focused) {
      fieldElement.blur();
    }
  });

  const scrollIntoView = useEvent(() => {
    const { current: fieldElement } = inputFieldRef;
    if (fieldElement) {
      fieldElement.scrollIntoView();
    }
  });

  useImperativeHandle(ref, () => ({
    focus: focusField,
    blur: blurField,
    validate: handleValidate,
    hideError: handleHideError,
    scrollIntoView,
  }), [focusField, blurField, handleValidate, handleHideError, scrollIntoView]);

  return (
    <div className={styles.inputWrapper}>
      {label ? <span className={styles.label}>{label}</span> : null}

      <Clickable disabled={disabled} cursor="text" onClick={focusField}>
        <div
          className={classNames(styles.input, styles[`size-${size}`], {
            [styles.disabled]: disabled,
            [styles.focus]: focused,
            [styles.error]: hasError,
          })}
        >
          {iconLeft ? (
            <VectorButton
              src={iconLeft}
              type="secondary"
              shape="vector-only"
              size={24}
              padding={2}
              onClick={onIconLeftClick}
            />
          ) : null}

          <PhoneInputComponent
            ref={inputFieldRef}
            className={styles.field}
            disabled={disabled}
            placeholder={placeholder}
            onChange={handleFieldChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyPress}
            value={value}
            enterKeyHint={enterKeyHint}
            inputMode={inputMode}
            autoComplete={autoComplete}
            country={country}
            defaultCountry={defaultCountry}
            international
            withCountryCallingCode
          />

          {iconRight ? (
            <VectorButton
              type="secondary"
              shape="vector-only"
              src={iconRight}
              size={24}
              padding={2}
              onClick={onIconRightClick}
            />
          ) : null}
        </div>
      </Clickable>

      <InputMessages
        disabled={disabled}
        focused={focused}
        errorMessage={error}
      />
    </div>
  );
};

export default deepMemo(React.forwardRef(PhoneInput));
export type { InputValidatorCallback };
