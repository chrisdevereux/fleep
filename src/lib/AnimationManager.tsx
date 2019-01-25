import { AnimateIn } from './animation/AnimateIn'
import { AnimateOut } from './animation/AnimateOut'
import { AnimateTo } from './animation/AnimateTo'
import { Animation, AnimationDelegate } from './animation/Animation'
import { MultiMap } from './support/MultiMap'
import { isInstanceOf } from './support/util'
import { TransitionDescriptor } from './TransitionDescriptor'

export interface AnimationManagerDelegate {
  readonly contextMounted: boolean
  getContextElement(): HTMLElement
}

export interface AnimatedComponent {
  id: string
  element: HTMLElement
  transitionIn?: TransitionDescriptor
  transitionOut?: TransitionDescriptor
  transitionFrom: TransitionDescriptor
}

export class AnimationManager implements AnimationDelegate {
  private activeAnimations = new MultiMap<string, Animation>()

  constructor(private callbacks: AnimationManagerDelegate) {}

  getContextElement() {
    return this.callbacks.getContextElement()
  }

  animationDidComplete(animation: Animation) {
    this.activeAnimations.delete(animation.id, animation)
  }

  async componentWillUnmount({
    element,
    id,
    transitionOut,
    transitionFrom,
  }: AnimatedComponent) {
    this.activeAnimations.get(id).forEach(a => a.stop())

    const animateOut =
      transitionOut && new AnimateOut(element, id, transitionOut, this)
    const animateTo = new AnimateTo(element, id, transitionFrom, this)
    this.activeAnimations.add(id, animateTo)

    if (animateOut) {
      animateOut.prepareStart()
    }

    await new Promise(resolve => setTimeout(resolve))

    if (!animateTo.active) {
      this.activeAnimations.delete(id, animateTo)

      if (animateOut) {
        this.activeAnimations.add(id, animateOut)
        animateOut.start()
      }
    } else {
      if (animateOut) {
        animateOut.abortStart()
      }
    }
  }

  componentDidMount({ element, id, transitionIn }: AnimatedComponent) {
    if (!this.callbacks.contextMounted) {
      return
    }

    const animateTo = this.activeAnimations
      .get(id)
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
