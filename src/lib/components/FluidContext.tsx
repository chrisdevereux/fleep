import React from 'react'
import { AnimationManager, AnimationManagerDelegate } from '../AnimationManager'
import { FluidWrapper } from './FluidWrapper'

export interface TransitionComponents {
  Transition: typeof FluidWrapper
  TransitionContext: React.ComponentType
}

export interface FluidManagerContext {
  fluidManager: AnimationManager
}

export function createTransitionContext(): TransitionComponents {
  const context = React.createContext<FluidManagerContext | undefined>(
    undefined,
  )

  class FluidTransitionContext extends React.Component
    implements FluidManagerContext, AnimationManagerDelegate {
    fluidManager = new AnimationManager(this)
    contextMounted = false
    private ref = React.createRef<HTMLDivElement>()

    getContextElement(): HTMLElement {
      if (!this.ref.current) {
        throw Error('Transition context not mounted')
      }

      return this.ref.current
    }

    componentDidMount() {
      this.contextMounted = true
    }

    componentWillUnmount() {
      this.contextMounted = false
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
    TransitionContext: FluidTransitionContext,
  }
}
