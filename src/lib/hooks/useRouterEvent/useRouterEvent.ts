import { useRouter, NextRouter, RouterEvent } from 'next/router';

import { useEvent, useMountEffect } from 'app/lib/hooks';

export interface RouteProps {
  /** Обновлён ли URL страницы без её перезагрузки */
  shallow: boolean;
}

export interface RoutingError extends Error {
  /** Индикатор того, что навигация была отменена */
  cancelled?: boolean;
}

export interface RouterEventHandlers {
  routeChangeStart: (url: string, routeProps: RouteProps) => void;
  routeChangeComplete: (url: string, routeProps: RouteProps) => void;
  routeChangeError: (err: RoutingError, url: string, routeProps: RouteProps) => void;
  beforeHistoryChange: (url: string, routeProps: RouteProps) => void;
  hashChangeStart: (url: string, routeProps: RouteProps) => void;
  hashChangeComplete: (url: string, routeProps: RouteProps) => void;
}

export type UntypedRouterEventHandler = Parameters<NextRouter['events']['on']>[1];
export type RouterEventHandler<Event extends RouterEvent> = RouterEventHandlers[Event];

/**
 * Привязывает функцию-обработчик к событию маршрутизатора.
 * При размонтировании компонента отключает обработчик
 *
 * @param event - На какое событие привязывать функцию-обработчик
 * @param handler - Функция-обработчик
 */
const useRouterEvent = <Event extends RouterEvent>(event: Event, handler: RouterEventHandler<Event>): void => {
  const router = useRouter();

  // Next.js не типизировал обработчики,
  // поэтому приходится убирать типизацию при передаче непосредственно в роутер
  const eventHandler = useEvent(handler) as unknown as UntypedRouterEventHandler;

  useMountEffect(() => {
    router.events.on(event, eventHandler);

    return () => {
      router.events.off(event, eventHandler);
    };
  });
};

export default useRouterEvent;
