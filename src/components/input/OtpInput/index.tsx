import React, { useState, useRef, useImperativeHandle, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import OtpInputComponent from 'react18-input-otp';
import { useDebouncedCallback } from 'use-debounce';

import InputMessages from 'app/components/input/InputMessages';
import { type BaseInputRef, type BaseInputProps, type InputValidatorCallback } from 'app/components/input/types';
import { useEvent, useInputState } from 'app/lib/hooks';
import { clamp, deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export interface OtpInputRef extends BaseInputRef {
  /** Сфокусироваться на поле ввода */
  focus: (index?: number) => void;
};

export interface OtpInputProps extends BaseInputProps {
  /** Размер поля */
  size?: 'large' | 'small';

  /** Ожидаемая длина пароля */
  length: number;

  /** Разрешить вводить только числа */
  onlyNumbers?: boolean;

  /** Скрывать ли вводимые символы */
  secret?: boolean;
}

/** Поле для ввода одноразовых паролей (OTP) */
const OtpInput: React.ForwardRefRenderFunction<OtpInputRef, OtpInputProps> = ({
  size = 'large',
  disabled = false,
  enterKeyHint,
  inputMode,
  autoComplete = 'one-time-code',
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
  length,
  onlyNumbers = false,
  secret = false,
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
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const inputFieldRef = useRef<OtpInputComponent>(null);
  const [focused, setFocused] = useState(false);
  const [inputElements, setInputElements] = useState<HTMLInputElement[]>([]);

  const clampedLength = Math.max(0, length);
  const hasError = error.length > 0;

  const isInputValid = useMemo(() => {
    return !hasError && value.length === length;
  }, [hasError, value.length, length]);

  // Нужно для того, чтобы blur не применялся при переключении ячеек
  const debouncedSetFocused = useDebouncedCallback((newFocused: boolean) => {
    if (focused !== newFocused) {
      setFocused(newFocused);

      if (newFocused) {
        onFocus?.();
      } else {
        onBlur?.();
      }
    }
  }, 100);

  const handleGetInputElements = useEvent(() => {
    setInputElements(() => {
      const { current: wrapperElement } = inputWrapperRef;
      const { current: fieldElement } = inputFieldRef;

      if (wrapperElement && fieldElement && length > 0) {
        // Получение всех элементов с классом `cell`
        const elementsCollection = wrapperElement.querySelectorAll<HTMLInputElement>('.' + styles.cell);
        return Array.from(elementsCollection);
      }

      return [];
    });
  });

  const handleFocus = useEvent((index: number, event: React.FocusEvent<HTMLInputElement>) => {
    const { current: fieldElement } = inputFieldRef;

    if (fieldElement) {
      // Фокусировка применяет немедленно
      debouncedSetFocused(true);
      debouncedSetFocused.flush();

      // Накладывание слушателей на onFocus / onBlur ломает логику библиотеки,
      // поэтому необходимо выставить состояние вручную
      fieldElement.setState({ activeInput: index });

      // Выделение текста в ячейке
      event.target.select();
    }
  });

  const handleBlur = useEvent(() => {
    const { current: fieldElement } = inputFieldRef;

    if (fieldElement) {
      debouncedSetFocused(false);
      fieldElement.setState({ activeInput: -1 });
    }
  });

  const handleConfirm = useEvent(() => {
    if (onConfirm && isInputValid) {
      blurField();
      void onConfirm(value);
    }
  });

  const focusField = useEvent((index: number = value.length) => {
    const clampedIndex = clamp(index, 0, length - 1);
    const inputElement = inputElements[clampedIndex];
    inputElement?.focus();
  });

  const blurField = useEvent(() => {
    const { current: fieldElement } = inputFieldRef;
    if (fieldElement && focused) {
      const focusedIndex = fieldElement.state.activeInput;
      const focusedElement = inputElements[focusedIndex];
      focusedElement?.blur();
    }
  });

  const scrollIntoView = useEvent(() => {
    const clampedNextIndex = clamp(value.length, 0, length - 1);
    const inputElement = inputElements[clampedNextIndex];
    inputElement?.scrollIntoView();
  });

  /** Пропсы, которые будут переданы `input` элементам, которые используются в качестве ячеек */
  const inputProps = useMemo(() => {
    const result: Partial<React.InputHTMLAttributes<HTMLInputElement>>[] = [];

    for (let i = 0; i < length; i++) {
      result.push({
        enterKeyHint,
        inputMode: inputMode ?? (onlyNumbers ? 'numeric' : 'text'),
        onFocus: (event) => handleFocus(i, event),
        onBlur: handleBlur,
      });
    }

    return result;
  }, [length, enterKeyHint, inputMode, onlyNumbers, handleFocus, handleBlur]);

  useEffect(() => {
    if (isInputValid) {
      handleConfirm();
    }
  }, [handleConfirm, isInputValid]);

  useEffect(() => {
    handleGetInputElements();
  }, [handleGetInputElements, length]);

  useImperativeHandle(ref, () => ({
    focus: focusField,
    blur: blurField,
    validate: handleValidate,
    hideError: handleHideError,
    scrollIntoView,
  }), [focusField, blurField, handleValidate, handleHideError, scrollIntoView]);

  return (
    <div ref={inputWrapperRef} className={styles.inputWrapper}>
      {label ? <span className={styles.label}>{label}</span> : null}

      <OtpInputComponent
        ref={inputFieldRef}
        containerStyle={styles.input}
        inputStyle={classNames(styles.cell, styles[`size-${size}`])}
        disabledStyle={styles.disabled}
        focusStyle={styles.focus}
        errorStyle={styles.error}
        numInputs={clampedLength}
        isDisabled={disabled}
        hasErrored={hasError}
        placeholder={placeholder}
        onChange={handleChange}
        onSubmit={handleConfirm}
        autoComplete={autoComplete}
        value={value}
        isInputNum={onlyNumbers}
        isInputSecure={secret}
        inputProps={inputProps}
      />

      <InputMessages
        disabled={disabled}
        focused={focused}
        errorMessage={error}
      />
    </div>
  );
};

export default deepMemo(React.forwardRef(OtpInput));
export type { InputValidatorCallback };
