import { render, unmountComponentAtNode } from 'react-dom'
import {
  getScreenRect,
  localRectFromScreenRect,
  pointToPixelString,
} from '../support/geometry'
import { getPermittedCssStyles } from '../support/style'
import { Transition } from '../transition/Transition'
import { TransitionDescriptor } from '../TransitionDescriptor'
import { Animation, AnimationDelegate } from './Animation'

export class AnimateOut implements Animation {
  private progress?: Transition.Progress

  private get contextBounds() {
    return getScreenRect(this.delegate.getContextElement())
  }

  constructor(
    outgoing: HTMLElement,
    readonly id: string,
    private transitionDef: TransitionDescriptor,
    private delegate: AnimationDelegate,
    private transitioning = outgoing.cloneNode() as HTMLElement,
    private outgoingStyle = getPermittedCssStyles(getComputedStyle(outgoing)),
    private outgoingBounds = getScreenRect(outgoing),
  ) {}

  get active() {
    return Boolean(this.progress)
  }

  prepareStart() {
    // Avoid flickering by immediately adding the transition node to the dom
    // before determining whether the transition should take place
    this.delegate.getContextElement().appendChild(this.transitioning)

    this.transitioning.style.position = 'absolute'
    this.transitioning.style.top = '0px'
    this.transitioning.style.left = '0px'
    this.transitioning.style.transform = `translate(${pointToPixelString(
      localRectFromScreenRect(this.outgoingBounds, this.contextBounds),
    )})`
  }

  abortStart() {
    this.transitioning.remove()
  }

  start() {
    const context = this.delegate.getContextElement()
    const finalParent = document.createElement('div')

    finalParent.style.opacity = '0'
    context.appendChild(finalParent)

    render(this.transitionDef.target, finalParent, () => {
      const final = finalParent.children[0] as HTMLElement

      this.progress = this.transitionDef.transition.start({
        contextBounds: this.contextBounds,
        startBounds: this.outgoingBounds,
        endBounds: getScreenRect(final),
        element: this.transitioning,
        startProps: this.outgoingStyle,
        endProps: getPermittedCssStyles(getComputedStyle(final)),
        onCompleted: () => {
          this.transitioning.remove()
          this.delegate.animationDidComplete(this)
        },
      })

      unmountComponentAtNode(finalParent)
    })
  }

  stop() {
    if (this.progress) {
      this.progress.stop()
    }
  }
}
