import React from "react";
import { FluidTransitionManager, FluidTransitionManagerCallbacks } from "./FluidTransitionManager";
import { FluidTransitionComponent, FluidTransitionElementProps } from "./FluidTransitionElement";

interface TransitionComponents {
  Transition: typeof FluidTransitionComponent 
  TransitionContext: React.ComponentType
}

export interface FluidManagerContext {
  fluidManager: FluidTransitionManager
}

export function createTransitionContext(): TransitionComponents {
  const context = React.createContext<FluidManagerContext | undefined>(undefined)

  class FluidTransitionContext extends React.Component implements FluidManagerContext, FluidTransitionManagerCallbacks {
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

  class FluidTransitionContextElement extends FluidTransitionComponent {
    static contextType = context
  }

  return {
    Transition: FluidTransitionContextElement,
    TransitionContext: FluidTransitionContext
  }
}
