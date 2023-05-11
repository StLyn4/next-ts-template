import React from 'react';
import isDeepEqual from 'fast-deep-equal';

import { type GenericComponent } from 'app/types';

/**
 * Аналог React.memo, но с глубоким сравнением пропсов, которое проверяет в том числе объекты
 *
 * @param Component - Любой React-компонент
 * @returns Обёрнутый в React.memo компонент (сохраняется тип компонента)
 */
const deepMemo = <ComponentType extends GenericComponent>(Component: ComponentType): ComponentType => {
  return React.memo(Component, isDeepEqual) as unknown as ComponentType;
};

export default deepMemo;
