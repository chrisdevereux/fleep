import { Animation, AnimationDelegate } from "./Animation";
import { render, unmountComponentAtNode } from "react-dom";
import React from "react";
import { Transition } from "../transition/Transition";
import { springTransition } from "../transition/popmotion";
import { getPermittedCssStyles } from "../support/style";
import { TransitionDescriptor } from "../TransitionDescriptor";

export class AnimateIn implements Animation {
  private progress?: Transition.Progress
  
  constructor(
    private incomingElement: HTMLElement,
    readonly id: string,
    private transitionDef: TransitionDescriptor,
    private delegate: AnimationDelegate
  ) { }

  get active() {
    return Boolean(this.progress)
  }

  start() {
    const context = this.delegate.getContextElement()
    const transitioningParent = document.createElement('div')
    const incoming = this.incomingElement
  
    context.appendChild(transitioningParent)

    render(this.transitionDef.target, transitioningParent, () => {
      const transitioning = transitioningParent.children[0] as HTMLElement
  
      this.progress = this.transitionDef.transition.start({
        contextBounds: context.getBoundingClientRect(),
        startBounds: transitioning.getBoundingClientRect(),
        endBounds: incoming.getBoundingClientRect(),
        element: transitioning,
        startProps: getPermittedCssStyles(getComputedStyle(transitioning)),
        endProps: getPermittedCssStyles(getComputedStyle(incoming)),
        onCompleted: () => {
          incoming.style.opacity = null;
          unmountComponentAtNode(transitioningParent)

          this.delegate.animationDidComplete(this)
        }
      })
  
      incoming.style.opacity = '0';
      transitioning.style.position = 'absolute'
      transitioning.style.top = "0px"
      transitioning.style.left = "0px"
    })
  }

  stop() {
    if (this.progress) {
      this.progress.stop()
    }
  }
}
