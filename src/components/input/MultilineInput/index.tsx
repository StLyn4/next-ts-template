import React, { useState, useRef, useImperativeHandle, useMemo } from 'react';
import TextareaAutosize, { type TextareaAutosizeProps } from 'react-textarea-autosize';
import classNames from 'classnames';

import InputMessages from 'app/components/input/InputMessages';
import { type BaseInputRef, type BaseInputProps, type InputValidatorCallback } from 'app/components/input/types';
import VectorButton from 'app/components/ui/VectorButton';
import Clickable, { type ClickCallback } from 'app/components/utils/Clickable';
import { useEvent, useInputState } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export type MultilineInputRef = BaseInputRef;

export interface MultilineInputProps extends BaseInputProps {
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

  /** Минимальная высота, выражаемая в строках */
  minRows?: number;

  /** Максимальная высота, выражаемая в строках (после превышения лимита будет включена прокрутка) */
  maxRows?: number;

  /** Callback на случай изменения высоты поля */
  onHeightChange?: TextareaAutosizeProps['onHeightChange'];
}

/** Поле ввода с возможностью ввести несколько строк текста с автоматическим изменением высоты */
const MultilineInput: React.ForwardRefRenderFunction<MultilineInputRef, MultilineInputProps> = ({
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
  minRows,
  maxRows,
  onHeightChange,
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
  const inputFieldRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

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
    }
  });

  const handleConfirm = useEvent(() => {
    if (onConfirm && isInputValid) {
      blurField();
      void onConfirm(value);
    }
  });

  const handleKeyPress = useEvent((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
      handleConfirm();
    }
  });

  const handleFieldChange = useEvent((event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

          <TextareaAutosize
            ref={inputFieldRef}
            className={styles.field}
            maxLength={clampedMaxLength}
            disabled={disabled}
            placeholder={placeholder}
            onChange={handleFieldChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyPress}
            enterKeyHint={enterKeyHint}
            inputMode={inputMode}
            autoComplete={autoComplete}
            value={value}
            minRows={minRows}
            maxRows={maxRows}
            onHeightChange={onHeightChange}
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
        currentLength={value.length}
        maxLength={maxLength}
      />
    </div>
  );
};

export default deepMemo(React.forwardRef(MultilineInput));
export type { InputValidatorCallback };
