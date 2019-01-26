import { ViewNode } from '../platform/Platform';
import { Transition } from '../transition/Transition'
import { TransitionDescriptor } from '../TransitionDescriptor'
import { Animation, AnimationDelegate } from './Animation'

export class AnimateIn implements Animation {
  private progress?: Transition.Progress

  constructor(
    private incomingElement: ViewNode,
    readonly id: string,
    private transitionDef: TransitionDescriptor,
    private delegate: AnimationDelegate,
  ) {}

  get active() {
    return Boolean(this.progress)
  }

  async start() {
    this.incomingElement.setHidden(true)
    const transitionElement = await this.delegate.platform.renderElement(this.transitionDef.target)

    this.progress = this.transitionDef.transition.start({
      startBounds: transitionElement.bounds,
      endBounds: this.incomingElement.bounds,
      element: transitionElement,
      startProps: transitionElement.style,
      endProps: this.incomingElement.style,
      onCompleted: () => {
        this.incomingElement.setHidden(false)
        transitionElement.remove()

        this.delegate.animationDidComplete(this)
      },
    })
  }

  stop() {
    if (this.progress) {
      this.progress.stop()
    }
  }
}
