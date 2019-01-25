import React from 'react'
import should from 'should'
import '../../test/setup'
import { TransitionIn } from '../lib/components/TransitionConfig'
import { getScreenRect } from '../lib/support/geometry'
import { Widget, widgetSize } from './helpers/components'
import { IntegrationTestFixture } from './helpers/IntegrationTestFixture'
import { spyTransition } from './helpers/TransitionSpy'

describe('animation in', () => {
  it('should not animate in when mounted with context', async () => {
    const fixture = new IntegrationTestFixture()
    const spy = spyTransition()

    fixture.render(
      <fixture.transition id="thing">
        <TransitionIn using={spy}>
          <Widget x={0} y={0} opacity={0} />
        </TransitionIn>

        <Widget x={0} y={0} opacity={1} />
      </fixture.transition>,
    )

    should(await spy.started()).be.false()
  })

  it('should animate in when mounted after context', async () => {
    const fixture = new IntegrationTestFixture()
    const spy = spyTransition()

    fixture.render(null).render(
      <fixture.transition id="thing">
        <TransitionIn using={spy}>
          <Widget x={0} y={0} opacity={0} />
        </TransitionIn>

        <Widget x={10} y={10} opacity={1} />
      </fixture.transition>,
    )

    should(await spy.started()).be.true()

    should(spy.relativeStartBounds).match({ x: 0, y: 0, ...widgetSize })
    should(spy.relativeEndBounds).match({ x: 10, y: 10, ...widgetSize })

    should(spy.startProps).match({ opacity: '0' })
    should(spy.endProps).match({ opacity: '1' })

    should(getScreenRect(spy.element!)).match(spy.startBounds!)
    should(spy.element!.parentElement).should.not.be.undefined()
  })
})
