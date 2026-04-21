import { useRef } from 'react';
import { ImmersiveScrollProvider } from '../context/ImmersiveScrollProvider';
import type {
  ImmersivePlacementProps,
  ImmersiveScrollProps
} from '../types/component-props';
import { ImmersiveCanvas } from './ImmersiveCanvas';
import { ImmersiveDebugPanel } from './ImmersiveDebugPanel';
import { ImmersiveScrollbar } from './ImmersiveScrollbar';

const IMMERSIVE_LAYER_ORDER = {
  viewport: 0,
  content: 1
} as const;

function resolvePlacementStyle(
  placement: ImmersivePlacementProps,
  options: {
    defaultPosition: ImmersivePlacementProps['position'];
    defaultInset?: ImmersivePlacementProps['inset'];
    fixedInset?: ImmersivePlacementProps['inset'];
    defaultZIndex?: ImmersivePlacementProps['zIndex'];
  }
) {
  const resolvedPosition = placement.position ?? options.defaultPosition;
  const resolvedInset =
    placement.inset ??
    (resolvedPosition === 'fixed' ? options.fixedInset : options.defaultInset);

  return {
    position: resolvedPosition,
    inset: resolvedInset,
    top: placement.top,
    right: placement.right,
    bottom: placement.bottom,
    left: placement.left,
    zIndex: placement.zIndex ?? options.defaultZIndex
  };
}

export function ImmersiveScroll({
  video = null,
  framesPath = null,
  manifestPath = null,
  className,
  style,
  config,
  plugins,
  children,
  loadingFallback,
  errorFallback,
  overlay,
  scrollbarProps,
  viewportProps,
  mediaProps,
  scrollSource = 'window'
}: ImmersiveScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldPinViewport = config?.trigger?.pin ?? true;
  const viewportPlacementStyle = resolvePlacementStyle(viewportProps ?? {}, {
    defaultPosition: shouldPinViewport ? 'fixed' : 'relative',
    fixedInset: 0,
    defaultZIndex: IMMERSIVE_LAYER_ORDER.viewport
  });
  const mediaPlacementStyle = resolvePlacementStyle(mediaProps ?? {}, {
    defaultPosition: 'absolute',
    defaultInset: 0,
    fixedInset: 0,
    defaultZIndex: IMMERSIVE_LAYER_ORDER.viewport
  });

  return (
    <ImmersiveScrollProvider
      config={config}
      framesPath={framesPath}
      manifestPath={manifestPath}
      video={video}
      plugins={plugins}
      containerRef={containerRef}
      viewportRef={viewportRef}
      canvasRef={canvasRef}
      scrollSource={scrollSource}
    >
      <div
        ref={containerRef}
        data-immersive-root="true"
        className={className}
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflow: 'visible',
          background: '#000000',
          color: '#ffffff',
          ...style
        }}
      >
        <div
          ref={viewportRef}
          data-immersive-viewport="true"
          className={viewportProps?.className}
          style={{
            ...viewportPlacementStyle,
            height: '100vh',
            overflow: 'hidden',
            ...viewportProps?.style
          }}
        >
          <ImmersiveCanvas
            ref={canvasRef}
            data-immersive-media="true"
            className={mediaProps?.className}
            style={{
              ...mediaPlacementStyle,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              ...mediaProps?.style
            }}
          />
          {overlay}
          <ImmersiveScrollbar {...scrollbarProps} />
          {config?.debug?.enabled ? <ImmersiveDebugPanel /> : null}
        </div>
        <div
          data-immersive-content="true"
          style={{
            position: 'relative',
            zIndex: IMMERSIVE_LAYER_ORDER.content
          }}
        >
          {children ?? loadingFallback ?? errorFallback}
        </div>
      </div>
    </ImmersiveScrollProvider>
  );
}
