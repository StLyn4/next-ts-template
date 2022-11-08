import { Variant } from 'framer-motion';

interface PredefinedAnimation {
  /** Начальное состояние анимации */
  initial: Variant;

  /** Активное состояние анимации */
  active: Variant;

  /** Состояние анимации при удалении объекта (если отсутствует, то применяется `initial`) */
  exit?: Variant;
}

const predefinedAnimations = {
  opacity: {
    initial: {
      opacity: 0,
    },
    active: {
      opacity: 1,
    },
  },
  scale: {
    initial: {
      scale: 0,
    },
    active: {
      scale: 1,
    },
  },
} as const satisfies Record<string, PredefinedAnimation>;

export type PredefinedAnimationName = keyof typeof predefinedAnimations;
export default predefinedAnimations as Record<string, PredefinedAnimation>;
