import { Rect } from "../../support/geometry";

export type CSSStyleKey = keyof CSSStyleDeclaration
export type CSSStyles = Partial<Record<CSSStyleKey, string>>

const permittedStyleKeys: CSSStyleKey[] = [
  'borderRadius',
  'opacity',
  'backgroundColor',
]

export function getPermittedCssStyles(styles: CSSStyleDeclaration) {
  const object: CSSStyles = {}

  permittedStyleKeys.forEach(key => {
    object[key as any] = styles[key]
  })

  return object
}

export function getScreenRect(el: Element): Rect {
  const { x, y, width, height } = el.getBoundingClientRect() as DOMRect &
    ClientRect

  return { x, y, width, height }
}
