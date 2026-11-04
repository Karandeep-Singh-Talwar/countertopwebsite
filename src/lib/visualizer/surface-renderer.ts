// WebGL2 renderer that repaints marked surfaces of a room photo with a product
// texture. Per pixel: image position -> inverse homography -> slab UV, then the
// slab colour is multiplied by the photo's own relative brightness so existing
// shadows, under-cabinet light and reflections carry over onto the new stone.

import { toColumnMajor, type Mat3 } from './homography';
import type { LightMap } from './light-map';
import type { SurfaceMask } from './types';

export interface SurfaceDrawSpec {
  toSquare: Mat3;
  textureUrl: string;
  /** Texture repeats across the quad in u and v (slab layout). */
  repeat: readonly [number, number];
  rotated: boolean;
  tiled: boolean;
  tileGrid: readonly [number, number];
  baseLuminance: number;
  shadeStrength: number;
  /** When set, the mask (not the quad) decides coverage; the quad only supplies perspective. */
  mask?: SurfaceMask;
  /** Also trim to the quad: hand-placed surfaces cover only where quad and mask overlap. */
  clipToQuad: boolean;
  /** Smoothed lighting for this surface; the old surface's pattern is blurred out of it. */
  light: LightMap;
}

export interface SurfaceRenderer {
  setPhoto: (photo: HTMLCanvasElement) => void;
  render: (surfaces: readonly SurfaceDrawSpec[], showOriginal: boolean) => void;
  dispose: () => void;
}

const VERTEX_SHADER = `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() { gl_Position = vec4(P[gl_VertexID], 0.0, 1.0); }`;

const PHOTO_SHADER = `#version 300 es
precision highp float;
uniform sampler2D uPhoto;
uniform vec2 uResolution;
out vec4 outColor;
void main() {
  vec2 p = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  outColor = texture(uPhoto, p / uResolution);
}`;

const SURFACE_SHADER = `#version 300 es
precision highp float;
uniform sampler2D uPhoto;
uniform sampler2D uMaterial;
uniform sampler2D uMask;
uniform sampler2D uLight;
uniform bool uHasMask;
uniform bool uClipToQuad;
uniform vec2 uResolution;
uniform mat3 uToSquare;
uniform vec2 uRepeat;
uniform bool uRotated;
uniform bool uTiled;
uniform vec2 uTileGrid;
uniform float uBaseLum;
uniform float uShadeStrength;
out vec4 outColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 p = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec3 q = uToSquare * vec3(p, 1.0);
  vec2 uv = q.xy / q.z;
  if (q.z <= 0.0) discard;

  float alpha = 1.0;
  if (!uHasMask || uClipToQuad) {
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
    // Soft 1-2px edge so the new surface does not look cut out with scissors.
    float edge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    alpha = clamp(edge / max(fwidth(edge) * 1.5, 1e-5), 0.0, 1.0);
  }
  if (uHasMask) {
    // Detected area: the mask trims the plane and keeps pots, taps and stoves
    // in front. Linear filtering feathers the edge.
    alpha = min(alpha, smoothstep(0.3, 0.7, texture(uMask, p / uResolution).r));
    if (alpha <= 0.0) discard;
  }

  vec2 st = uRotated ? uv.yx : uv;
  vec3 material;
  if (uTiled) {
    vec2 cell = st * uTileGrid;
    vec2 id = floor(cell);
    vec2 f = fract(cell);
    vec2 g = fwidth(cell) * 1.2;
    vec2 body = smoothstep(vec2(0.0), g, f) * smoothstep(vec2(0.0), g, 1.0 - f);
    float grout = 1.0 - body.x * body.y;
    // Each tile shows a different face of the slab, like real random-face porcelain.
    vec2 offset = vec2(hash(id), hash(id + 17.0)) * 0.5;
    material = mix(texture(uMaterial, f * 0.5 + offset).rgb, vec3(0.82, 0.8, 0.77), grout);
  } else {
    material = texture(uMaterial, st * uRepeat).rgb;
  }

  float lum = texture(uLight, p / uResolution).r;
  float shade = clamp(lum / max(uBaseLum, 0.05), 0.3, 1.8);
  outColor = vec4(material * mix(1.0, shade, uShadeStrength), alpha);
}`;

/** Texture unit reserved for uploads; units 0-3 hold photo, slab, mask and light during draws. */
const UPLOAD_UNIT = (gl: WebGL2RenderingContext) => gl.TEXTURE7;

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Could not allocate shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log ?? 'unknown error'}`);
  }
  return shader;
}

function link(gl: WebGL2RenderingContext, fragmentSource: string): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error('Could not allocate program');
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Program link failed: ${gl.getProgramInfoLog(program) ?? 'unknown error'}`);
  }
  return program;
}

