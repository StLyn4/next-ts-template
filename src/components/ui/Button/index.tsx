import React from 'react';
import classNames from 'classnames';
import { AnimatePresence, m, type Variants } from 'framer-motion';

import LoadingIndicator from 'app/components/ui/LoadingIndicator';
import Vector from 'app/components/ui/Vector';
import Clickable, { type ClickEvent, type ClickCallback } from 'app/components/utils/Clickable';
import { useEvent } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export type { ClickEvent, ClickCallback };

const loaderVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export interface ButtonProps {
  /** Содержимое */
  children: React.ReactNode;

  /** Тип кнопки */
  type?: 'primary' | 'secondary';

  /** Форма кнопки */
  shape?: 'square' | 'round';

  /** Размер кнопки */
  size?: 'large' | 'normal' | 'small';

  /** Текст в "облаке" справа сверху от кнопки */
  tip?: string | number;

  /** Отключена ли кнопка */
  disabled?: boolean;

  /** Отображать индикатор загрузки */
  loading?: boolean;

  /** Иконка слева */
  iconLeft?: string;

  /** Иконка справа */
  iconRight?: string;

  /** Callback для клика и нажатий Enter / Space */
  onClick?: ClickCallback;

  /** Переводить ли кнопку в состояние `loading` (с блокировкой взаимодействия) до конца выполнения `onClick` */
  lockOnClick?: boolean;

  /** Дополнительные CSS-классы */
  className?: string;
}

/** Кнопка */
const Button: React.FC<ButtonProps> = ({
  children,
  type = 'primary',
  shape = 'square',
  size = 'normal',
  tip = '',
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  onClick,
  lockOnClick = false,
  className,
}) => {
  const [locked, setLocked] = React.useState(false);
  const showLoader = locked || loading;

  const handleClick = useEvent(async (event: ClickEvent): Promise<void> => {
    if (locked || loading) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (onClick) {
      if (lockOnClick) {
        setLocked(true);
      }

      await onClick(event);

      if (lockOnClick) {
        setLocked(false);
      }
    }
  });

  return (
    <Clickable disabled={disabled} onClick={handleClick}>
      <div
        className={classNames(
          styles.button,
          styles[`type-${type}`],
          styles[`shape-${shape}`],
          styles[`size-${size}`],
          { [styles.disabled]: disabled },
          className,
        )}
      >
        <m.div className={styles.content} animate={{ opacity: showLoader ? 0 : 1 }}>
          {iconLeft ? <Vector src={iconLeft} size={20} /> : null}
          <span>{children}</span>
          {iconRight ? <Vector src={iconRight} size={20} /> : null}
          {tip ? <div className={styles.tip}>{tip}</div> : null}
        </m.div>

        <AnimatePresence>
          {showLoader && (
            <m.div
              className={styles.loading}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={loaderVariants}
            >
              <LoadingIndicator />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </Clickable>
  );
};

export default deepMemo(Button);
