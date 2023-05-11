import React from 'react';
import classNames from 'classnames';
import { AnimatePresence, type Variants, m } from 'framer-motion';

import Vector from 'app/components/ui/Vector';
import Clickable from 'app/components/utils/Clickable';
import { useOptionallyControlledState, useEvent } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export type CheckboxChangeCallback = (value: boolean) => void;

const tickVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

export interface CheckboxProps {
  /** Тест возле чекбокса */
  children?: string;

  /** Тип чекбокса */
  type?: 'checkbox' | 'radio' | 'toggle';

  /** Отключён ли чекбокс */
  disabled?: boolean;

  /** Отмечен ли чекбокс */
  checked?: boolean;

  /** Отмечен ли изначально чекбокс (для неконтролируемого варианта) */
  initialChecked?: boolean;

  /** Callback на случай изменения выбора */
  onChange?: CheckboxChangeCallback;
}

/** Чекбокс, переключатель */
const Checkbox: React.FC<CheckboxProps> = ({
  children = '',
  type = 'checkbox',
  disabled = false,
  checked,
  initialChecked = false,
  onChange,
}) => {
  const [inputChecked, setInputChecked] = useOptionallyControlledState(checked, initialChecked, onChange);

  const handleClick = useEvent(() => {
    if (!disabled) {
      setInputChecked(!inputChecked);
    }
  });

  return (
    <Clickable disabled={disabled} onClick={handleClick}>
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
            <div className={classNames(styles.dot, { [styles.checked]: inputChecked })} />
          ) : (
            <AnimatePresence>
              {inputChecked && (
                <m.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={tickVariants}
                >
                  <Vector src="common/check" size={12} />
                </m.div>
              )}
            </AnimatePresence>
          )}
        </div>
        {children && <span className={styles.text}>{children}</span>}
      </div>
    </Clickable>
  );
};

export default deepMemo(Checkbox);
