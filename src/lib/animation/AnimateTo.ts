import {
  getScreenRect,
  localRectFromScreenRect,
  pointToPixelString,
  Rect,
} from '../support/geometry'
import { getPermittedCssStyles, StyleMap } from '../support/style'
import { Transition } from '../transition/Transition'
import { TransitionDescriptor } from '../TransitionDescriptor'
import { Animation, AnimationDelegate } from './Animation'

export class AnimateTo implements Animation {
  private outgoingBounds: Rect
  private outgoingStyles: StyleMap
  private progress?: Transition.Progress

  private get contextBounds() {
    return getScreenRect(this.delegate.getContextElement())
  }

  constructor(
    outgoingElement: HTMLElement,
    readonly id: string,
    private transitionDef: TransitionDescriptor,
    private delegate: AnimationDelegate,
    private transitioning = outgoingElement.cloneNode() as HTMLElement,
  ) {
    this.outgoingBounds = getScreenRect(outgoingElement)
    this.outgoingStyles = getPermittedCssStyles(
      getComputedStyle(outgoingElement),
    )

    this.delegate.getContextElement().appendChild(this.transitioning)

    this.transitioning.style.position = 'absolute'
    this.transitioning.style.top = '0px'
    this.transitioning.style.left = '0px'
    this.transitioning.style.transform = `translate(${pointToPixelString(
      localRectFromScreenRect(this.outgoingBounds, this.contextBounds),
    )})`
  }

  get active() {
    return Boolean(this.progress)
  }

  stop() {
    if (this.progress) {
      this.progress.stop()
    }
  }

  startWithElement(incoming: HTMLElement) {
    const context = this.delegate.getContextElement()

    this.progress = this.transitionDef.transition.start({
      contextBounds: this.contextBounds,
      startBounds: this.outgoingBounds,
      endBounds: getScreenRect(incoming),
      element: this.transitioning,
      startProps: this.outgoingStyles,
      endProps: getPermittedCssStyles(getComputedStyle(incoming)),
      onCompleted: () => {
        incoming.style.opacity = null
        this.transitioning.remove()
        this.delegate.animationDidComplete(this)
      },
    })

    incoming.style.opacity = '0'

    context.appendChild(this.transitioning)
  }
}
