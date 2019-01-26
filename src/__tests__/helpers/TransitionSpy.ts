import { Transition } from '../..'
import { TransitionParams } from '../../lib/transition/Transition'

interface TransitionSpy extends Transition, Partial<TransitionParams> {
  started: (timeout?: number) => Promise<boolean>
}

export function spyTransition(): TransitionSpy {
  let onStarted: any
  const started = new Promise<void>(resolve => (onStarted = resolve))

  return {
    start({ onCompleted, ...props }) {
      onStarted()
      Object.assign(this, props)

      return {
        stop() {
          return
        },
      }
    },

    started: (timeout = 20) => new Promise<boolean>((resolve, reject) => {
      setTimeout(() => resolve(false), timeout)
      started.then(() => resolve(true), reject)
    }),
  }
}
