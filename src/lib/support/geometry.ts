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

export function getScreenRect(el: Element): Rect {
  const { x, y, width, height } = el.getBoundingClientRect() as DOMRect & ClientRect

  return { x, y, width, height }
}

export function localRectFromScreenRect({ x, y, width, height }: Rect, origin: Point): Rect {
  return {
    x: x - origin.x,
    y: y - origin.y,
    width,
    height
  }
}

export function pointToPixelString({ x, y }: Point) {
  return `${x}px,${y}px`
}
