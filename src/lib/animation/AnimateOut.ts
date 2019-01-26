import { ViewNode } from '../platform/Platform'
import { getPermittedCssStyles } from '../platform/web/web-utils'
import { Transition } from '../transition/Transition'
import { TransitionDescriptor } from '../TransitionDescriptor'
import { Animation, AnimationDelegate } from './Animation'

export class AnimateOut implements Animation {
  private progress?: Transition.Progress

  constructor(
    outgoing: ViewNode,
    readonly id: string,
    private transitionDef: TransitionDescriptor,
    private delegate: AnimationDelegate,
    private transitioning = outgoing.clone(),
    private outgoingStyle = outgoing.style,
    private outgoingBounds = outgoing.bounds,
  ) {}

  get active() {
    return Boolean(this.progress)
  }

  prepareStart() {
    this.transitioning.setBounds(this.outgoingBounds)
  }

  abortStart() {
    this.transitioning.remove()
  }

  async start() {
    const final = await this.delegate.platform.renderElement(
      this.transitionDef.target,
      {
        offscreen: true,
      },
    )

    this.progress = this.transitionDef.transition.start({
      startBounds: this.outgoingBounds,
      endBounds: final.bounds,
      element: this.transitioning,
      startProps: this.outgoingStyle,
      endProps: final.style,
      onCompleted: () => {
        this.transitioning.remove()
        this.delegate.animationDidComplete(this)
      },
    })

    final.remove()
  }

  stop() {
    if (this.progress) {
      this.progress.stop()
    }
  }
}
