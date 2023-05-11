import { useEffect, type EffectCallback } from 'react';

import { useEvent } from 'app/lib/hooks';

/**
 * Аналог `useEffect(effect, [])`:
 * - `effect` обёрнут в `useEvent` для доступа к актуальным переменным
 * - `effect` будет выполнен при монтировании
 * - Очистка (функция, возращённая из `effect`) будет выполнена при размонтировании
 *
 * @param effect - Эффект
 */
const useMountEffect = (effect: EffectCallback): void => {
  const effectHandler = useEvent(effect);
  useEffect(effectHandler, [effectHandler]);
};

export default useMountEffect;
