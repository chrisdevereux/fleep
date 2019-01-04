import { styler, value, spring, ColdSubscription } from "popmotion";

export interface FluidTransitionCallbacks {
  getContextElement(): HTMLElement
  animationDidComplete(id: string): void
}

interface ActiveState {
  action: ColdSubscription
  transitioning: HTMLElement
  incomingParent: HTMLElement
  incoming: HTMLElement
}

export class FluidTransition {
  private outgoingBounds: ClientRect
  private activeState?: ActiveState

  constructor(
    private outgoingElement: HTMLElement,
    private id: string,
    private callbacks: FluidTransitionCallbacks
  ) {
    this.outgoingBounds = outgoingElement.getBoundingClientRect()
  }

  get active() {
    return Boolean(this.activeState)
  }

  stop() {
    if (!this.activeState) {
      return
    }

    this.restoreDomToStaticState()
    this.activeState.action.stop()
    this.activeState = undefined
    
    this.callbacks.animationDidComplete(this.id)
  }

  transitionToElement(incoming: HTMLElement) {
    const context = this.callbacks.getContextElement()
    const outgoing = this.outgoingElement
    const transitioning = outgoing.cloneNode() as HTMLElement

    const startBounds = this.outgoingBounds
    const targetBounds = incoming.getBoundingClientRect()
    const contextBounds = context.getBoundingClientRect()

    const from = {
      x: startBounds.left - contextBounds.left,
      y: startBounds.top - contextBounds.top
    }

    const to = {
      x: targetBounds.left - contextBounds.left,
      y: targetBounds.top - contextBounds.top
    }
    
    const transitionStyler = styler(transitioning)
    const transitionVal = value(from, transitionStyler.set)

    transitioning.style.position = 'absolute'
    transitioning.style.top = "0px"
    transitioning.style.left = "0px"
    context.appendChild(transitioning)

    const incomingParent = incoming.parentElement!

    const action = spring({
      from: transitionVal.get(),
      to,
      stiffness: 500,
    }).start({
      update: transitionVal.update.bind(transitionVal),
      complete: () => {
        transitionVal.complete()
        this.restoreDomToStaticState()
        this.activeState = undefined
      }
    })

    this.activeState = {
      action,
      incomingParent,
      transitioning,
      incoming
    }

    incoming.remove()
  }

  private restoreDomToStaticState() {
    if (!this.activeState) {
      return
    }

    this.activeState.transitioning.remove()
    this.activeState.incomingParent.appendChild(this.activeState.incoming)
  }
}
