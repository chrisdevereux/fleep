import React from 'react';

import { storiesOf } from '@storybook/react';
import { createTransitionContext } from '../src';
import { Keyframes, Frame } from 'react-keyframes';

const { Transition, TransitionContext } = createTransitionContext()

const Block = React.forwardRef((props: { index: number }, ref: React.Ref<HTMLDivElement>) => (
  <div
    ref={ref}
    style={{
      position: 'absolute',
      top: 0,
      width: 100,
      height: 100,
      borderRadius: 50,
      left: 100 * props.index,
      backgroundColor: 'tomato'
    }}
  />
))

storiesOf('fluid transitions', module)
  .add('flip flop', () =>
    <TransitionContext>
      <Keyframes loop>
        <Frame key={1} duration={2_000}>
          <Transition id="1">
            <Block index={0} />
          </Transition>
        </Frame>
        <Frame key={2} duration={2_000}>
          <Transition id="1">
            <Block index={1} />
          </Transition>
        </Frame>
      </Keyframes>
    </TransitionContext>
  )