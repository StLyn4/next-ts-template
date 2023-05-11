import React from 'react';
import FocusLock from 'react-focus-lock';
import useTranslation from 'next-translate/useTranslation';
import { useScrollLock } from '@mantine/hooks';
import classNames from 'classnames';
import { AnimatePresence, m, type Variants, type AnimationDefinition } from 'framer-motion';

import Button from 'app/components/ui/Button';
import VectorButton from 'app/components/ui/VectorButton';
import Portal from 'app/components/utils/Portal';
import { useEvent, useMountEffect } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    y: 100,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
};

export interface ModalProps {
  /** Содержимое модального окна */
  children: React.ReactNode;

  /** Открыто ли модальное окно */
  open: boolean;

  /** Оглавление окна */
  label: string;

  /** Можно ли закрыть (отменить) модальное окно */
  canDismiss?: boolean;

  /** Текс кнопки отмены */
  dismissButtonText?: string;

  /** Текс кнопки подтверждения  */
  confirmButtonText?: string;

  /** Callback на случай открытия модального окна */
  onOpen?: () => void | Promise<void>;

  /** Callback на случай запроса закрытия модального окна */
  onClose?: () => void | Promise<void>;

  /** Callback на случай отмены */
  onDismiss?: () => void | Promise<void>;

  /** Callback на случай подтверждения */
  onConfirm?: () => boolean | undefined | Promise<boolean | undefined>;

  /** Дополнительная стилизация содержимого */
  className?: string;
}

/** Компонент модальных окон */
const Modal: React.FC<ModalProps> = ({
  children,
  open,
  label,
  dismissButtonText,
  confirmButtonText,
  canDismiss = true,
  onOpen,
  onClose,
  onDismiss,
  onConfirm,
  className,
}) => {
  const { t } = useTranslation();
  useScrollLock(open);

  // Отмена
  const handleDismiss = useEvent(() => {
    if (canDismiss && open) {
      void onDismiss?.();
      void onClose?.();
    }
  });

  // Подтвердить / Продолжить / Ок / Применить
  const handleConfirm = useEvent(async () => {
    const shouldClose = await onConfirm?.() ?? true;
    if (shouldClose) {
      void onClose?.();
    }
  });

  const handleKeyboard = useEvent((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      void handleDismiss();
    }
  });

  const handleIgnoreKeyEvent = useEvent<React.KeyboardEventHandler<HTMLButtonElement>>((event) => {
    event.preventDefault();
  });

  const handleAnimationStart = useEvent((definition: AnimationDefinition) => {
    // Если motion-компонент переходит в состояние `visible`, то значит модальное окно открылось
    if (definition === 'visible') {
      void onOpen?.();
    }
  });

  useMountEffect(() => {
    // Обработчик нажатий клавиш
    document.body.addEventListener('keydown', handleKeyboard);

    // Очистка
    return () => {
      document.body.removeEventListener('keydown', handleKeyboard);
    };
  });

  return (
    <Portal target="body">
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <FocusLock>
            <div
              className={styles.modal}
              role="dialog"
              aria-label={label}
              aria-modal
            >
              <m.button
                className={styles.backdrop}
                type="button"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={backdropVariants}
                onClick={handleDismiss}
                onKeyDown={handleIgnoreKeyEvent}
              />

              <m.div
                className={classNames(styles.card, className)}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={cardVariants}
                onAnimationStart={handleAnimationStart}
              >
                <div className={styles.header}>
                  <span className={styles.label}>{label}</span>
                  {canDismiss ? (
                    <VectorButton
                      type="secondary"
                      src="common/cross"
                      size={36}
                      // padding={8}
                      onClick={handleDismiss}
                    />
                  ) : null}
                </div>

                <div className={styles.content}>
                  {children}
                </div>

                <div className={styles.footer}>
                  {canDismiss ? (
                    <Button type="secondary" onClick={handleDismiss}>
                      {dismissButtonText || t('common:buttons.cancel')}
                    </Button>
                  ) : null}

                  <Button className={styles.confirmButton} type="primary" onClick={handleConfirm} lockOnClick>
                    {confirmButtonText || t('common:buttons.confirm')}
                  </Button>
                </div>
              </m.div>
            </div>
          </FocusLock>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
};

export default deepMemo(Modal);
