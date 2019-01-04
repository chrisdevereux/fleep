import { TransitionContext } from "./TransitionContext";
import React from "react";

export interface FluidTransitionElementProps {
  id: string
  children: React.ReactElement<{}>
}

export class FluidTransitionElement extends React.Component<FluidTransitionElementProps> {
  context!: TransitionContext | undefined
  childRef = React.createRef()

  private get element(): HTMLElement {
    if (this.childRef.current instanceof HTMLElement) {
      return this.childRef.current
    }

    throw Error('FluidTransition must have a single html element as its child')
  }

  private get manager() {
    if (!this.context) {
      throw Error('FluidTransition used without its parent context')
    }

    return this.context.fluidManager
  }

  componentDidMount() {
    this.manager.setIncomingElementForId(this.element, this.props.id)
  }

  componentWillUnmount() {
    this.manager.setOutgoingElementForId(this.element, this.props.id)
  }

  render() {
    const child = React.Children.only(this.props.children)

    return React.cloneElement(
      child,
      {
        ref: this.childRef,
        key: this.props.id,
        style: {
          ...child.props.style,
          backgroundColor: 'blue'
        }
      }
    )
  }
}

