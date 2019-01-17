import { Animation, AnimationDelegate } from "./animation/Animation"
import { AnimateTo } from "./animation/AnimateTo";
import { AnimateIn } from "./animation/AnimateIn";
import { AnimateOut } from "./animation/AnimateOut";
import { MultiMap } from "./support/MultiMap";
import { isInstanceOf } from "./support/util";

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
  private activeAnimations = new MultiMap<string, Animation>()

  constructor(
    private callbacks: AnimationManagerDelegate
  ) { }

  getContextElement() {
    return this.callbacks.getContextElement()
  }

  animationDidComplete(animation: Animation) {
    this.activeAnimations.delete(animation.id, animation)
  }

  async componentWillUnmount({ element, id, transitionOut }: AnimatedComponent) {
    this.activeAnimations
      .get(id)
      .forEach(a => a.stop())

    const animateOut = new AnimateOut(element, id, transitionOut, this)
    const animateTo = new AnimateTo(element, id, this)
    this.activeAnimations.add(id, animateTo)
    
    animateOut.prepareStart()

    await new Promise(resolve => setTimeout(resolve))
  
    if (!animateTo.active) {
      this.activeAnimations.delete(id, animateTo)

      if (transitionOut) {
        this.activeAnimations.add(id, animateOut)
        animateOut.start()
      }

    } else {
      animateOut.abortStart()
    }
  }

  componentDidMount({ element, id, transitionIn }: AnimatedComponent) {
    const animateTo = this.activeAnimations.get(id)
      .find(isInstanceOf(AnimateTo))

    if (animateTo && !animateTo.active) {
      animateTo.startWithElement(element)

    } else {
      if (transitionIn) {
        const animateIn = new AnimateIn(element, id, transitionIn, this)
        this.activeAnimations.add(id, animateIn)
  
        animateIn.start()
      }
    }
  }
}
