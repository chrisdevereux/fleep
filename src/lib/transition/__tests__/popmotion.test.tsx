import should from 'should'
import { createTestElement } from '../../../__tests__/helpers/testElement'
import { Omit } from '../../support/util'
import { springTransition } from '../popmotion'
import { Transition, TransitionParams } from '../Transition'

describe('popmotion transitions', () => {
  describe('spring', () => {
    it('should animamte element to destination', async () => {
      const element = createTestElement()

      await runTransition(springTransition(), {
        element,
        startBounds: { x: 0, y: 0, width: 1, height: 1 },
        endBounds: { x: 10, y: 10, width: 1, height: 1 },
        startProps: { opacity: '0' },
        endProps: { opacity: '1' },
      })

      should(element.bounds).match({
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      })

      should(element.style.opacity).equal('1')
    })
  })
})

function runTransition(
  transition: Transition,
  params: Omit<TransitionParams, 'onCompleted'>,
) {
  return new Promise<void>((resolve, reject) => {
    transition.start({
      ...params,
      onCompleted: error => (error ? reject(error) : resolve()),
    })
  })
}
