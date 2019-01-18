import { styler, value, spring } from "popmotion";
import { Transition } from "./Transition";

interface SpringAnimationConfig {
  stiffness: number
  damping: number
  mass: number
  velocity: number
  restDelta: number
  restSpeed: number
}

export function springTransition(config: Partial<SpringAnimationConfig> = {}): Transition {
  return {
    start({ element, startBounds, endBounds, contextBounds, startProps, endProps, onCompleted }) {
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

      const transitioner = styler(element)
      const transitionVal = value(from as any, transitioner.set)
      const action = spring({
        from: transitionVal.get(),
        to,
        ...config
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
