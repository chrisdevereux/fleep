import { ViewNode } from '../platform/Platform';
import { Transition } from '../transition/Transition'
import { TransitionDescriptor } from '../TransitionDescriptor'
import { Animation, AnimationDelegate } from './Animation'

export class AnimateTo implements Animation {
  private progress?: Transition.Progress

  constructor(
    outgoingElement: ViewNode,
    readonly id: string,
    private transitionDef: TransitionDescriptor,
    private delegate: AnimationDelegate,
    private transitioning = outgoingElement.clone(),
    private outgoingBounds = outgoingElement.bounds,
    private outgoingStyle = outgoingElement.style
  ) {}

  get active() {
    return Boolean(this.progress)
  }

  stop() {
    if (this.progress) {
      this.progress.stop()
    }
  }

  startWithElement(incoming: ViewNode) {
    incoming.setHidden(true)

    this.progress = this.transitionDef.transition.start({
      startBounds: this.outgoingBounds,
      endBounds: incoming.bounds,
      element: this.transitioning,
      startProps: this.outgoingStyle,
      endProps: incoming.style,
      onCompleted: () => {
        incoming.setHidden(false)
        this.transitioning.remove()
        this.delegate.animationDidComplete(this)
      },
    })
  }
}
