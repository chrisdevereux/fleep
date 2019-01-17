export interface Animation {
  readonly id: string
  readonly active: boolean
  stop(): void
}

export interface AnimationDelegate {
  getContextElement(): HTMLElement
  animationDidComplete(animation: Animation): void
}
