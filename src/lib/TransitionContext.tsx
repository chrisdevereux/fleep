import React from "react";
import { spring, value, styler } from 'popmotion'
import { FluidTransitionManager, FluidTransitionManagerCallbacks } from "./FluidTransitionManager";
import { FluidTransitionElement, FluidTransitionElementProps } from "./FluidTransitionElement";

type TransitionScope = React.ComponentType & {
  Fluid: React.ComponentType<FluidTransitionElementProps>
}

export interface TransitionContext {
  fluidManager: FluidTransitionManager
}

export function createTransitionContext(): TransitionScope {
  const context = React.createContext<TransitionContext | undefined>(undefined)

  return class TransitionContext extends React.Component implements TransitionContext, FluidTransitionManagerCallbacks {
    static Fluid = class FluidTransition extends FluidTransitionElement {
      static contextType = context
    }

    private ref = React.createRef<HTMLDivElement>()

    fluidManager = new FluidTransitionManager(this)

    getContextElement(): HTMLElement {
      if (!this.ref.current) {
        throw Error('Transition context not mounted')
      }

      return this.ref.current
    }

    render() {
      return (
        <context.Provider value={this}>
          <div ref={this.ref} style={{ position: 'relative' }}>
            {this.props.children}
          </div>
        </context.Provider>
      )
    }
  }
}
