import { ViewNode } from '../platform/Platform';
import { Rect } from '../support/geometry'
import { Dict } from '../support/util';

export interface TransitionParams<NativeElementT= any, StyleT = any> {
  element: ViewNode<StyleT, NativeElementT>
  startProps: Dict<keyof StyleT>
  endProps: Dict<keyof StyleT>
  startBounds: Rect
  endBounds: Rect
  onCompleted: Transition.OnComplete
}

export interface Transition<NativeElementT = any, StyleT = any> {
  start(params: TransitionParams<NativeElementT, StyleT>): Transition.Progress
}

export namespace Transition {
  export type OnComplete = (err?: Error) => void

  export interface Progress {
    stop(): void
  }
}
