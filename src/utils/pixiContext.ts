import { useContext, useEffect } from 'react';
import { AppContext as PIXIAppContext } from 'react-pixi-fiber';

export function usePixiApp() {
  return useContext(PIXIAppContext);
}

export function usePixiTicker(fn: any) {
  const { ticker } = usePixiApp();
  useEffect(() => {
    ticker.add(fn);
    return () => {
      ticker.remove(fn);
    };
  }, [fn, ticker]);
}
