import { useRef } from 'react';
import { ImmersiveScrollProvider } from '../context/ImmersiveScrollProvider';
import type {
  ImmersivePlacementProps,
  ImmersiveScrollProps
} from '../types/component-props';
import { ImmersiveCanvas } from './ImmersiveCanvas';
import { ImmersiveDebugPanel } from './ImmersiveDebugPanel';
import { ImmersiveScrollbar } from './ImmersiveScrollbar';

function resolvePlacementStyle(
  placement: ImmersivePlacementProps,
  fallbackPosition: ImmersivePlacementProps['position'],
  fallbackInset?: ImmersivePlacementProps['inset'],
  fallbackTop?: ImmersivePlacementProps['top']
) {
  return {
    position: placement.position ?? fallbackPosition,
    inset: placement.inset ?? fallbackInset,
    top: placement.top ?? fallbackTop,
    right: placement.right,
    bottom: placement.bottom,
    left: placement.left,
    zIndex: placement.zIndex
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
  mediaProps
}: ImmersiveScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldPinViewport = config?.trigger?.pin ?? true;
  const viewportPlacementStyle = resolvePlacementStyle(
    viewportProps ?? {},
    shouldPinViewport ? 'sticky' : 'relative',
    undefined,
    viewportProps?.inset === undefined ? 0 : undefined
  );
  const mediaPlacementStyle = resolvePlacementStyle(
    mediaProps ?? {},
    'absolute',
    mediaProps?.inset ?? 0
  );

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
    >
      <div
        ref={containerRef}
        data-immersive-root="true"
        className={className}
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflow: 'hidden',
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
            minHeight: '100vh',
            overflow: 'hidden',
            isolation: 'isolate',
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
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children ?? loadingFallback ?? errorFallback}
        </div>
      </div>
    </ImmersiveScrollProvider>
  );
}
