export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

export function localRectFromScreenRect(
  { x, y, width, height }: Rect,
  origin: Point,
): Rect {
  return {
    x: x - origin.x,
    y: y - origin.y,
    width,
    height,
  }
}

export function pointToPixelString({ x, y }: Point) {
  return `${x}px,${y}px`
}
