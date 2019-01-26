import { AnimateIn } from './animation/AnimateIn'
import { AnimateOut } from './animation/AnimateOut'
import { AnimateTo } from './animation/AnimateTo'
import { Animation, AnimationDelegate } from './animation/Animation'
import { Platform, ViewNode } from './platform/Platform'
import { MultiMap } from './support/MultiMap'
import { isInstanceOf } from './support/util'
import { TransitionDescriptor } from './TransitionDescriptor'

export interface AnimationManagerDelegate extends Platform {
  readonly contextMounted: boolean
}

export interface AnimatedComponent {
  id: string
  ref: unknown
  transitionIn?: TransitionDescriptor
  transitionOut?: TransitionDescriptor
  transitionFrom: TransitionDescriptor
}

export class AnimationManager implements AnimationDelegate {
  private activeAnimations = new MultiMap<string, Animation>()

  get platform() {
    return this.delegate
  }

  constructor(private delegate: AnimationManagerDelegate) {}

  animationDidComplete(animation: Animation) {
    this.activeAnimations.delete(animation.id, animation)
  }

  async componentWillUnmount({
    ref,
    id,
    transitionOut,
    transitionFrom,
  }: AnimatedComponent) {
    this.activeAnimations.get(id).forEach(a => a.stop())

    const el = this.platform.adoptElement(ref)

    const animateOut =
      transitionOut && new AnimateOut(el, id, transitionOut, this)
    const animateTo = new AnimateTo(el, id, transitionFrom, this)
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

  componentDidMount({ ref, id, transitionIn }: AnimatedComponent) {
    if (!this.delegate.contextMounted) {
      return
    }

    const el = this.platform.adoptElement(ref)
    const animateTo = this.activeAnimations
      .get(id)
      .find(isInstanceOf(AnimateTo))

    if (animateTo && !animateTo.active) {
      animateTo.startWithElement(el)
    } else {
      if (transitionIn) {
        const animateIn = new AnimateIn(el, id, transitionIn, this)
        this.activeAnimations.add(id, animateIn)

        animateIn.start()
      }
    }
  }
}
