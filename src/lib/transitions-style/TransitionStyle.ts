import { StyleMap } from "../style";

export interface TransitionParams {
  element: HTMLElement
  startProps: StyleMap
  endProps: StyleMap
  startBounds: ClientRect
  endBounds: ClientRect
  contextBounds: ClientRect
  onCompleted: TransitionStyle.OnCompleted
}

export interface TransitionStyle {
  transition(params: TransitionParams): TransitionStyle.Progress
}

export namespace TransitionStyle {
  export type OnCompleted = (err?: Error) => void

  export interface Progress {
    stop(): void
  }
}
