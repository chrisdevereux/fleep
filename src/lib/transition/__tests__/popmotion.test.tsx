import { springTransition } from "../popmotion";
import { Transition, TransitionParams } from "../Transition";
import { Omit } from "../../support/util";
import should from "should";
import { getScreenRect } from "../../support/geometry";
import { createTestElement } from "./helpers/testElement";

describe('popmotion transitions', () => {
  describe('spring', () => {
    it('should animamte element to destination', async () => {
      const element = createTestElement()

      await runTransition(springTransition(), {
        element,
        contextBounds: { x: 10, y: 10, width: 10, height: 10 },
        startBounds: { x: 0, y: 0, width: 1, height: 1 },
        endBounds: { x: 10, y: 10, width: 1, height: 1 },
        startProps: { opacity: '0' },
        endProps: { opacity: '1' }
      })

      should(getScreenRect(element)).match({
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      })

      should(getComputedStyle(element).opacity).equal('1')
    })
  })
})

function runTransition(transition: Transition, params: Omit<TransitionParams, 'onCompleted'>) {
  return new Promise<void>((resolve, reject) => {
    transition.start({
      ...params,
      onCompleted: error => error ? reject(error) : resolve()
    })
  })
}
