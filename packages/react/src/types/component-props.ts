import type {
  createImmersiveEngine,
  FrameStoreState,
  ImmersiveConfig,
  ImmersivePlugin,
  PartialImmersiveConfig,
  ScrollbarConfig,
  ScrollState
} from '@immersive-scroll/core';
import type { CSSProperties, ReactNode, RefObject } from 'react';

export type ImmersiveLayoutPosition = Extract<
  NonNullable<CSSProperties['position']>,
  'absolute' | 'fixed' | 'relative' | 'sticky'
>;

export interface ImmersivePlacementProps {
  position?: ImmersiveLayoutPosition;
  inset?: CSSProperties['inset'];
  top?: CSSProperties['top'];
  right?: CSSProperties['right'];
  bottom?: CSSProperties['bottom'];
  left?: CSSProperties['left'];
  zIndex?: CSSProperties['zIndex'];
}

export interface ImmersiveViewportProps extends ImmersivePlacementProps {
  className?: string;
  style?: CSSProperties;
}

export interface ImmersiveMediaProps extends ImmersivePlacementProps {
  className?: string;
  style?: CSSProperties;
}

export interface ImmersiveScrollbarPlacementProps {
  position?: ScrollbarConfig['position'];
  positionMode?: ScrollbarConfig['positionMode'];
  offset?: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface ImmersiveScrollbarProps extends ImmersiveScrollbarPlacementProps {
  visible?: boolean;
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  trackStyle?: CSSProperties;
  thumbStyle?: CSSProperties;
  trackClassName?: string;
  thumbClassName?: string;
  placement?: ImmersiveScrollbarPlacementProps;
}

export interface ImmersiveScrollProps {
  video?: string | null;
  framesPath?: string | null;
  manifestPath?: string | null;
  className?: string;
  style?: CSSProperties;
  config?: PartialImmersiveConfig;
  plugins?: ImmersivePlugin[];
  children?: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  overlay?: ReactNode;
  scrollbarProps?: ImmersiveScrollbarProps;
  viewportProps?: ImmersiveViewportProps;
  mediaProps?: ImmersiveMediaProps;
  /**
   * Where to track scroll progress.
   * 'window' (default): Tracks page scroll.
   * 'container': Tracks scroll events on the root container.
   * 'manual': Engine exists but you must call updateProgress manually.
   */
  scrollSource?: 'window' | 'container' | 'manual';
}

export interface ImmersiveContextValue {
  config: ImmersiveConfig;
  frame: FrameStoreState;
  scroll: ScrollState;
  engine: ReturnType<typeof createImmersiveEngine> | null;
  plugins: ImmersivePlugin[];
  containerRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}
