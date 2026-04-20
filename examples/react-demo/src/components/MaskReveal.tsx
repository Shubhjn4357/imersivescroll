import React from 'react';
import { ImmersiveSvgMask } from '@immersive-scroll/svg-mask';

export function MaskReveal() {
  return (
    <ImmersiveSvgMask
      scrollDistance={1500}
      background={
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(45deg, #111, #000)',
            color: 'rgba(255,255,255,0.1)'
          }}
        >
          <h2
            style={{
              fontSize: '10vw',
              fontWeight: 900,
              textTransform: 'uppercase'
            }}
          >
            Hidden
          </h2>
        </div>
      }
      foreground={
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--accent)',
            color: 'white',
            textAlign: 'center',
            padding: '2rem'
          }}
        >
          <span
            className="text-accent"
            style={{ color: 'white', opacity: 0.8 }}
          >
            Mask Reveal System
          </span>
          <h2 className="text-hero" style={{ fontSize: '6vw' }}>
            Beyond the Surface.
          </h2>
          <p className="text-subtitle" style={{ color: 'white' }}>
            A high-performance SVG reveal system integrated with ScrollTrigger.
          </p>
        </div>
      }
    />
  );
}
