import React from 'react'
import should from 'should'
import { TransitionOut } from '../lib/components/TransitionConfig'
import { getScreenRect } from '../lib/support/geometry'
import { Widget, widgetSize } from './helpers/components'
import { IntegrationTestFixture } from './helpers/IntegrationTestFixture'
import { spyTransition } from './helpers/TransitionSpy'
import './setup'

describe('animation out', () => {
  it('should keep dom element in place after unmounting', async () => {
    const fixture = new IntegrationTestFixture()

    fixture
      .render(
        <fixture.transition id="thing">
          <TransitionOut>
            <Widget x={0} y={0} opacity={0} />
          </TransitionOut>

          <Widget id="widget" x={0} y={0} opacity={1} />
        </fixture.transition>,
      )
      .unmount()

    should(document.getElementById('widget')).not.be.undefined()
  })

  it('should not animate out when unmounted with context', async () => {
    const fixture = new IntegrationTestFixture()
    const spy = spyTransition()

    fixture
      .render(
        <fixture.transition id="thing">
          <TransitionOut using={spy}>
            <Widget x={0} y={0} opacity={0} />
          </TransitionOut>

          <Widget x={0} y={0} opacity={1} />
        </fixture.transition>,
      )
      .unmount()

    await Promise.resolve()

    should(await spy.started()).be.false()
  })

  it('should animate out when unmounted from context', async () => {
    const fixture = new IntegrationTestFixture()
    const spy = spyTransition()

    fixture
      .render(
        <fixture.transition id="thing">
          <TransitionOut using={spy}>
            <Widget x={0} y={0} opacity={0} />
          </TransitionOut>

          <Widget x={10} y={10} opacity={1} />
        </fixture.transition>,
      )
      .render(null)

    await Promise.resolve()

    should(await spy.started()).be.true()

    should(spy.relativeStartBounds).match({ x: 10, y: 10, ...widgetSize })
    should(spy.relativeEndBounds).match({ x: 0, y: 0, ...widgetSize })

    should(spy.startProps).match({ opacity: '1' })
    should(spy.endProps).match({ opacity: '0' })

    should(getScreenRect(spy.element!)).match(spy.startBounds!)
    should(spy.element!.parentElement).should.not.be.undefined()
  })
})
