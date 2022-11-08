import React, { useId } from 'react';
import { m, Variant, MotionProps, AnimationType, AnimationControls, CustomDomComponent } from 'framer-motion';
import { Merge } from 'ts-essentials';

import { deepMemo } from 'app/lib/utils';

import predefinedAnimations, { PredefinedAnimationName } from './predefinedAnimations';

export type AnimationState = 'initial' | `${AnimationType}`
export const animationStates: AnimationState[] = ['initial', ...Object.values(AnimationType)];
export const namesOfPredefinedAnimations = Object.keys(predefinedAnimations);

export const isPredefinedAnimation = (name: string): name is PredefinedAnimationName => {
  return namesOfPredefinedAnimations.includes(name);
};

export const isAnimationControls = (value: unknown): value is AnimationControls => {
  if (typeof value === 'object' && value !== null) {
    const possibleControls: Partial<AnimationControls> = value;
    return typeof possibleControls.start === 'function';
  }

  return false;
};

/** Пропсы, которые используются только для анимации, без учёта пропсов компонента */
export interface AnimateSpecificProps<Component extends React.ElementType> extends MotionProps {
  /** Компонент, который будет использован для отображения */
  as?: Component;

  /** Не применять анимаций к состоянию initial, основываясь на использовании встроенных анимаций */
  noAutoInitial?: boolean;

  /** Не дублировать анимации состояния initial в состояние exit */
  noAutoExit?: boolean;
}

/** Пропсы указанного компонента с наложенными поверх {@link AnimateSpecificProps} */
export type AnimateProps<Component extends React.ElementType> = Merge<
  React.ComponentProps<Component>,
  AnimateSpecificProps<Component>
>;

const motionComponentsCache = new Map<React.ElementType, CustomDomComponent<unknown>>();

/** Расширение интерфейса `motion.*`, позволяет использовать {@link predefinedAnimations | встроенные анимации} */
const Animate = <Component extends React.ElementType>(props: AnimateProps<Component>): React.ReactElement | null => {
  const { as = 'div', noAutoInitial = false, noAutoExit = false, variants = {} } = props;

  const customVariantsPrefix = useId();

  // Метки всех вариантов, определённых пользователем
  const userLabels = Object.keys(variants);
  // Варианты, которые мы генерируем в процессе
  const generatedVariants = new Map<string, Variant>();
  // Списки меток вариантов по состояниям
  const labelsByState = new Map<AnimationState, string[]>();

  // Особые случаи
  const initialLabels: string[] = [];
  const exitLabels: string[] = [];

  let MotionComponent = motionComponentsCache.get(as);
  if (!MotionComponent) {
    MotionComponent = m(as);
    motionComponentsCache.set(as, MotionComponent);
  }

  for (const stateName of animationStates) {
    if (typeof props[stateName] !== 'undefined') {
      const stateAnimations = props[stateName];
      const stateLabels: string[] = [];

      const addPredefinedAnimation = (animation: string): void => {
        // Если нет такой анимации среди предопределённых, либо же она переопределена в variants, то ничего не делаем
        if (isPredefinedAnimation(animation) && !userLabels.includes(animation)) {
          const predefinedAnimation = predefinedAnimations[animation];
          stateLabels.push(`${animation}-active`);
          generatedVariants.set(`${animation}-active`, predefinedAnimation.active);

          if (!noAutoInitial) {
            initialLabels.push(`${animation}-initial`);
            generatedVariants.set(`${animation}-initial`, predefinedAnimation.initial);
          }

          if (!noAutoExit) {
            exitLabels.push(`${animation}-exit`);
            generatedVariants.set(`${animation}-exit`, predefinedAnimation.exit ?? predefinedAnimation.initial);
          }
        } else {
          stateLabels.push(animation);
        }
      };

      const addCustomVariant = (variant: Variant): void => {
        const generatedLabel = `custom-${customVariantsPrefix}-${generatedVariants.size}`;
        stateLabels.push(generatedLabel);
        generatedVariants.set(generatedLabel, variant);
      };

      if (!isAnimationControls(stateAnimations)) {
        // Animation Controls бывают только в animate-состоянии, да и те нельзя с чем-то автоматически объединить
        if (typeof stateAnimations === 'string') {
          // Одиночная varint-метка
          addPredefinedAnimation(stateAnimations);
        } else if (Array.isArray(stateAnimations)) {
          // Несколько variant-меток
          for (const animation of stateAnimations) {
            addPredefinedAnimation(animation);
          }
        } else if (typeof stateAnimations === 'object') {
          // Набор свойств под анимацию
          addCustomVariant(stateAnimations);
        }
      }

      labelsByState.set(stateName, stateLabels);
    }
  }

  if (props.initial !== false) {
    const userInitialLabels = labelsByState.get('initial') ?? [];
    labelsByState.set('initial', [...initialLabels, ...userInitialLabels]);
  } else {
    labelsByState.delete('initial');
  }

  const userExitLabels = labelsByState.get('exit') ?? [];
  labelsByState.set('exit', [...exitLabels, ...userExitLabels]);

  return (
    <MotionComponent
      {...props}
      {...Object.fromEntries(labelsByState)} // Map -> Object
      variants={{
        ...Object.fromEntries(generatedVariants), // Map -> Object
        ...variants,
      }}
    />
  );
};

export default deepMemo(Animate);
