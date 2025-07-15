import { createNavigationContainerRef } from '@react-navigation/native';

export const navRef = createNavigationContainerRef();

export function resetTo(route: string) {
  if (navRef.isReady()) {
    navRef.reset({ index: 0, routes: [{ name: route as never }] });
  }
}
