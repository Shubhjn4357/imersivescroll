const frameImageCache = new Map<string, Promise<HTMLImageElement>>();

export async function loadFrameImage(
  frameUrl: string
): Promise<HTMLImageElement> {
  const cachedImage = frameImageCache.get(frameUrl);
  if (cachedImage) {
    return cachedImage;
  }

  const nextImage = new Image();
  nextImage.decoding = 'async';
  nextImage.loading = 'eager';

  const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
    nextImage.onload = () => resolve(nextImage);
    nextImage.onerror = () =>
      reject(new Error(`Failed to load frame: ${frameUrl}`));
    nextImage.src = frameUrl;
  });

  frameImageCache.set(frameUrl, imagePromise);

  try {
    return await imagePromise;
  } catch (error) {
    frameImageCache.delete(frameUrl);
    throw error;
  }
}
