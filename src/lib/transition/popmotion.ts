import { spring, styler, value } from 'popmotion'
import { localRectFromScreenRect } from '../support/geometry'
import { Transition } from './Transition'

interface SpringAnimationConfig {
  stiffness: number
  damping: number
  mass: number
  velocity: number
  restDelta: number
  restSpeed: number
}

export function springTransition(
  config: Partial<SpringAnimationConfig> = {},
): Transition {
  return {
    start({
      element,
      startBounds,
      endBounds,
      contextBounds,
      startProps,
      endProps,
      onCompleted,
    }) {
      const from = {
        ...localRectFromScreenRect(startBounds, contextBounds),
        ...startProps,
      }

      const to: any = {
        ...localRectFromScreenRect(endBounds, contextBounds),
        ...endProps,
      }

      const transitioner = styler(element)
      const transitionVal = value(from as any, transitioner.set)
      const action = spring({
        from: transitionVal.get(),
        to,
        ...config,
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
        },
      })

      return {
        stop() {
          subscription.stop()
          transitionVal.complete()
          onCompleted()
        },
      }
    },
  }
}
