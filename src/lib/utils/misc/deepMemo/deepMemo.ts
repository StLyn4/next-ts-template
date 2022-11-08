import React from 'react';
import isDeepEqual from 'fast-deep-equal';

import { GenericComponent } from 'app/types';

const deepMemo = <ComponentType extends GenericComponent>(Component: ComponentType): ComponentType => {
  return React.memo(Component, isDeepEqual) as unknown as ComponentType;
};

export default deepMemo;
