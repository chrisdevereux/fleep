import { render, unmountComponentAtNode } from 'react-dom'
import { getScreenRect } from '../support/geometry'
import { getPermittedCssStyles } from '../support/style'
import { Transition } from '../transition/Transition'
import { TransitionDescriptor } from '../TransitionDescriptor'
import { Animation, AnimationDelegate } from './Animation'

export class AnimateIn implements Animation {
  private progress?: Transition.Progress

  constructor(
    private incomingElement: HTMLElement,
    readonly id: string,
    private transitionDef: TransitionDescriptor,
    private delegate: AnimationDelegate,
  ) {}

  get active() {
    return Boolean(this.progress)
  }

  start() {
    const context = this.delegate.getContextElement()
    const transitioningParent = document.createElement('div')
    const incoming = this.incomingElement

    transitioningParent.style.opacity = '0'
    transitioningParent.style.position = 'absolute'
    transitioningParent.style.left = '0px'
    transitioningParent.style.top = '0px'
    transitioningParent.style.width = '100%'
    transitioningParent.style.height = '100%'
    context.appendChild(transitioningParent)

    render(this.transitionDef.target, transitioningParent, () => {
      const transitioning = transitioningParent.children[0] as HTMLElement

      this.progress = this.transitionDef.transition.start({
        contextBounds: getScreenRect(context),
        startBounds: getScreenRect(transitioning),
        endBounds: getScreenRect(incoming),
        element: transitioning,
        startProps: getPermittedCssStyles(getComputedStyle(transitioning)),
        endProps: getPermittedCssStyles(getComputedStyle(incoming)),
        onCompleted: () => {
          incoming.style.opacity = null
          unmountComponentAtNode(transitioningParent)

          this.delegate.animationDidComplete(this)
        },
      })

      incoming.style.opacity = '0'
      transitioning.style.position = 'absolute'
      transitioning.style.top = '0px'
      transitioning.style.left = '0px'
    })
  }

  stop() {
    if (this.progress) {
      this.progress.stop()
    }
  }
}
