'use client';

import React from 'react';
import { ImmersiveSvgMask } from '@immersive-scroll/svg-mask';

export function SvgMaskDemo() {
  return (
    <div className="svg-mask-demo">
      <div
        className="playground-preview-shell__header"
        style={{ padding: '2rem 3rem' }}
      >
        <p className="eyebrow">SVG Mask Package</p>
        <h3 className="section-title">Cinematic reveal effects</h3>
        <p
          className="body-text"
          style={{ maxWidth: '600px', marginTop: '0.5rem' }}
        >
          Reveal foreground content over a background layer using
          high-performance SVG masks tied to scroll position.
        </p>
      </div>

      <div
        style={{ height: '560px', overflow: 'hidden', position: 'relative' }}
      >
        <ImmersiveSvgMask
          scrollDistance={1500}
          softness={40}
          variant="pill"
          parallax={0.2}
          className="playground-reveal"
          background={
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(45deg, #0f0f0f, #1a1a1a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.1)',
                fontSize: '4rem',
                fontWeight: 'bold'
              }}
            >
              BACKGROUND LAYER
            </div>
          }
          foreground={
            <div
              style={{
                width: '100%',
                height: '100%',
                background:
                  'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop") center/cover',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                textShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
            >
              <span className="eyebrow" style={{ color: '#8de1ff' }}>
                Cinematic Reveal
              </span>
              <h4 style={{ fontSize: '3rem', margin: '1rem 0' }}>
                The Future of Storytelling
              </h4>
              <p
                style={{
                  maxWidth: '500px',
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  opacity: 0.9
                }}
              >
                Hardware-accelerated SVG masking that scales perfectly to any
                viewport.
              </p>
            </div>
          }
        />
      </div>

      <div
        style={{
          padding: '4rem 3rem',
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid var(--border)'
        }}
      >
        <p className="eyebrow">Implementation</p>
        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock
            code={`<ImmersiveSvgMask\n  variant="pill"\n  softness={40}\n  scrollDistance={1500}\n  background={<StaticLayer />}\n  foreground={<RevealContent />}\n/>`}
            language="tsx"
          />
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <pre
      style={{
        background: '#050505',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        fontSize: '0.85rem',
        overflowX: 'auto',
        border: '1px solid var(--border-strong)',
        color: '#d4d4d4'
      }}
    >
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}
