import React from 'react'
import { render } from 'react-dom'
import {
  AnimationManager,
  AnimationManagerDelegate,
} from '../../AnimationManager'
import { FluidWrapper } from '../../components/FluidWrapper'
import { asInstanceOf } from '../../support/util'
import { Platform, PlatformRenderOpts, ViewNode } from '../Platform'
import { DOMViewNode } from './WebNode'

const asHtmlElement = asInstanceOf(HTMLElement)
const wrapperStyle: React.CSSProperties = { position: 'relative' }

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

  class WebTransitionContext extends React.Component
    implements FluidManagerContext, AnimationManagerDelegate, Platform {
    contextMounted = false

    fluidManager = new AnimationManager(this)
    private ref = React.createRef<HTMLDivElement>()

    get contextElement() {
      if (!this.ref.current) {
        throw Error('Fluid manager used while not mounted')
      }

      return this.ref.current
    }

    componentDidMount() {
      this.contextMounted = true
    }

    componentWillUnmount() {
      this.contextMounted = false
    }

    adoptElement(el: unknown) {
      return new DOMViewNode(asInstanceOf(HTMLElement)(el), this.contextElement)
    }

    async renderElement(
      root: React.ReactElement<{}>,
      { offscreen = false }: PlatformRenderOpts = {},
    ) {
      return new Promise<ViewNode>(resolve => {
        const parentElement = document.createElement('div')

        render(root, parentElement, () => {
          const el = asHtmlElement(parentElement.children[0])
          el.style.position = 'absolute'

          const node = new DOMViewNode(el, this.contextElement)
          node.setHidden(offscreen)

          parentElement.appendChild(el)

          resolve(node)
        })
      })
    }

    render() {
      return (
        <context.Provider value={this}>
          <div ref={this.ref} style={wrapperStyle}>
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
    TransitionContext: WebTransitionContext,
  }
}
