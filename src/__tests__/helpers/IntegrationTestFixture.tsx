import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { createTransitionContext } from '../..'
import { Rect } from '../../lib/support/geometry';

const context = createTransitionContext()

export class IntegrationTestFixture {
  enzyme!: ReactWrapper
  transition = context.Transition

  bounds({ x, y, width, height }: Rect) {
    return {
      x: x + 100,
      y: y + 100,
      width,
      height
    }
  }

  render(node: React.ReactNode) {
    if (!this.enzyme) {
      const root = document.createElement('div')
      root.style.left = '100px'
      root.style.top = '100px'
      root.style.position = 'absolute'
      document.body.append(root)

      this.enzyme = mount(<IntegrationWrapper>{node}</IntegrationWrapper>, {
        attachTo: root,
      })
    } else {
      this.enzyme.instance().setState({ children: node })
      this.enzyme.update()
    }

    return this
  }

  unmount() {
    this.enzyme.instance().setState({ children: UNMOUNT })
    this.enzyme.update()
  }
}

const UNMOUNT = Symbol('UNMOUNT')

class IntegrationWrapper extends React.Component<
  {},
  { children: React.ReactNode | typeof UNMOUNT }
> {
  state = { children: this.props.children }

  render() {
    if (this.state.children === UNMOUNT) {
      return null
    }

    return (
      <context.TransitionContext>
        {this.state.children}
      </context.TransitionContext>
    )
  }
}
