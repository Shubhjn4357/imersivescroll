import { clamp } from '@immersive-scroll/core';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useImmersiveScrollbar } from '../hooks/useImmersiveScrollbar';
import type {
  ImmersiveScrollbarPlacementProps,
  ImmersiveScrollbarProps
} from '../types/component-props';

function resolveScrollbarVisibilityMode(
  autoHide: boolean,
  visibilityMode: 'always' | 'scroll' | 'hover' | 'manual'
) {
  if (visibilityMode !== 'always') {
    return visibilityMode;
  }

  return autoHide ? 'scroll' : 'always';
}

function resolvePlacementStyles(
  placement: ScrollbarPlacementInput,
  scrollbar: ReturnType<typeof useImmersiveScrollbar>
): CSSProperties {
  const resolvedPosition = placement.position ?? scrollbar.position;
  const resolvedOffset = placement.offset ?? scrollbar.offset;
  const resolvedTop = placement.top ?? scrollbar.top ?? resolvedOffset;
  const resolvedBottom = placement.bottom ?? scrollbar.bottom ?? resolvedOffset;
  const resolvedLeft =
    placement.left ??
    scrollbar.left ??
    (resolvedPosition === 'left' ? resolvedOffset : undefined);
  const resolvedRight =
    placement.right ??
    scrollbar.right ??
    (resolvedPosition === 'right' ? resolvedOffset : undefined);

  return {
    position: placement.positionMode ?? scrollbar.positionMode,
    top: resolvedTop,
    right: resolvedRight,
    bottom: resolvedBottom,
    left: resolvedLeft
  };
}

interface DragState {
  pointerId: number;
  thumbOffset: number;
}

interface ScrollbarPlacementInput {
  position: ImmersiveScrollbarPlacementProps['position'] | undefined;
  positionMode: ImmersiveScrollbarPlacementProps['positionMode'] | undefined;
  offset: ImmersiveScrollbarPlacementProps['offset'] | undefined;
  top: ImmersiveScrollbarPlacementProps['top'] | undefined;
  right: ImmersiveScrollbarPlacementProps['right'] | undefined;
  bottom: ImmersiveScrollbarPlacementProps['bottom'] | undefined;
  left: ImmersiveScrollbarPlacementProps['left'] | undefined;
}

interface ScrollbarPlacementResolverInput extends ScrollbarPlacementInput {
  placement: ImmersiveScrollbarPlacementProps | undefined;
}

function resolvePlacementInput({
  position,
  positionMode,
  offset,
  top,
  right,
  bottom,
  left,
  placement
}: ScrollbarPlacementResolverInput): ScrollbarPlacementInput {
  return {
    position: position ?? placement?.position,
    positionMode: positionMode ?? placement?.positionMode,
    offset: offset ?? placement?.offset,
    top: top ?? placement?.top,
    right: right ?? placement?.right,
    bottom: bottom ?? placement?.bottom,
    left: left ?? placement?.left
  };
}

