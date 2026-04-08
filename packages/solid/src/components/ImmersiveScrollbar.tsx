import { useImmersiveScroll } from '../hooks/useImmersiveScroll';
import { useImmersiveConfig } from '../hooks/useImmersiveConfig';

export function ImmersiveScrollbar() {
  const scroll = useImmersiveScroll();
  const config = useImmersiveConfig();
  const visibilityMode =
    config().scrollbar.visibilityMode === 'always' &&
    config().scrollbar.autoHide
      ? 'scroll'
      : config().scrollbar.visibilityMode;
  const isVisible =
    visibilityMode === 'always'
      ? true
      : visibilityMode === 'scroll'
        ? scroll().isScrolling
        : false;
  const thumbSize = Math.max(
    config().scrollbar.minThumbSize,
    config().scrollbar.width * 4
  );

  return config().scrollbar.enabled ? (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: `${config().scrollbar.offset}px`,
        bottom: `${config().scrollbar.offset}px`,
        right:
          config().scrollbar.position === 'right'
            ? `${config().scrollbar.offset}px`
            : undefined,
        left:
          config().scrollbar.position === 'left'
            ? `${config().scrollbar.offset}px`
            : undefined,
        width: `${config().scrollbar.width}px`,
        'z-index': String(config().scrollbar.zIndex)
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '0',
          background: config().scrollbar.trackColor,
          opacity: isVisible ? String(config().scrollbar.trackOpacity) : '0',
          'border-radius': `${config().scrollbar.radius}px`,
          transition: `opacity ${config().scrollbar.transitionDuration}ms ease`
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '0 auto auto 0',
          width: '100%',
          height: `${thumbSize}px`,
          background: config().scrollbar.thumbColor,
          opacity: isVisible ? String(config().scrollbar.thumbOpacity) : '0',
          transform: `translate3d(0, calc((100% - ${thumbSize}px) * ${scroll().progress.toFixed(4)}), 0)`,
          'border-radius': `${config().scrollbar.radius}px`,
          transition: `opacity ${config().scrollbar.transitionDuration}ms ease, transform ${config().scrollbar.transitionDuration}ms ease`
        }}
      />
    </div>
  ) : null;
}
