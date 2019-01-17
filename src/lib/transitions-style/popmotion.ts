import { styler, value, spring } from "popmotion";
import { TransitionStyle } from "./TransitionStyle";

export function createSpringAnimation(): TransitionStyle {
  return {
    transition({ element, startBounds, endBounds, contextBounds, startProps, endProps, onCompleted }) {
      const from = {
        x: startBounds.left - contextBounds.left,
        y: startBounds.top - contextBounds.top,
        width: startBounds.width,
        height: startBounds.height,
        ...startProps
      }

      const to: any = {
        x: endBounds.left - contextBounds.left,
        y: endBounds.top - contextBounds.top,
        width: endBounds.width,
        height: endBounds.height,
        ...endProps
      }

      const transitionStyler = styler(element)
      const transitionVal = value(from as any, transitionStyler.set)
      const action = spring({
        from: transitionVal.get(),
        to,
        stiffness: 200
      })
      
      const subscription = action.start({
        update: transitionVal.update.bind(transitionVal),
        complete: () => {
          transitionVal.complete()
          onCompleted()
        },
        error: err => {
          transitionVal.error(err)
          onCompleted(err)
        }
      })
      
      return {
        stop() {
          subscription.stop()
          transitionVal.complete()
          onCompleted()
        }
      }
    }
  }
}
