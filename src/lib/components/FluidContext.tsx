import React from "react";
import { AnimationManager, AnimationManagerDelegate } from "../AnimationManager";
import { FluidWrapper } from "./FluidWrapper";

interface TransitionComponents {
  Transition: typeof FluidWrapper 
  TransitionContext: React.ComponentType
}

export interface FluidManagerContext {
  fluidManager: AnimationManager
}

export function createTransitionContext(): TransitionComponents {
  const context = React.createContext<FluidManagerContext | undefined>(undefined)

  class FluidTransitionContext extends React.Component implements FluidManagerContext, AnimationManagerDelegate {
    private ref = React.createRef<HTMLDivElement>()

    fluidManager = new AnimationManager(this)

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

  class FluidTransitionContextElement extends FluidWrapper {
    static contextType = context
  }

  return {
    Transition: FluidTransitionContextElement,
    TransitionContext: FluidTransitionContext
  }
}
