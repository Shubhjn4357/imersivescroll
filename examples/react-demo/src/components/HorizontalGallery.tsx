import React from 'react';
import { HorizontalScrollContainer } from 'immersive-scroll';

const galleryItems = [
  {
    id: 1,
    title: 'Aerodynamics',
    description: 'Sculpted by wind, refined by physics.',
    color: '#1a1a1a'
  },
  {
    id: 2,
    title: 'Materials',
    description: 'Forged from aircraft-grade alloys.',
    color: '#2a2a2a'
  },
  {
    id: 3,
    title: 'Performance',
    description: 'Exhilarating power at your fingertips.',
    color: '#3a3a3a'
  },
  {
    id: 4,
    title: 'Precision',
    description: 'Every micron accounted for.',
    color: '#4a4a4a'
  }
];

export function HorizontalGallery() {
  return (
    <HorizontalScrollContainer>
      {galleryItems.map((item) => (
        <div
          key={item.id}
          style={{
            width: '80vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '10vw',
            backgroundColor: item.color,
            color: 'white',
            flexShrink: 0
          }}
        >
          <span
            style={{
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              opacity: 0.5,
              marginBottom: '1rem'
            }}
          >
            0{item.id} — Discovery
          </span>
          <h2
            style={{
              fontSize: '5vw',
              fontWeight: 900,
              margin: '0 0 1.5rem 0',
              lineHeight: 1
            }}
          >
            {item.title}
          </h2>
          <p
            style={{
              fontSize: '1.5rem',
              maxWidth: '30ch',
              opacity: 0.8,
              lineHeight: 1.4
            }}
          >
            {item.description}
          </p>
        </div>
      ))}
    </HorizontalScrollContainer>
  );
}
