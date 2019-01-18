import { StyleMap } from "../support/style";

export interface TransitionParams {
  element: HTMLElement
  startProps: StyleMap
  endProps: StyleMap
  startBounds: ClientRect
  endBounds: ClientRect
  contextBounds: ClientRect
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
