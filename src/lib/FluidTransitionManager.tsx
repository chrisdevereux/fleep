import { TransitionTo } from "./transition-type/TransitionTo";
import { TransitionType, TransitionTypeDelegate } from "./transition-type/TransitionType"
import { TransitionIn } from "./transition-type/TransitionIn";
import { TransitionOut } from "./transition-type/TransitionOut";

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

  async componentWillUnmount({ element, id, transitionOut }: TransitionableComponent) {
    const existingTransition = this.transitions.get(id)
    if (existingTransition) {
      existingTransition.stop()
    }

    const transitionOutProgress = new TransitionOut(element, id, transitionOut, this)
    const transitionToProgress = new TransitionTo(element, id, this)
    this.transitions.set(id, transitionToProgress)
    
    transitionOutProgress.prepareStart()

    await new Promise(resolve => setTimeout(resolve))
  
    if (!transitionToProgress.active) {
      this.transitions.delete(id)

      if (transitionOut) {
        this.transitions.set(id, transitionOutProgress)
        transitionOutProgress.start()
      }

    } else {
      transitionOutProgress.abortStart()
    }
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
}
