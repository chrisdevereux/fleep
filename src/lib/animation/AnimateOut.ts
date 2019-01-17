import { Animation, AnimationDelegate } from "./Animation";
import { render, unmountComponentAtNode } from "react-dom";
import React from "react";
import { Transition } from "../transition/Transition";
import { createSpringAnimation } from "../transition/popmotion";
import { getPermittedCssStyles } from "../support/style";

export class AnimateOut implements Animation {
  private progress?: Transition.Progress
  
  constructor(
    outgoing: HTMLElement,
    readonly id: string,
    private transitionDef: React.ReactNode,
    private delegate: AnimationDelegate,
    private transitioning = outgoing.cloneNode() as HTMLElement,
    private outgoingStyle = getPermittedCssStyles(getComputedStyle(outgoing)),
    private outgoingBounds = outgoing.getBoundingClientRect()
  ) { }

  get active() {
    return Boolean(this.progress)
  }
  
  prepareStart() {
    // Avoid flickering by immediately adding the transition node to the dom
    // before determining whether the transition should take place
    this.delegate.getContextElement().appendChild(this.transitioning)
  }

  abortStart() {
    this.transitioning.remove()
  }

  start() {
    const context = this.delegate.getContextElement()
    const finalParent = document.createElement('div')
    const transitioning = this.transitioning
  
    finalParent.style.opacity = "0"
    context.appendChild(finalParent)

    render(React.Children.only(this.transitionDef), finalParent, () => {
      const final = finalParent.children[0] as HTMLElement
  
      this.progress = createSpringAnimation().transition({
        contextBounds: context.getBoundingClientRect(),
        startBounds: this.outgoingBounds,
        endBounds: final.getBoundingClientRect(),
        element: transitioning,
        startProps: this.outgoingStyle,
        endProps: getPermittedCssStyles(getComputedStyle(final)),
        onCompleted: () => {
          transitioning.remove()
          this.delegate.animationDidComplete(this)
        }
      })
  
      transitioning.style.position = 'absolute'
      transitioning.style.top = "0px"
      transitioning.style.left = "0px"

      unmountComponentAtNode(finalParent)
    })
  }

  stop() {
    if (this.progress) {
      this.progress.stop()
    }
  }
}
