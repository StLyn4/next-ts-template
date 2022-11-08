import React from 'react';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';

import Clickable, { ClickEvent, ClickCallback } from 'app/components/utils/Clickable';
import Vector from 'app/components/ui/Vector';
import LoadingIndicator from 'app/components/ui/LoadingIndicator';
import Animate from 'app/components/ui/Animate';

import { useEvent } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export type { ClickEvent, ClickCallback };

export interface ButtonProps {
  /** Содержимое */
  children: React.ReactNode;

  /** Тип кнопки */
  type?: 'green' | 'green-outlined' | 'gray-outlined' | 'red' | 'classic';

  /** Размер внутреннего отступа */
  paddingType?: 'small' | 'normal' | 'large';

  /** Отключена ли кнопка */
  disabled?: boolean;

  /** Отображать индикатор загрузки */
  loading?: boolean;

  /** Иконка */
  icon?: string;

  /** Callback */
  onClick?: ClickCallback;

  /** Переводить ли кнопку в состояние loading (с блокировкой взаимодействия) до конца выполнения onClick */
  lockOnClick?: boolean;
}

/** Кнопка */
const Button: React.FC<ButtonProps> = ({
  children,
  type = 'green',
  paddingType = 'normal',
  disabled = false,
  loading = false,
  icon,
  onClick,
  lockOnClick = false,
}) => {
  const [locked, setLocked] = React.useState(false);

  const handleClick = useEvent(async (event: ClickEvent): Promise<void> => {
    if (locked || loading) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (typeof onClick === 'function') {
      if (lockOnClick) {
        setLocked(true);
      }

      await onClick(event);

      if (lockOnClick) {
        setLocked(false);
      }
    }
  });

  const showLoader = locked || loading;

  return (
    <Clickable disabled={disabled} cursor={disabled ? 'default' : 'pointer'} onClick={handleClick}>
      <div
        className={classNames(styles.button, {
          [styles.disabled]: disabled,
          [styles.green]: type === 'green',
          [styles.greenOutlined]: type === 'green-outlined',
          [styles.grayOutlined]: type === 'gray-outlined',
          [styles.red]: type === 'red',
          [styles.classic]: type === 'classic',
          [styles.smallPadding]: paddingType === 'small',
          [styles.normalPadding]: paddingType === 'normal',
          [styles.largePadding]: paddingType === 'large',
        })}
      >
        <Animate className={styles.content} animate={{ opacity: showLoader ? 0 : 1 }}>
          {icon && <Vector src={icon} color="var(--vector-color)" size={16} />}
          <span>{children}</span>
        </Animate>
        <AnimatePresence>
          {showLoader && (
            <Animate className={styles.loading} animate="opacity">
              <LoadingIndicator color="var(--vector-color)" />
            </Animate>
          )}
        </AnimatePresence>
      </div>
    </Clickable>
  );
};

export default deepMemo(Button);
