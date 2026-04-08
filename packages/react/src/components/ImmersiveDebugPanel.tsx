import { useImmersiveFrame } from '../hooks/useImmersiveFrame';
import { useImmersiveScroll } from '../hooks/useImmersiveScroll';

export function ImmersiveDebugPanel() {
  const frame = useImmersiveFrame();
  const scroll = useImmersiveScroll();

  return (
    <aside
      style={{
        position: 'absolute',
        left: 16,
        bottom: 16,
        padding: 12,
        color: '#ffffff',
        background: 'rgba(0,0,0,0.65)',
        fontSize: 12,
        borderRadius: 12
      }}
    >
      <div>progress: {scroll.progress.toFixed(3)}</div>
      <div>velocity: {scroll.velocity.toFixed(3)}</div>
      <div>frame: {frame.currentFrame}</div>
      <div>ready: {String(frame.isReady)}</div>
    </aside>
  );
}
