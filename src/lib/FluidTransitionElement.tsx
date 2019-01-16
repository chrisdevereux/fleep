import { FluidManagerContext } from "./TransitionContext";
import React from "react";
import { TransitionableComponent } from "./FluidTransitionManager";

export interface FluidTransitionElementProps {
  id: string
  children: React.ReactNode
}

type FluidChild = React.ReactElement<React.Props<{}>>

export class FluidTransitionComponent extends React.Component<FluidTransitionElementProps> implements TransitionableComponent {
  static In: React.SFC = (props) => props.children || null as any
  static Out: React.SFC = (props) => props.children || null as any

  private static isMainElement(x: React.ReactNode): x is FluidChild {
    return React.isValidElement(x) && x.type !== FluidTransitionComponent.In && x.type !== FluidTransitionComponent.Out
  }
  
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

  get transitionIn() {
    return this.children.find(x => React.isValidElement(x) && x.type === FluidTransitionComponent.In) as FluidChild
  }

  get transitionOut() {
    const config = this.children.find(x => React.isValidElement(x) && x.type === FluidTransitionComponent.Out) as FluidChild
    return config && config.props.children
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
    const child = this.children.find(FluidTransitionComponent.isMainElement)
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
    return React.cloneElement(
      this.mainChild,
      {
        ref: this.childRef,
      }
    )
  }
}
