import { useDisclosure } from '@mantine/hooks';

export type Updater = () => void;

/**
 * Принудительно заставляет компонент перерисоваться
 *
 * @returns Функция для провоцирования перерисовки
 */
const useForceUpdate = (): Updater => {
  const [, { toggle: forceUpdate }] = useDisclosure(false);
  return forceUpdate;
};

export default useForceUpdate;
