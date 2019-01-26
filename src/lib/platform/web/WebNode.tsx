import {
  localRectFromScreenRect,
  pointToPixelString,
  Rect,
} from '../../support/geometry'
import { ViewNode } from '../Platform'
import { CSSStyles, getPermittedCssStyles, getScreenRect } from './web-utils'

export class DOMViewNode implements ViewNode<CSSStyles, HTMLElement> {
  mounted = true

  get bounds() {
    return localRectFromScreenRect(
      getScreenRect(this.nativeElement),
      getScreenRect(this.contextElement),
    )
  }

  get style() {
    return getPermittedCssStyles(getComputedStyle(this.nativeElement))
  }

  constructor(
    readonly nativeElement: HTMLElement,
    private contextElement: HTMLElement,
  ) {}

  setBounds(bounds: Rect): void {
    this.nativeElement.style.left = '0px'
    this.nativeElement.style.top = '0px'
    this.nativeElement.style.transform = pointToPixelString(bounds)
  }

  setStyle(style: CSSStyles): void {
    for (const key in style) {
      if (style[key]) {
        this.nativeElement.style[key] = style[key]!
      }
    }
  }

  remove(): void {
    this.mounted = false
    this.nativeElement.remove()
  }

  clone(): ViewNode<CSSStyles, HTMLElement> {
    const clone = this.nativeElement.cloneNode() as HTMLElement
    this.contextElement.appendChild(clone)

    return new DOMViewNode(clone, this.contextElement)
  }

  setHidden(hidden: boolean): void {
    this.nativeElement.style.opacity = hidden ? '0' : null
  }
}
