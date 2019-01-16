import { TransitionType, TransitionTypeDelegate } from "./TransitionType";
import { render, unmountComponentAtNode } from "react-dom";
import React from "react";
import { TransitionTo } from "./TransitionTo";
import { TransitionStyle } from "../transitions-style/TransitionStyle";
import { createSpringAnimation } from "../transitions-style/popmotion";
import { getPermittedCssStyles } from "../style";

export class TransitionIn implements TransitionType {
  private progress?: TransitionStyle.Progress
  
  constructor(
    private incomingElement: HTMLElement,
    private id: string,
    private transitionDef: React.ReactNode,
    private delegate: TransitionTypeDelegate
  ) { }

  get active() {
    return Boolean(this.progress)
  }

  start() {
    const context = this.delegate.getContextElement()
    const transitioningParent = document.createElement('div')
    const incoming = this.incomingElement
  
    context.appendChild(transitioningParent)

    render(React.Children.only(this.transitionDef), transitioningParent, () => {
      const transitioning = transitioningParent.children[0] as HTMLElement
  
      this.progress = createSpringAnimation().transition({
        contextBounds: context.getBoundingClientRect(),
        startBounds: transitioning.getBoundingClientRect(),
        endBounds: incoming.getBoundingClientRect(),
        element: transitioning,
        startProps: getPermittedCssStyles(getComputedStyle(transitioning)),
        endProps: getPermittedCssStyles(getComputedStyle(incoming)),
        onCompleted: () => {
          incoming.style.opacity = '1';
          unmountComponentAtNode(transitioningParent)

          this.delegate.animationDidComplete(this.id)
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