export function createSurfaceRenderer(
  canvas: HTMLCanvasElement,
  onTextureReady: () => void,
): SurfaceRenderer {
  const context = canvas.getContext('webgl2', { alpha: false, preserveDrawingBuffer: true, antialias: true });
  if (!context) throw new Error('WebGL2 is not available in this browser');
  const gl: WebGL2RenderingContext = context;

  const photoProgram = link(gl, PHOTO_SHADER);
  const surfaceProgram = link(gl, SURFACE_SHADER);
  const vao = gl.createVertexArray();
  const anisotropy = gl.getExtension('EXT_texture_filter_anisotropic');
  const photoTexture = gl.createTexture();
  const materials = new Map<string, WebGLTexture | 'loading' | 'failed'>();
  // Masks are immutable, so object identity is a safe cache key.
  const masks = new Map<SurfaceMask, WebGLTexture>();
  const lights = new Map<LightMap, WebGLTexture>();
  let disposed = false;

  const uniform = (program: WebGLProgram, name: string) => gl.getUniformLocation(program, name);

  function loadMaterial(url: string): WebGLTexture | null {
    const cached = materials.get(url);
    if (cached instanceof WebGLTexture) return cached;
    if (cached) return null;

    materials.set(url, 'loading');
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      if (disposed) return;
      const texture = gl.createTexture();
      gl.activeTexture(UPLOAD_UNIT(gl));
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      // Mirrored repeat reads as book-matched slabs instead of hard seams.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      if (anisotropy) {
        const max = gl.getParameter(anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number;
        gl.texParameterf(gl.TEXTURE_2D, anisotropy.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, max));
      }
      if (texture) materials.set(url, texture);
      onTextureReady();
    };
    image.onerror = () => materials.set(url, 'failed');
    image.src = url;
    return null;
  }

  /** Uploads a single-channel byte image (mask or light map) as a linearly filtered texture. */
  function uploadR8(image: { width: number; height: number; data: Uint8Array }): WebGLTexture | null {
    const texture = gl.createTexture();
    if (!texture) return null;
    // Upload on a spare unit: binding on whichever unit is active mid-draw would
    // silently replace the slab texture already bound there.
    const previousUnit = gl.getParameter(gl.ACTIVE_TEXTURE) as number;
    gl.activeTexture(UPLOAD_UNIT(gl));
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Single-byte rows of odd width are not 4-byte aligned.
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, image.width, image.height, 0, gl.RED, gl.UNSIGNED_BYTE, image.data);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.activeTexture(previousUnit);
    return texture;
  }

  function cached<K extends object>(cache: Map<K, WebGLTexture>, key: K, image: { width: number; height: number; data: Uint8Array }) {
    const hit = cache.get(key);
    if (hit) return hit;
    const texture = uploadR8(image);
    if (texture) cache.set(key, texture);
    return texture;
  }

  /** Frees textures whose mask or light map no longer belongs to any surface. */
  function prune<K extends object>(cache: Map<K, WebGLTexture>, inUse: ReadonlySet<K>) {
    cache.forEach((texture, key) => {
      if (inUse.has(key)) return;
      gl.deleteTexture(texture);
      cache.delete(key);
    });
  }

  function setPhoto(photo: HTMLCanvasElement) {
    canvas.width = photo.width;
    canvas.height = photo.height;
    gl.bindTexture(gl.TEXTURE_2D, photoTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, photo);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  function render(surfaces: readonly SurfaceDrawSpec[], showOriginal: boolean) {
    if (disposed) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindVertexArray(vao);

    gl.disable(gl.BLEND);
    gl.useProgram(photoProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, photoTexture);
    gl.uniform1i(uniform(photoProgram, 'uPhoto'), 0);
    gl.uniform2f(uniform(photoProgram, 'uResolution'), canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (showOriginal) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(surfaceProgram);
    gl.uniform1i(uniform(surfaceProgram, 'uPhoto'), 0);
    gl.uniform1i(uniform(surfaceProgram, 'uMaterial'), 1);
    gl.uniform1i(uniform(surfaceProgram, 'uMask'), 2);
    gl.uniform1i(uniform(surfaceProgram, 'uLight'), 3);
    gl.uniform2f(uniform(surfaceProgram, 'uResolution'), canvas.width, canvas.height);

    for (const spec of surfaces) {
      const material = loadMaterial(spec.textureUrl);
      if (!material) continue;
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, material);
      gl.uniformMatrix3fv(uniform(surfaceProgram, 'uToSquare'), false, toColumnMajor(spec.toSquare));
      gl.uniform2f(uniform(surfaceProgram, 'uRepeat'), spec.repeat[0], spec.repeat[1]);
      gl.uniform1i(uniform(surfaceProgram, 'uRotated'), spec.rotated ? 1 : 0);
      gl.uniform1i(uniform(surfaceProgram, 'uTiled'), spec.tiled ? 1 : 0);
      gl.uniform2f(uniform(surfaceProgram, 'uTileGrid'), spec.tileGrid[0], spec.tileGrid[1]);
      gl.uniform1f(uniform(surfaceProgram, 'uBaseLum'), spec.baseLuminance);
      gl.uniform1f(uniform(surfaceProgram, 'uShadeStrength'), spec.shadeStrength);
      const maskTexture = spec.mask ? cached(masks, spec.mask, spec.mask) : null;
      gl.uniform1i(uniform(surfaceProgram, 'uHasMask'), maskTexture ? 1 : 0);
      gl.uniform1i(uniform(surfaceProgram, 'uClipToQuad'), spec.clipToQuad ? 1 : 0);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, maskTexture);
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, cached(lights, spec.light, spec.light));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    prune(masks, new Set(surfaces.flatMap((s) => (s.mask ? [s.mask] : []))));
    prune(lights, new Set(surfaces.map((s) => s.light)));
  }

  function dispose() {
    disposed = true;
    materials.forEach((t) => t instanceof WebGLTexture && gl.deleteTexture(t));
    masks.forEach((t) => gl.deleteTexture(t));
    lights.forEach((t) => gl.deleteTexture(t));
    gl.deleteTexture(photoTexture);
    gl.deleteProgram(photoProgram);
    gl.deleteProgram(surfaceProgram);
    gl.deleteVertexArray(vao);
  }

  return { setPhoto, render, dispose };
}