export function ImmersiveScrollbar({
  visible,
  interactive,
  className,
  position,
  positionMode,
  offset,
  top,
  right,
  bottom,
  left,
  style,
  trackStyle,
  thumbStyle,
  trackClassName,
  thumbClassName,
  placement
}: ImmersiveScrollbarProps = {}) {
  const scrollbar = useImmersiveScrollbar();
  const rootRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dragState, setDragState] = useState<DragState | null>(null);

  if (!scrollbar.enabled) {
    return null;
  }

  const visibilityMode = resolveScrollbarVisibilityMode(
    scrollbar.autoHide,
    scrollbar.visibilityMode
  );
  const isVisible =
    visible ??
    (visibilityMode === 'always'
      ? true
      : visibilityMode === 'scroll'
        ? scrollbar.isScrolling
        : visibilityMode === 'hover'
          ? isHovered
          : false);
  const thumbSize = Math.max(scrollbar.minThumbSize, scrollbar.width * 4);
  const thumbTranslate = `calc((100% - ${thumbSize}px) * ${scrollbar.progress.toFixed(4)})`;
  const transition = `opacity ${scrollbar.transitionDuration}ms ease, transform ${scrollbar.transitionDuration}ms ease`;
  const isInteractive = interactive ?? scrollbar.interactive;
  const placementInput = resolvePlacementInput({
    position,
    positionMode,
    offset,
    top,
    right,
    bottom,
    left,
    placement
  });
  const rootPlacementStyle = resolvePlacementStyles(placementInput, scrollbar);

  const scrollToClientY = (clientY: number, thumbOffset: number) => {
    const rootElement = rootRef.current;
    if (!rootElement) {
      return;
    }

    const rootRect = rootElement.getBoundingClientRect();
    const travelDistance = rootRect.height - thumbSize;
    if (travelDistance <= 0) {
      scrollbar.scrollToProgress(0);
      return;
    }

    const nextProgress = clamp(
      (clientY - rootRect.top - thumbOffset) / travelDistance,
      0,
      1
    );

    scrollbar.scrollToProgress(nextProgress);
  };

  useEffect(() => {
    if (!dragState || !isInteractive) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerId !== dragState.pointerId) {
        return;
      }

      scrollToClientY(event.clientY, dragState.thumbOffset);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerId !== dragState.pointerId) {
        return;
      }

      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragState, isInteractive, thumbSize]);

  const beginDrag = (
    event: ReactPointerEvent<HTMLDivElement>,
    thumbOffset: number
  ) => {
    if (!isInteractive) {
      return;
    }

    event.preventDefault();
    setDragState({
      pointerId: event.pointerId,
      thumbOffset
    });
    scrollToClientY(event.clientY, thumbOffset);
  };

  const handleTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isInteractive) {
      return;
    }

    beginDrag(event, thumbSize / 2);
  };

  const handleThumbPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isInteractive) {
      return;
    }

    event.stopPropagation();

    const thumbRect = thumbRef.current?.getBoundingClientRect();
    const thumbOffset = thumbRect
      ? clamp(event.clientY - thumbRect.top, 0, thumbRect.height)
      : thumbSize / 2;

    beginDrag(event, thumbOffset);
  };

  const rootStyle: CSSProperties = {
    ...rootPlacementStyle,
    width: Math.max(scrollbar.width, 18),
    zIndex: scrollbar.zIndex,
    touchAction: isInteractive ? 'none' : undefined,
    userSelect: isInteractive ? 'none' : undefined,
    cursor: isInteractive ? (dragState ? 'grabbing' : 'pointer') : undefined,
    pointerEvents: isVisible || isInteractive ? 'auto' : 'none',
    ...style
  };

  const sharedRailStyle: CSSProperties = {
    position: 'absolute',
    borderRadius: scrollbar.radius,
    transition,
    left: '50%',
    width: scrollbar.width,
    marginLeft: scrollbar.width / -2
  };

  const trackComputedStyle: CSSProperties = {
    ...sharedRailStyle,
    insetBlock: 0,
    background: scrollbar.trackColor,
    opacity: isVisible ? scrollbar.trackOpacity : 0,
    ...trackStyle
  };

  const thumbComputedStyle: CSSProperties = {
    ...sharedRailStyle,
    top: 0,
    height: thumbSize,
    background: scrollbar.thumbColor,
    opacity: isVisible ? scrollbar.thumbOpacity : 0,
    transform: `translate3d(0, ${thumbTranslate}, 0)`,
    ...thumbStyle
  };

  return (
    <div
      ref={rootRef}
      className={className}
      onPointerDown={handleTrackPointerDown}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={rootStyle}
    >
      <div
        aria-hidden="true"
        className={trackClassName}
        style={trackComputedStyle}
      />
      <div
        aria-hidden="true"
        ref={thumbRef}
        className={thumbClassName}
        onPointerDown={handleThumbPointerDown}
        style={thumbComputedStyle}
      />
    </div>
  );
}
