import React, { useState, useRef, useImperativeHandle, useMemo } from 'react';
import { useDisclosure } from '@mantine/hooks';
import classNames from 'classnames';

import InputMessages from 'app/components/input/InputMessages';
import { type BaseInputRef, type BaseInputProps, type InputValidatorCallback } from 'app/components/input/types';
import VectorButton from 'app/components/ui/VectorButton';
import Clickable, { type ClickCallback } from 'app/components/utils/Clickable';
import { useEvent, useInputState } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export type InputRef = BaseInputRef;

export interface InputProps extends BaseInputProps {
  /** Тип поля */
  type?: 'text' | 'number' | 'password' | 'url' | 'email' | 'search';

  /** Размер поля */
  size?: 'large' | 'small';

  /** Максимальная длина текста */
  maxLength?: number;

  /** Иконка слева */
  iconLeft?: string;

  /** Иконка справа */
  iconRight?: string;

  /** Callback на случай нажатия на иконку слева */
  onIconLeftClick?: ClickCallback;

  /** Callback на случай нажатия на иконку справа */
  onIconRightClick?: ClickCallback;

  /** Минимальное значение для числового ввода */
  min?: number;

  /** Максимальное значение для числового ввода */
  max?: number;
}

/** Стандартное поле ввода */
const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = ({
  type = 'text',
  size = 'large',
  disabled = false,
  enterKeyHint,
  inputMode,
  autoComplete,
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
  maxLength = Infinity,
  iconLeft,
  iconRight,
  onIconLeftClick,
  onIconRightClick,
  min,
  max,
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

  const [showPassword, { toggle: toggleShowPassword }] = useDisclosure(false);

  const clampedMaxLength = Math.max(0, maxLength);
  const hasError = error.length > 0;

  const isInputValid = useMemo(() => {
    return !hasError;
  }, [hasError]);

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

      // Если это поле для пароля, то не обрезаем пустые символы по краям
      const trimmedValue = type === 'password' ? value : value.trim();
      handleValidate(trimmedValue);

      if (trimmedValue !== value) {
        handleChange(trimmedValue);
      }
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

  const handleFieldChange = useEvent((event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event.target.value);
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
          className={classNames(styles.input, styles[`type-${type}`], styles[`size-${size}`], {
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

          {/* Отключаем правило, так как это внутренняя непосредственная реализация <Input> */}
          {/* eslint-disable-next-line react/forbid-elements */}
          <input
            ref={inputFieldRef}
            className={styles.field}
            maxLength={clampedMaxLength}
            min={min}
            max={max}
            disabled={disabled}
            placeholder={placeholder}
            onChange={handleFieldChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyPress}
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            enterKeyHint={enterKeyHint}
            inputMode={inputMode}
            autoComplete={autoComplete}
            value={value}
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

          {type === 'search' ? (
            <VectorButton
              type="secondary"
              src="common/magnifying-glass"
              size={24}
              padding={2}
              onClick={handleConfirm}
            />
          ) : null}

          {type === 'password' ? (
            <VectorButton
              type="secondary"
              shape="vector-only"
              src={showPassword ? 'common/eye-off' : 'common/eye'}
              size={24}
              padding={2}
              onClick={toggleShowPassword}
            />
          ) : null}
        </div>
      </Clickable>

      <InputMessages
        disabled={disabled}
        focused={focused}
        errorMessage={error}
        currentLength={value.length}
        maxLength={clampedMaxLength}
      />
    </div>
  );
};

export default deepMemo(React.forwardRef(Input));
export type { InputValidatorCallback };
