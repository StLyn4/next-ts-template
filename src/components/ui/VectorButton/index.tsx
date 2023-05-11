import React, { useMemo } from 'react';
import classNames from 'classnames';
import { AnimatePresence, m, type Variants } from 'framer-motion';

import LoadingIndicator from 'app/components/ui/LoadingIndicator';
import Vector, { type VectorSize } from 'app/components/ui/Vector';
import Clickable, { type ClickCallback, type ClickEvent } from 'app/components/utils/Clickable';
import { useEvent } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

const loaderVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export interface VectorButtonProps {
  /** Название векторного изображения с папки `assets/images/vector`, или же полный путь (URL) */
  src: string;

  /** Тип кнопки */
  type?: 'primary' | 'secondary';

  /** Форма кнопки */
  shape?: 'square' | 'round' | 'vector-only';

  /** Размер внутреннего отступа */
  padding?: number;

  /** Текст в "облаке" справа сверху от кнопки */
  tip?: string | number;

  /** Размер изображения */
  size?: VectorSize;

  /** Отключена ли функциональность */
  disabled?: boolean;

  /** Отображать индикатор загрузки */
  loading?: boolean;

  /** Callback для клика и нажатий Enter / Space */
  onClick?: ClickCallback;

  /** Переводить ли кнопку в состояние loading (с блокировкой взаимодействия) до конца выполнения onClick */
  lockOnClick?: boolean;

  /** Дополнительные CSS-классы */
  className?: string;
}

/** Кнопка-Vector */
const VectorButton: React.FC<VectorButtonProps> = ({
  src,
  type = 'primary',
  shape = 'vector-only',
  padding = 4,
  tip = '',
  size,
  disabled = false,
  loading = false,
  onClick,
  lockOnClick = false,
  className,
}) => {
  const [locked, setLocked] = React.useState(false);
  const showLoader = locked || loading;

  const wrapperStyle = useMemo<React.CSSProperties>(() => ({
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    padding: padding - 1, // 1 - размер border
  }), [size, padding]);

  const tipStyle = useMemo<React.CSSProperties>(() => ({
    top: shape === 'vector-only' ? padding - 1 : 0,
    right: shape === 'vector-only' ? padding - 1 : 0,
  }), [shape, padding]);

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
          styles.vectorButton,
          styles[`type-${type}`],
          styles[`shape-${shape}`],
          styles[`padding-${padding}`],
          { [styles.disabled]: disabled },
          className,
        )}
        style={wrapperStyle}
      >
        <m.div className={styles.content} animate={{ opacity: showLoader ? 0 : 1 }}>
          <Vector src={src} />
          {tip ? <div className={styles.tip} style={tipStyle}>{tip}</div> : null}
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

export default deepMemo(VectorButton);
