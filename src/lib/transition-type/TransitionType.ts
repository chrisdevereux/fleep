export interface TransitionType {
  active: boolean
  stop(): void
  transitionToElement?(element: HTMLElement): void
}

export interface TransitionTypeDelegate {
  getContextElement(): HTMLElement
  animationDidComplete(id: string): void
}
