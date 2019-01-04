import { FluidTransition, FluidTransitionCallbacks } from "./FluidTransition";

export interface FluidTransitionManagerCallbacks {
  getContextElement(): HTMLElement
}

export class FluidTransitionManager implements FluidTransitionCallbacks {
  private transitions = new Map<string, FluidTransition>()

  constructor(
    private callbacks: FluidTransitionManagerCallbacks
  ) { }

  getContextElement() {
    return this.callbacks.getContextElement()
  }

  setOutgoingElementForId(element: HTMLElement, id: string) {
    this.transitions.set(id, new FluidTransition(element, this))
    this.cullTransitionIfNotTriggeredImmediately(id)
  }

  setIncomingElementForId(element: HTMLElement, id: string) {
    const transition = this.transitions.get(id)

    if (transition) {
      transition.transitionToElement(element)
    }
  }

  private cullTransitionIfNotTriggeredImmediately(id: string) {
    setTimeout(() => {
      const transition = this.transitions.get(id)

      if (transition && !transition.active) {
        this.transitions.delete(id)
      }
    })
  }
}
