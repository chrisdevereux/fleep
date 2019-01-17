import { styler, value, spring, ColdSubscription } from "popmotion";
import { TransitionType, TransitionTypeDelegate } from "./TransitionType";
import { StyleMap, getPermittedCssStyles } from "../style";
import { createSpringAnimation } from "../transitions-style/popmotion";
import { TransitionStyle } from "../transitions-style/TransitionStyle";

export class TransitionTo implements TransitionType {
  private outgoingBounds: ClientRect
  private outgoingStyles: StyleMap
  private progress?: TransitionStyle.Progress

  constructor(
    private outgoingElement: HTMLElement,
    private id: string,
    private delegate: TransitionTypeDelegate,
  ) {
    this.outgoingBounds = outgoingElement.getBoundingClientRect()
    this.outgoingStyles = getPermittedCssStyles(getComputedStyle(outgoingElement))
  }
  
  get active() {
    return Boolean(this.progress)
  }

  stop() {
    if (this.progress) {
      this.progress.stop()
    }
  }

  transitionToElement(incoming: HTMLElement) {
    const context = this.delegate.getContextElement()
    const outgoing = this.outgoingElement
    const transitioning = outgoing.cloneNode() as HTMLElement

    this.progress = createSpringAnimation().transition({
      contextBounds: context.getBoundingClientRect(),
      startBounds: this.outgoingBounds,
      endBounds: incoming.getBoundingClientRect(),
      element: transitioning,
      startProps: this.outgoingStyles,
      endProps: getPermittedCssStyles(getComputedStyle(incoming)),
      onCompleted: () => {
        incoming.style.opacity = null;
        transitioning.remove()
        this.delegate.animationDidComplete(this.id)
      }
    })

    incoming.style.opacity = '0';
    transitioning.style.position = 'absolute'
    transitioning.style.top = "0px"
    transitioning.style.left = "0px"

    context.appendChild(transitioning)
  }
}
