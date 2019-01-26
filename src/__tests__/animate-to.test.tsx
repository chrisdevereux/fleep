import React from 'react'
import should from 'should'
import { TransitionFrom } from '../lib/components/TransitionConfig'
import { Widget, widgetSize } from './helpers/components'
import { IntegrationTestFixture } from './helpers/IntegrationTestFixture'
import { spyTransition } from './helpers/TransitionSpy'

describe('animation from', () => {
  it('should keep dom element in place after unmounting', async () => {
    const fixture = new IntegrationTestFixture()

    fixture
      .render(
        <fixture.transition id="thing">
          <Widget id="widget" x={0} y={0} opacity={1} />
        </fixture.transition>,
      )
      .unmount()

    should(document.getElementById('widget')).not.be.undefined()
  })

  it('should animate to new position when new element with matching id mounted', async () => {
    const fixture = new IntegrationTestFixture()
    const spy = spyTransition()

    fixture
      .render(
        <fixture.transition key="1" id="thing">
          <TransitionFrom using={spy} />

          <Widget x={10} y={10} />
        </fixture.transition>,
      )
      .render(
        <fixture.transition key="2" id="thing">
          <TransitionFrom using={spy} />

          <Widget x={20} y={20} />
        </fixture.transition>,
      )

    should(await spy.started()).be.true()

    should(spy.startBounds).match({ x: 10, y: 10, ...widgetSize })
    should(spy.endBounds).match({ x: 20, y: 20, ...widgetSize })

    should(spy.startProps).match({ opacity: '1' })
    should(spy.endProps).match({ opacity: '1' })

    should(spy.element!.bounds).match(spy.startBounds!)
    should(spy.element!.mounted).be.true()
  })
})
