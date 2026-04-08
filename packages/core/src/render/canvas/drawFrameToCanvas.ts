import { clamp } from '@immersive-scroll/shared';
import type { ObjectFitMode } from '@immersive-scroll/shared';

interface CanvasFrameSourceDimensions {
  width: number;
  height: number;
}

interface DrawFrameToCanvasOptions {
  context: CanvasRenderingContext2D;
  image: HTMLImageElement | ImageBitmap;
  canvasWidth: number;
  canvasHeight: number;
  objectFit: ObjectFitMode;
  objectPosition: string;
}

function resolvePositionValue(input: string | undefined, axis: 'x' | 'y') {
  if (!input) {
    return 0.5;
  }

  if (input.endsWith('%')) {
    return clamp(Number.parseFloat(input) / 100, 0, 1);
  }

  if (axis === 'x') {
    if (input === 'left') {
      return 0;
    }

    if (input === 'right') {
      return 1;
    }
  }

  if (axis === 'y') {
    if (input === 'top') {
      return 0;
    }

    if (input === 'bottom') {
      return 1;
    }
  }

  return 0.5;
}

function getSourceDimensions(
  image: HTMLImageElement | ImageBitmap
): CanvasFrameSourceDimensions {
  if (image instanceof HTMLImageElement) {
    return {
      width: image.naturalWidth,
      height: image.naturalHeight
    };
  }

  return {
    width: image.width,
    height: image.height
  };
}

export function drawFrameToCanvas({
  context,
  image,
  canvasWidth,
  canvasHeight,
  objectFit,
  objectPosition
}: DrawFrameToCanvasOptions) {
  const sourceDimensions = getSourceDimensions(image);
  if (sourceDimensions.width <= 0 || sourceDimensions.height <= 0) {
    return;
  }

  if (objectFit === 'fill') {
    context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    return;
  }

  const scale =
    objectFit === 'contain'
      ? Math.min(
          canvasWidth / sourceDimensions.width,
          canvasHeight / sourceDimensions.height
        )
      : Math.max(
          canvasWidth / sourceDimensions.width,
          canvasHeight / sourceDimensions.height
        );
  const destinationWidth = sourceDimensions.width * scale;
  const destinationHeight = sourceDimensions.height * scale;
  const [horizontalPosition, verticalPosition = 'center'] =
    objectPosition.split(/\s+/);
  const offsetX =
    (canvasWidth - destinationWidth) *
    resolvePositionValue(horizontalPosition, 'x');
  const offsetY =
    (canvasHeight - destinationHeight) *
    resolvePositionValue(verticalPosition, 'y');

  context.drawImage(
    image,
    offsetX,
    offsetY,
    destinationWidth,
    destinationHeight
  );
}
