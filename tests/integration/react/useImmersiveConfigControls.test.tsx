import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { useImmersiveConfigControls } from 'immersive-scroll';

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useImmersiveConfigControls', () => {
  it('merges section updates and resets back to the initial config', () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    let controls!: ReturnType<typeof useImmersiveConfigControls>;

    function Harness() {
      controls = useImmersiveConfigControls({
        initialConfig: {
          debug: { enabled: false },
          scrollbar: {
            enabled: true,
            positionMode: 'absolute'
          }
        }
      });

      return null;
    }

    act(() => {
      root.render(<Harness />);
    });

    expect(controls.config.debug?.enabled).toBe(false);
    expect(controls.config.scrollbar?.positionMode).toBe('absolute');

    act(() => {
      controls.updateDebug({ enabled: true });
      controls.updateScrollbar({ positionMode: 'fixed' });
    });

    expect(controls.config.debug?.enabled).toBe(true);
    expect(controls.config.scrollbar?.enabled).toBe(true);
    expect(controls.config.scrollbar?.positionMode).toBe('fixed');

    act(() => {
      controls.resetConfig();
    });

    expect(controls.config.debug?.enabled).toBe(false);
    expect(controls.config.scrollbar?.enabled).toBe(true);
    expect(controls.config.scrollbar?.positionMode).toBe('absolute');

    act(() => {
      root.unmount();
    });
  });
});
