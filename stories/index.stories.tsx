import React from 'react';

import { storiesOf } from '@storybook/react';
import { createTransitionContext } from '../src';
import { Keyframes, Frame } from 'react-keyframes';

const { Transition, TransitionContext } = createTransitionContext()

const Block = React.forwardRef((props: React.CSSProperties, ref: React.Ref<HTMLDivElement>) => (
  <div
    ref={ref}
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      borderRadius: props.width || 100,
      backgroundColor: 'tomato',
      ...props
    }}
  />
))

storiesOf('fluid transitions', module)
  .add('flip flop', () =>
    <TransitionContext>
      <Keyframes loop>
        <Frame key={1} duration={3_000}>
          <Transition id="1">
            <Block />
          </Transition>
        </Frame>
        <Frame key={2} duration={3_000}>
          <Transition id="1">
            <Block left={100} />
          </Transition>
        </Frame>
      </Keyframes>
    </TransitionContext>
  )
  .add('enter - transition - exit', () =>
    <TransitionContext>
      <Keyframes loop>
        <Frame key={1} duration={1_500}>
          <span />
        </Frame>

        <Frame key={2} duration={1_500}>
          <Transition id="1">
            <Transition.In>
              <Block transform="scale(0)" />
            </Transition.In>

            <Block />
          </Transition>
        </Frame>
        
        <Frame key={3} duration={3_000}>
          <Transition id="1">
            <Transition.Out>
              <Block left={200} top={200} width={500} height={500} opacity={0} transform="scale(0.1)" />
            </Transition.Out>

            <Block left={200} top={200} width={500} height={500} />
          </Transition>
        </Frame>
      </Keyframes>
    </TransitionContext>
  )