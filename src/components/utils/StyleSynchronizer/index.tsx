import React, { useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { useDebouncedCallback } from 'use-debounce';

import { useAppDispatch } from 'app/lib/hooks';
import { styleVariables } from 'app/lib/constants';
import { deepMemo } from 'app/lib/utils';

import { setBreakpoint, setTheme } from 'app/redux/actions';

import { WindowBreakpoint } from 'app/types';

/** Связующее звено между SCSS и React */
const StyleSynchronizer: React.FC = () => {
  const dispatch = useAppDispatch();

  const isMobile = useMediaQuery(styleVariables.MOBILE_BREAKPOINT_CONDITION);
  const isTablet = useMediaQuery(styleVariables.TABLET_BREAKPOINT_CONDITION);
  const isDesktop = useMediaQuery(styleVariables.DESKTOP_BREAKPOINT_CONDITION);
  const isPrefersDarkTheme = useMediaQuery('(prefers-color-scheme: dark)');

  const debouncedSetBreakpoint = useDebouncedCallback(
    (breakpoint: WindowBreakpoint) => {
      dispatch(setBreakpoint(breakpoint));
    },
    500,
    { leading: true },
  );

  useEffect(() => {
    if (isMobile) {
      debouncedSetBreakpoint('mobile');
    } else if (isTablet) {
      debouncedSetBreakpoint('tablet');
    } else if (isDesktop) {
      debouncedSetBreakpoint('desktop');
    }
  }, [isMobile, isTablet, isDesktop, debouncedSetBreakpoint]);

  useEffect(() => {
    // dispatch(setTheme(isPrefersDarkTheme ? 'dark' : 'light'));
    dispatch(setTheme('light'));
  }, [dispatch, isPrefersDarkTheme]);

  return null;
};

export default deepMemo(StyleSynchronizer);
