import { Rect } from '../support/geometry'
import { StyleMap } from '../support/style'

export interface TransitionParams {
  element: HTMLElement
  startProps: StyleMap
  endProps: StyleMap
  startBounds: Rect
  endBounds: Rect
  contextBounds: Rect
  onCompleted: Transition.OnComplete
}

export interface Transition {
  start(params: TransitionParams): Transition.Progress
}

export namespace Transition {
  export type OnComplete = (err?: Error) => void

  export interface Progress {
    stop(): void
  }
}
