'use client';

import React from 'react';
import { HorizontalScrollContainer } from '@immersive-scroll/horizontal-scroll';

const GALLERY_ITEMS = [
  {
    title: 'Precision Motion',
    category: 'Engineering',
    color: '#8de1ff',
    description: 'Hardware-accelerated progress tracking for cinematic results.'
  },
  {
    title: 'Fluid Experience',
    category: 'Design',
    color: '#ffd36e',
    description: 'Native scroll hooks that feel like natural gestures.'
  },
  {
    title: 'Adaptive Layout',
    category: 'Architecture',
    color: '#7cf7c0',
    description: 'Responsive primitives that scale from mobile to desktop.'
  },
  {
    title: 'Modern Stack',
    category: 'Develoment',
    color: '#f4a8ff',
    description: 'Built with React, GSAP, and TypeScript for peak stability.'
  },
  {
    title: 'Visual Fidelity',
    category: 'Art Direction',
    color: '#ff8d8d',
    description: 'Canvas-based rendering for ultra-smooth frame scrubbing.'
  }
];

export function HorizontalScrollDemo() {
  return (
    <div className="horizontal-demo">
      <div
        className="playground-preview-shell__header"
        style={{ padding: '2rem 3rem' }}
      >
        <p className="eyebrow">Horizontal Scroll Package</p>
        <h3 className="section-title">Endless track composition</h3>
        <p
          className="body-text"
          style={{ maxWidth: '600px', marginTop: '0.5rem' }}
        >
          Combine vertical scroll triggers with horizontal translation to create
          dynamic galleries and product walkthroughts.
        </p>
      </div>

      <HorizontalScrollContainer
        className="horizontal-demo__container"
        trackClassName="horizontal-demo__track"
        scrub={1.2}
      >
        <div
          style={{ display: 'flex', gap: '2rem', padding: '0 3rem 4rem 3rem' }}
        >
          {GALLERY_ITEMS.map((item, index) => (
            <div
              key={index}
              className="glass-card"
              style={{
                width: '420px',
                padding: '2.5rem',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                minHeight: '400px',
                borderTop: `4px solid ${item.color}`
              }}
            >
              <span className="eyebrow" style={{ color: item.color }}>
                {item.category}
              </span>
              <h4 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem 0' }}>
                {item.title}
              </h4>
              <p
                className="body-text"
                style={{ fontSize: '1rem', opacity: 0.8 }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </HorizontalScrollContainer>

      <div
        style={{
          padding: '4rem 3rem',
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid var(--border)'
        }}
      >
        <p className="eyebrow">Implementation</p>
        <div style={{ marginTop: '1.5rem' }}>
          <pre
            style={{
              background: '#050505',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              fontSize: '0.85rem',
              overflowX: 'auto',
              border: '1px solid var(--border-strong)'
            }}
          >
            {`<HorizontalScrollContainer scrub={1.2}>\n  <div className="gallery">\n    {items.map(item => <Card key={item.id} {...item} />)}\n  </div>\n</HorizontalScrollContainer>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
