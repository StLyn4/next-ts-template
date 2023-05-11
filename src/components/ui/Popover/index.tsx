import React, { useRef } from 'react';
import {
  autoUpdate,
  offset,
  flip,
  size,
  shift,
  arrow,
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingArrow,
  type Placement,
} from '@floating-ui/react';
import classNames from 'classnames';
import { AnimatePresence, m, type Variants } from 'framer-motion';

import { useOptionallyControlledState } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

const popoverVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

export interface PopoverProps {
  /** Компонент-якорь, к которому будет прикреплено окно */
  children: React.ReactNode;

  /** Содержимое всплывающего окна */
  content: React.ReactNode;

  /** Расположение содержимого по умолчанию относительно якоря */
  placement?: Placement;

  /** Открыто ли всплывающее окно */
  open?: boolean;

  /** Callback на случай открытия / закрытия окна */
  onOpenChange?: (open: boolean) => void;

  /** Отключить стандартные обработчики открытия / закрытия окна */
  disableInteractions?: boolean;

  /** Отключить менеджер управления фокусировкой */
  disableFocusManager?: boolean;

  /** Скрыта ли стрелка возле блока с содержимым */
  hideArrow?: boolean;

  /** Установить ли такую же ширину содержимого, как и у якоря */
  sameWidth?: boolean;

  /** Дополнительная стилизация обёртки */
  className?: string;

  /** Дополнительная стилизация стрелки */
  arrowClassName?: string;

  /** Дополнительная стилизация блока содержимого */
  contentClassName?: string;
}

/** Всплывающее окно */
const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  placement = 'bottom',
  open,
  onOpenChange,
  disableInteractions = false,
  disableFocusManager = false,
  hideArrow = false,
  sameWidth = false,
  className,
  arrowClassName,
  contentClassName,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useOptionallyControlledState(open, false, onOpenChange);

  const arrowRef = useRef<SVGSVGElement>(null);
  const { context, refs, floatingStyles } = useFloating({
    placement,
    open: isPopoverOpen,
    onOpenChange: setIsPopoverOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      sameWidth && size({
        apply: ({ elements, rects }) => {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
      offset(hideArrow ? 4 : 10),
      flip(),
      shift({ padding: 10 }),
      arrow({ element: arrowRef, padding: 5 }),
    ],
  });

  const click = useClick(context, { enabled: !disableInteractions });
  const dismiss = useDismiss(context, { enabled: !disableInteractions });
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>

      <AnimatePresence initial={false}>
        {isPopoverOpen ? (
          <FloatingFocusManager context={context} modal={false} disabled={disableFocusManager}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className={classNames(styles.popover, className)}
              {...getFloatingProps()}
            >
              <m.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={popoverVariants}
              >
                {!hideArrow ? (
                  <FloatingArrow
                    ref={arrowRef}
                    context={context}
                    className={classNames(styles.arrow, arrowClassName)}
                  />
                ) : null}

                <div className={classNames(styles.content, contentClassName)}>
                  {content}
                </div>
              </m.div>
            </div>
          </FloatingFocusManager>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default deepMemo(Popover);
