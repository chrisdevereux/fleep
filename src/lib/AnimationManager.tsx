import { Animation, AnimationDelegate } from "./animation/Animation"
import { AnimateTo } from "./animation/AnimateTo";
import { AnimateIn } from "./animation/AnimateIn";
import { AnimateOut } from "./animation/AnimateOut";

export interface AnimationManagerDelegate {
  getContextElement(): HTMLElement
}

export interface AnimatedComponent {
  id: string
  element: HTMLElement
  transitionIn?: React.ReactNode
  transitionOut?: React.ReactNode
}

export class AnimationManager implements AnimationDelegate {
  private activeAnimations = new Map<string, Animation>()

  constructor(
    private callbacks: AnimationManagerDelegate
  ) { }

  getContextElement() {
    return this.callbacks.getContextElement()
  }

  animationDidComplete(animation: Animation) {
    if (this.activeAnimations.get(animation.id) === animation) {
      this.activeAnimations.delete(animation.id)
    }
  }

  async componentWillUnmount({ element, id, transitionOut }: AnimatedComponent) {
    const existingTransition = this.activeAnimations.get(id)
    if (existingTransition) {
      existingTransition.stop()
    }

    const animateOut = new AnimateOut(element, id, transitionOut, this)
    const transitionToProgress = new AnimateTo(element, id, this)
    this.activeAnimations.set(id, transitionToProgress)
    
    animateOut.prepareStart()

    await new Promise(resolve => setTimeout(resolve))
  
    if (!transitionToProgress.active) {
      this.activeAnimations.delete(id)

      if (transitionOut) {
        this.activeAnimations.set(id, animateOut)
        animateOut.start()
      }

    } else {
      animateOut.abortStart()
    }
  }

  componentDidMount({ element, id, transitionIn }: AnimatedComponent) {
    const transitionTo = this.activeAnimations.get(id)

    if (transitionTo instanceof AnimateTo && !transitionTo.active) {
      transitionTo.transitionToElement(element)

    } else {
      if (transitionIn) {
        const progress = new AnimateIn(element, id, transitionIn, this)
        this.activeAnimations.set(id, progress)
  
        progress.start()
      }
    }
  }
}
