import { useImmersiveContext } from '../hooks/useImmersiveContext';
import { useImmersiveFrame } from '../hooks/useImmersiveFrame';
import { useImmersiveScroll } from '../hooks/useImmersiveScroll';

export function ImmersiveDebugPanel() {
  const { config, frame: frameState } = useImmersiveContext();
  const frame = useImmersiveFrame();
  const scroll = useImmersiveScroll();
  const showAllFields =
    !config.debug.showFrameIndex &&
    !config.debug.showProgress &&
    !config.debug.showVelocity &&
    !config.debug.showManifestStatus;
  const showFrameIndex = showAllFields || config.debug.showFrameIndex;
  const showProgress = showAllFields || config.debug.showProgress;
  const showVelocity = showAllFields || config.debug.showVelocity;
  const showManifestStatus = showAllFields || config.debug.showManifestStatus;

  return (
    <aside
      data-immersive-debug="true"
      style={{
        position: 'absolute',
        left: 16,
        bottom: 16,
        zIndex: Number(config.scrollbar.zIndex ?? 0) + 2,
        display: 'grid',
        gap: 6,
        minWidth: 160,
        maxWidth: 'min(240px, calc(100% - 32px))',
        padding: 12,
        color: '#ffffff',
        background: 'rgba(0,0,0,0.65)',
        fontSize: 12,
        lineHeight: 1.5,
        borderRadius: 12,
        pointerEvents: 'none',
        backdropFilter: 'blur(8px)'
      }}
    >
      <strong
        style={{
          fontSize: 11,
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}
      >
        Debug HUD
      </strong>
      {showProgress ? <div>progress: {scroll.progress.toFixed(3)}</div> : null}
      {showVelocity ? (
        <div>
          velocity: {scroll.velocity.toFixed(3)} ({scroll.direction})
        </div>
      ) : null}
      {showFrameIndex ? (
        <div>
          frame:{' '}
          {Math.min(frame.currentFrame + 1, Math.max(frame.totalFrames, 1))}/
          {Math.max(frame.totalFrames, 1)}
        </div>
      ) : null}
      {showManifestStatus ? (
        <>
          <div>ready: {String(frame.isReady)}</div>
          <div>
            loaded: {frameState.loadedFrames.length}/
            {frame.manifest?.frameCount ?? 0}
          </div>
          <div>
            source: {frame.manifest?.format?.toUpperCase() ?? 'pending'}
          </div>
        </>
      ) : null}
    </aside>
  );
}
