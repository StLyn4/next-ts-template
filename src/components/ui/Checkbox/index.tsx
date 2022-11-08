import React from 'react';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';

import Clickable from 'app/components/utils/Clickable';
import Vector from 'app/components/ui/Vector';
import Animate from 'app/components/ui/Animate';

import { useOptionallyControlledState, useEvent } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export type CheckboxChangeCallback = (value: boolean) => void;

export interface CheckboxProps {
  /** Тест возле чекбокса */
  children?: string;

  /** Отмечен ли чекбокс */
  checked?: boolean;

  /** Отмечен ли изначально чекбокс (для неконтролируемого варианта) */
  initialChecked?: boolean;

  /** Callback на случай изменения выбора */
  onChange?: CheckboxChangeCallback;

  /** Тип чекбокса */
  type?: 'checkbox' | 'radio' | 'toggle';

  /** Отключён ли чекбокс */
  disabled?: boolean;
}

/** Чекбокс, переключатель */
const Checkbox: React.FC<CheckboxProps> = ({
  children = '',
  checked,
  initialChecked = false,
  onChange,
  disabled = false,
  type = 'checkbox',
}) => {
  const [inputChecked, setInputChecked] = useOptionallyControlledState(checked, initialChecked, onChange);

  const handleClick = useEvent(() => {
    if (!disabled) {
      setInputChecked(!inputChecked);
    }
  });

  return (
    <Clickable disabled={disabled} cursor={disabled ? 'default' : 'pointer'} onClick={handleClick}>
      <div className={styles.checkboxWrapper} role="checkbox" aria-checked={inputChecked}>
        <div
          className={classNames(styles.checkboxBorder, {
            [styles.checkbox]: type === 'checkbox',
            [styles.radio]: type === 'radio',
            [styles.toggle]: type === 'toggle',
            [styles.checked]: inputChecked,
            [styles.disabled]: disabled,
          })}
        >
          {type === 'radio' || type === 'toggle' ? (
            <div
              className={classNames(styles.dot, {
                [styles.checked]: inputChecked,
                [styles.disabled]: disabled,
              })}
            />
          ) : (
            <AnimatePresence>
              {inputChecked && (
                <Animate
                  className={classNames({ [styles.disabled]: disabled })}
                  animate={['opacity', 'scale']}
                >
                  <Vector src="common/check" color="var(--vector-color)" size={12} />
                </Animate>
              )}
            </AnimatePresence>
          )}
        </div>
        {children && (
          <span
            className={classNames(styles.text, {
              [styles.gray]: !inputChecked || disabled,
            })}
          >
            {children}
          </span>
        )}
      </div>
    </Clickable>
  );
};
export default deepMemo(Checkbox);
