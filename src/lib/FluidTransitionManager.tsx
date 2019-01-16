import { TransitionTo } from "./transition-type/TransitionTo";
import { TransitionType, TransitionTypeDelegate } from "./transition-type/TransitionType"
import { TransitionIn } from "./transition-type/TransitionIn";

export interface FluidTransitionManagerCallbacks {
  getContextElement(): HTMLElement
}

export interface TransitionableComponent {
  id: string
  element: HTMLElement
  transitionIn?: React.ReactNode
  transitionOut?: React.ReactNode
}

export class FluidTransitionManager implements TransitionTypeDelegate {
  private transitions = new Map<string, TransitionType>()

  constructor(
    private callbacks: FluidTransitionManagerCallbacks
  ) { }

  getContextElement() {
    return this.callbacks.getContextElement()
  }

  animationDidComplete(id: string) {
    this.transitions.delete(id)
  }

  componentWillUnmount({ element, id, transitionOut }: TransitionableComponent) {
    const interpolation = this.transitions.get(id)
    if (interpolation) {
      interpolation.stop()
    }

    this.transitions.set(id, new TransitionTo(element, id, this))
    this.cullTransitionIfNotTriggeredImmediately(id)
  }

  componentDidMount({ element, id, transitionIn }: TransitionableComponent) {
    const transitionTo = this.transitions.get(id)

    if (transitionTo) {
      if (transitionTo.transitionToElement) {
        transitionTo.transitionToElement(element)
      }

    } else {
      if (transitionIn) {
        const progress = new TransitionIn(element, id, transitionIn, this)
        this.transitions.set(id, progress)
  
        progress.start()
      }
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
