import React from 'react';

import { storiesOf } from '@storybook/react';
import { createTransitonScope } from '../src';
import { Keyframes, Frame } from 'react-keyframes';

const Transition = createTransitonScope()

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
    <Transition>
      <Keyframes loop>
        <Frame key={1} duration={2_000}>
          <Transition.Fluid>
            <Block index={0} />
          </Transition.Fluid>
        </Frame>
        <Frame key={2} duration={2_000}>
          <Transition.Fluid>
            <Block index={1} />
          </Transition.Fluid>
        </Frame>
      </Keyframes>
    </Transition>
  )