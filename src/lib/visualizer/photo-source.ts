// Turns a live camera frame, an uploaded photo, or a sample URL into one
// normalised canvas the renderer and lighting sampler can both read.

const MAX_EDGE = 2048;

function toCanvas(source: CanvasImageSource, width: number, height: number): HTMLCanvasElement {
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D is not available');
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function isCameraSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && window.isSecureContext;
}

export async function startCamera(video: HTMLVideoElement): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
  });
  video.srcObject = stream;
  await video.play();
  return stream;
}

export function stopCamera(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}

export function captureFrame(video: HTMLVideoElement): HTMLCanvasElement {
  if (!video.videoWidth) throw new Error('Camera is not ready yet');
  return toCanvas(video, video.videoWidth, video.videoHeight);
}

export async function loadPhotoFile(file: File): Promise<HTMLCanvasElement> {
  if (file.type && !file.type.startsWith('image/')) throw new Error('Please choose a photo (JPG or PNG).');
  let bitmap: ImageBitmap;
  try {
    // imageOrientation honours EXIF rotation from phone cameras.
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    // Typically an iPhone HEIC photo opened in a browser that cannot decode it.
    throw new Error(
      'This browser cannot open that photo format. Please use a JPG or PNG (on iPhone: Settings > Camera > Formats > Most Compatible).',
    );
  }
  try {
    return toCanvas(bitmap, bitmap.width, bitmap.height);
  } finally {
    bitmap.close();
  }
}

export function loadPhotoUrl(url: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    // Remote samples must be CORS-enabled or the canvas becomes unreadable to WebGL.
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(toCanvas(image, image.naturalWidth, image.naturalHeight));
    image.onerror = () => reject(new Error('Could not load the sample photo'));
    image.src = url;
  });
}

export function describeCameraError(error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError') return 'Camera permission was blocked. Allow it in your browser settings, or upload a photo instead.';
    if (error.name === 'NotFoundError') return 'No camera was found on this device. Upload a photo instead.';
    if (error.name === 'NotReadableError') return 'The camera is in use by another app.';
  }
  return error instanceof Error ? error.message : 'Could not start the camera.';
}
