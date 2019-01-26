import { spring, styler, value } from 'popmotion'
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
): Transition<HTMLElement, CSSStyleDeclaration> {
  return {
    start({
      element,
      startBounds,
      endBounds,
      startProps,
      endProps,
      onCompleted,
    }) {
      const from = {
        ...startBounds,
        ...startProps,
      }

      const to = {
        ...endBounds,
        ...endProps,
      }

      const transitioner = styler(element.nativeElement)
      const transitionVal = value(from, transitioner.set)
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
