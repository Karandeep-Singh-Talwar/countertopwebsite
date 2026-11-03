// Projective (perspective) mapping between the unit square and an arbitrary quad.
// Used to lay a flat slab texture onto a countertop photographed at an angle.

export interface Point {
  x: number;
  y: number;
}

export type Quad = readonly [Point, Point, Point, Point];

/** Row-major 3x3 matrix: [a, b, c, d, e, f, g, h, i]. */
export type Mat3 = readonly [number, number, number, number, number, number, number, number, number];

/**
 * Homography mapping (u, v) in the unit square to the quad corners, ordered
 * top-left, top-right, bottom-right, bottom-left (Heckbert's closed form).
 */
export function squareToQuad(quad: Quad): Mat3 {
  const [p0, p1, p2, p3] = quad;
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const dy3 = p0.y - p1.y + p2.y - p3.y;

  const det = dx1 * dy2 - dx2 * dy1;
  const g = det === 0 ? 0 : (dx3 * dy2 - dx2 * dy3) / det;
  const h = det === 0 ? 0 : (dx1 * dy3 - dx3 * dy1) / det;

  return [
    p1.x - p0.x + g * p1.x, p3.x - p0.x + h * p3.x, p0.x,
    p1.y - p0.y + g * p1.y, p3.y - p0.y + h * p3.y, p0.y,
    g, h, 1,
  ];
}

export function invert(m: Mat3): Mat3 | null {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const det = a * A + b * B + c * C;
  if (Math.abs(det) < 1e-12) return null;
  const s = 1 / det;
  return [
    A * s, -(b * i - c * h) * s, (b * f - c * e) * s,
    B * s, (a * i - c * g) * s, -(a * f - c * d) * s,
    C * s, -(a * h - b * g) * s, (a * e - b * d) * s,
  ];
}

export function apply(m: Mat3, p: Point): Point {
  const w = m[6] * p.x + m[7] * p.y + m[8];
  return {
    x: (m[0] * p.x + m[1] * p.y + m[2]) / w,
    y: (m[3] * p.x + m[4] * p.y + m[5]) / w,
  };
}

/** Image-pixel -> unit-square mapping, or null for a degenerate quad. */
export function quadToSquare(quad: Quad): Mat3 | null {
  return invert(squareToQuad(quad));
}

/** WebGL expects column-major order for uniformMatrix3fv. */
export function toColumnMajor(m: Mat3): Float32Array {
  return new Float32Array([m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]);
}

/** A quad is usable only when convex with consistent winding (no bow-tie). */
export function isConvexQuad(quad: Quad): boolean {
  let sign = 0;
  for (let k = 0; k < 4; k++) {
    const a = quad[k];
    const b = quad[(k + 1) % 4];
    const c = quad[(k + 2) % 4];
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (cross === 0) return false;
    const s = Math.sign(cross);
    if (sign === 0) sign = s;
    else if (s !== sign) return false;
  }
  return true;
}
