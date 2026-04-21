import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImmersiveScrollProvider } from '@immersive-scroll/react';

describe('Smoke Test - Integration', () => {
  it('should render the ImmersiveScrollProvider', () => {
    const containerRef = createRef<HTMLDivElement>();
    const viewportRef = createRef<HTMLDivElement>();
    const canvasRef = createRef<HTMLCanvasElement>();

    render(
      <ImmersiveScrollProvider
        containerRef={containerRef}
        viewportRef={viewportRef}
        canvasRef={canvasRef}
      >
        <div data-testid="child">Test Content</div>
      </ImmersiveScrollProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
