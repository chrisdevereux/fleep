import { Rect } from '../support/geometry'

export interface PlatformRenderOpts {
  offscreen?: boolean
}

export interface Platform<ViewNodeT extends ViewNode = ViewNode> {
  renderElement(
    el: React.ReactElement<{}>,
    opts?: PlatformRenderOpts,
  ): Promise<ViewNodeT>
  adoptElement(el: unknown): ViewNodeT
}

export interface ViewNode<StyleT = any, NativeElementT = any> {
  readonly bounds: Rect
  readonly style: Partial<StyleT>
  readonly nativeElement: NativeElementT
  readonly mounted: boolean

  setBounds(bounds: Rect): void
  setStyle(style: Partial<StyleT>): void
  remove(): void
  clone(): ViewNode<StyleT>

  setHidden(hidden: boolean): void
}
