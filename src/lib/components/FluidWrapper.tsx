import React from 'react'
import { AnimatedComponent } from '../AnimationManager'
import { isElementNotOfType, isElementOfType } from '../support/util'
import { nullTransition } from '../transition/NullTransition'
import { TransitionDescriptor } from '../TransitionDescriptor'
import { FluidManagerContext } from './FluidContext'
import {
  TransitionConfig,
  TransitionFrom,
  TransitionIn,
  TransitionOut,
} from './TransitionConfig'

export interface FluidWrapperProps {
  id: string
  children: React.ReactNode
}

export class FluidWrapper extends React.Component<FluidWrapperProps>
  implements AnimatedComponent {
  context!: FluidManagerContext | undefined
  childRef = React.createRef()

  get id() {
    return this.props.id
  }

  get element(): HTMLElement {
    if (this.childRef.current instanceof HTMLElement) {
      return this.childRef.current
    }

    throw Error('FluidTransition must have a single html element as its child')
  }

  get transitionIn(): TransitionDescriptor | undefined {
    const config = this.children.find(isElementOfType(TransitionIn))

    return (
      config && {
        target: React.Children.only(
          config.props.children,
        ) as React.ReactElement<{}>,
        transition: config.props.using || nullTransition(),
      }
    )
  }

  get transitionOut() {
    const config = this.children.find(isElementOfType(TransitionOut))

    return (
      config && {
        target: React.Children.only(
          config.props.children,
        ) as React.ReactElement<{}>,
        transition: config.props.using || nullTransition(),
      }
    )
  }

  get transitionFrom() {
    const config = this.children.find(isElementOfType(TransitionFrom))

    return {
      target: this.mainChild,
      transition: (config && config.props.using) || nullTransition(),
    }
  }

  private get manager() {
    if (!this.context) {
      throw Error('FluidTransition used without its parent context')
    }

    return this.context.fluidManager
  }

  private get children() {
    return React.Children.toArray(this.props.children)
  }

  private get mainChild() {
    const child = this.children.find(isElementNotOfType(TransitionConfig))
    if (!child) {
      throw Error('Transition must contain a valid element')
    }

    return child
  }

  componentDidMount() {
    this.manager.componentDidMount(this)
  }

  componentWillUnmount() {
    this.manager.componentWillUnmount(this)
  }

  render() {
    return React.cloneElement(this.mainChild, {
      ref: this.childRef,
    })
  }
}
