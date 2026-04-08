import type { ParentProps } from 'solid-js';
import { createSignal } from 'solid-js';
import type {
  ImmersivePlugin,
  PartialImmersiveConfig
} from '@immersive-scroll/core';
import { ImmersiveContext } from '../context/ImmersiveContext';
import { createSolidEngineBinding } from '../interop/createSolidEngineBinding';
import { ImmersiveCanvas } from './ImmersiveCanvas';
import { ImmersiveScrollbar } from './ImmersiveScrollbar';

interface ImmersiveScrollProps extends ParentProps {
  config?: PartialImmersiveConfig;
  framesPath?: string | null;
  manifestPath?: string | null;
  video?: string | null;
  plugins?: ImmersivePlugin[];
  class?: string;
}

export function ImmersiveScroll(props: ImmersiveScrollProps) {
  const [container, setContainer] = createSignal<HTMLElement>();
  const [viewport, setViewport] = createSignal<HTMLElement>();
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();
  const binding = createSolidEngineBinding(
    () => container(),
    () => viewport(),
    () => canvas(),
    props.config,
    props.framesPath,
    props.manifestPath,
    props.video,
    props.plugins ?? []
  );

  return (
    <ImmersiveContext.Provider value={binding}>
      <div
        ref={setContainer}
        class={props.class}
        style={{
          position: 'relative',
          overflow: 'hidden',
          'min-height': '100vh'
        }}
      >
        <div
          ref={setViewport}
          style={{
            position:
              props.config?.trigger?.pin === false ? 'relative' : 'sticky',
            top: '0',
            'min-height': '100vh',
            overflow: 'hidden'
          }}
        >
          <ImmersiveCanvas
            ref={setCanvas}
            style={{
              position: 'absolute',
              inset: '0',
              width: '100%',
              height: '100%'
            }}
          />
          <ImmersiveScrollbar />
        </div>
        <div style={{ position: 'relative', 'z-index': 1 }}>
          {props.children}
        </div>
      </div>
    </ImmersiveContext.Provider>
  );
}
