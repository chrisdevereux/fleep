import { Transition } from '../..'
import { Rect } from '../../lib/support/geometry'
import { TransitionParams } from '../../lib/transition/Transition'

interface TransitionSpy extends Transition, Partial<TransitionParams> {
  started: (timeout?: number) => Promise<boolean>
  relativeStartBounds: Rect
  relativeEndBounds: Rect
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

    started: (timeout = 20) =>
      new Promise<boolean>((resolve, reject) => {
        setTimeout(() => resolve(false), timeout)
        started.then(() => resolve(true), reject)
      }),

    get relativeStartBounds(): Rect {
      return {
        x: this.startBounds!.x - this.contextBounds!.x,
        y: this.startBounds!.y - this.contextBounds!.y,
        width: this.startBounds!.width,
        height: this.startBounds!.height,
      }
    },

    get relativeEndBounds(): Rect {
      return {
        x: this.endBounds!.x - this.contextBounds!.x,
        y: this.endBounds!.y - this.contextBounds!.y,
        width: this.endBounds!.width,
        height: this.endBounds!.height,
      }
    },
  }
}
