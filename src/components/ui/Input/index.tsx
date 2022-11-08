import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, Variants } from 'framer-motion';
import classNames from 'classnames';
import { useDisclosure } from '@mantine/hooks';
import { useDebouncedCallback } from 'use-debounce';

import Clickable from 'app/components/utils/Clickable';
import Vector from 'app/components/ui/Vector';
import VectorButton from 'app/components/ui/VectorButton';
import Animate from 'app/components/ui/Animate';

import { useOptionallyControlledState, useEvent } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

const PhoneInput = dynamic(() => import('react-phone-input-2'));

export type InputChangeCallback = (value: string) => void;
export type InputValidatorCallback = (value: string) => string | null | undefined;

export interface InputProps {
  /** Тип поля */
  type?: 'text' | 'number' | 'password' | 'search' | 'url' | 'tel' | 'email' | 'textarea';

  /** Кнопка, которая будет отображаться на виртуальной клавиатуре вместо Enter */
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';

  /** Данные поля */
  value?: string;

  /** Изначальные данные поля (для неконтролируемого варианта) */
  initialValue?: string;

  /** Подсказка пользователю, которая видна, если текст не введён */
  placeholder?: string;

  /** Callback на случай изменения поля */
  onChange?: InputChangeCallback;

  /** Callback на случай изменения поля с debounce эффектом */
  onDebouncedChange?: InputChangeCallback;

  /** Валидатор содержимого */
  validator?: InputValidatorCallback;

  /** Иконка слева */
  icon?: string;

  /** Иконка справа */
  iconRight?: string;

  /** Отключён ли ввод */
  disabled?: boolean;

  /** Автофокусировка */
  autoFocus?: boolean;

  /** Максимальная длина текста */
  maxLength?: number;

  /** Минимальное значения для числового ввода */
  min?: number;

  /** Максимальное значения для числового ввода */
  max?: number;
}

const errorVariants: Variants = {
  hide: {
    opacity: 0,
    scale: 0.4,
    y: '-100%',
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
};

/** Поле для ввода информации */
const Input: React.FC<InputProps> = ({
  type = 'text',
  enterKeyHint,
  value,
  initialValue = '',
  placeholder = '',
  onChange,
  onDebouncedChange,
  validator,
  icon,
  iconRight,
  disabled = false,
  maxLength = Infinity,
  min = -Infinity,
  max = Infinity,
}) => {
  const [showPassword, { toggle: toggleShowPassword }] = useDisclosure(false);
  const [inputValue, setInputValue] = useOptionallyControlledState(value, initialValue, onChange);
  const [error, setError] = useState('');

  // Для фокуса по нажатию на сам блок
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const handleClick = useEvent(() => {
    const { current: inputField } = inputFieldRef;

    if (inputField) {
      inputField.focus();
    }
  });

  const handleBlur = useEvent(() => {
    // Если это поле для пароля, то не обрезаем пустые символы по краям
    const trimmedValue = type === 'password' ? inputValue : inputValue.trim();

    if (trimmedValue !== inputValue) {
      setInputValue(trimmedValue);
      debouncedValidateInput(trimmedValue);
    }
  });

  const handleDebouncedChange = useDebouncedCallback((value: string): void => {
    if (typeof onDebouncedChange === 'function') {
      onDebouncedChange(value);
    }
  }, 500);

  const handleChange = useEvent((valueOrEvent: string | React.ChangeEvent<HTMLInputElement>) => {
    const value = typeof valueOrEvent === 'string' ? valueOrEvent : valueOrEvent.target.value;

    if (typeof onChange === 'function') {
      onChange(value);
    }

    setInputValue(value);
    handleDebouncedChange(value);
    debouncedValidateInput(value);
  });

  const handleHideError = useEvent(() => {
    setError('');
  });

  const debouncedValidateInput = useDebouncedCallback((value: string): void => {
    if (typeof validator !== 'undefined') {
      const validationError = validator(value);

      if (validationError && !error) {
        setError(validationError);
      } else if (!validationError && error) {
        handleHideError();
      }
    }
  }, 500);

  return (
    <div className={styles.inputWrapper}>
      <Clickable disabled={disabled} cursor={disabled ? 'default' : 'text'} onClick={handleClick}>
        <div
          className={classNames(styles.input, {
            [styles.disabled]: disabled,
            [styles.redBorder]: Boolean(error),
          })}
        >
          {icon && <Vector src={icon} color="#979797" size={19} />}
          {type === 'tel' ? (
            <PhoneInput
              specialLabel=""
              inputClass={styles.field}
              disabled={disabled}
              placeholder={placeholder}
              onChange={handleChange}
              onBlur={handleBlur}
              value={inputValue}
              inputProps={{
                ref: inputFieldRef,
                enterKeyHint,
              }}
              disableDropdown
            />
          ) : (
            // Отключаем правило, так как это внутренняя реализация непосредственно <Input>
            // eslint-disable-next-line react/forbid-elements
            <input
              ref={inputFieldRef}
              className={styles.field}
              maxLength={maxLength}
              min={min}
              max={max}
              disabled={disabled}
              placeholder={placeholder}
              onChange={handleChange}
              onBlur={handleBlur}
              type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
              enterKeyHint={enterKeyHint}
              value={inputValue}
            />
          )}
          {iconRight && <Vector src={iconRight} color="#979797" size={19} />}
          {type === 'password' && (
            <VectorButton src={showPassword ? 'common/eye-off' : 'common/eye'} size={19} onClick={toggleShowPassword} />
          )}
        </div>
      </Clickable>
      <AnimatePresence>
        {error && (
          <Animate initial="hide" animate="show" exit="hide" variants={errorVariants} className={styles.errorAnchor}>
            <Clickable onClick={handleHideError}>
              <div className={styles.errorBox}>
                <span className={styles.text}>{error}</span>
              </div>
            </Clickable>
          </Animate>
        )}
      </AnimatePresence>
    </div>
  );
};

export default deepMemo(Input);
