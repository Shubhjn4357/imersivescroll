import { useRef } from 'react';
import { ImmersiveScrollProvider } from '../context/ImmersiveScrollProvider';
import type { ImmersiveScrollProps } from '../types/component-props';
import { ImmersiveCanvas } from './ImmersiveCanvas';
import { ImmersiveDebugPanel } from './ImmersiveDebugPanel';
import { ImmersiveScrollbar } from './ImmersiveScrollbar';

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
  scrollbarProps
}: ImmersiveScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldPinViewport = config?.trigger?.pin ?? true;

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
          style={{
            position: shouldPinViewport ? 'sticky' : 'relative',
            top: 0,
            minHeight: '100vh',
            overflow: 'hidden'
          }}
        >
          <ImmersiveCanvas
            ref={canvasRef}
            style={{
              position: 'fixed',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
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
