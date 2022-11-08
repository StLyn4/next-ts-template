import { useDebugValue } from 'react';

import { useAppSelector } from 'app/lib/hooks';

import { selectBreakpoint } from 'app/redux/selectors';

import { WindowBreakpoint } from 'app/types';

/**
 * Получение текущего {@link WindowBreakpoint | размера экрана}
 * @returns Текущий {@link WindowBreakpoint | размер экрана}
 */
const useBreakpoint = (): WindowBreakpoint => {
  const breakpoint = useAppSelector(selectBreakpoint);

  useDebugValue(breakpoint);
  return breakpoint;
};

export default useBreakpoint;
