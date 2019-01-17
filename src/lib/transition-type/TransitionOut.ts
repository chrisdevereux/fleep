import { TransitionType, TransitionTypeDelegate } from "./TransitionType";
import { render, unmountComponentAtNode } from "react-dom";
import React from "react";
import { TransitionTo } from "./TransitionTo";
import { TransitionStyle } from "../transitions-style/TransitionStyle";
import { createSpringAnimation } from "../transitions-style/popmotion";
import { getPermittedCssStyles } from "../style";

export class TransitionOut implements TransitionType {
  private progress?: TransitionStyle.Progress
  
  constructor(
    outgoing: HTMLElement,
    private id: string,
    private transitionDef: React.ReactNode,
    private delegate: TransitionTypeDelegate,
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
          this.delegate.animationDidComplete(this.id)
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
