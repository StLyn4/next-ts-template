import React from 'react';
import classNames from 'classnames';
import { AnimatePresence, type Variants, m } from 'framer-motion';

import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

const messagesVariants: Variants = {
  hidden: {
    opacity: 0,
    y: '-100%',
    height: 0,
    overflow: 'hidden',
  },
  visible: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transitionEnd: {
      overflow: 'visible',
    },
  },
};

const errorVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const maxLengthVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export interface InputMessagesProps {
  /** Отключён ли ввод */
  disabled?: boolean;

  /** Находится ли поле ввода в фокусе */
  focused?: boolean;

  /** Ошибка ввода */
  errorMessage?: string;

  /** Текущая длина ввода */
  currentLength?: number;

  /** Максимальная длина ввода */
  maxLength?: number;
}

/** Стандартный бар для вывода сообщений об ошибках и лимите длины ввода */
const InputMessages: React.FC<InputMessagesProps> = ({
  disabled = false,
  focused = false,
  errorMessage = '',
  currentLength = 0,
  maxLength = Infinity,
}) => {
  const clampedCurrentLength = Math.max(0, currentLength);
  const clampedMaxLength = Math.max(0, maxLength);
  const isMaxLengthLimited = clampedMaxLength < Infinity;
  const isInputOverflowed = clampedCurrentLength > clampedMaxLength;

  const hasError = errorMessage.length > 0;
  const showMessages = hasError || isMaxLengthLimited;
  const showError = showMessages && !disabled && hasError;

  return (
    <AnimatePresence initial={false}>
      {showMessages ? (
        <m.p
          className={styles.messages}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={messagesVariants}
        >
          <AnimatePresence initial={false}>
            {showError ? (
              <m.span
                key="error-message"
                className={styles.errorMessage}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={errorVariants}
              >
                {errorMessage}
              </m.span>
            ) : null}

            {isMaxLengthLimited ? (
              <m.span
                key="length-message"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={maxLengthVariants}
                className={classNames(styles.lengthMessage, {
                  [styles.focus]: !disabled && focused,
                  [styles.error]: isInputOverflowed,
                })}
              >
                {clampedCurrentLength} / {clampedMaxLength}
              </m.span>
            ) : null}
          </AnimatePresence>
        </m.p>
      ) : null}
    </AnimatePresence>
  );
};

export default deepMemo(InputMessages);
