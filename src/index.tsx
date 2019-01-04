import React from "react";
import { spring, value, styler } from 'popmotion'

type TransitionScope = React.ComponentType & {
  Fluid: React.ComponentType<{ children: React.ReactElement<{}> }>
}

export function createTransitonScope(): TransitionScope {
  const context = React.createContext<TransitionContext | undefined>(undefined)

  class Transition extends React.Component<{ children: React.ReactElement<{}> }> {
    static contextType = context
    context!: TransitionContext
    childRef = React.createRef()

    element(): HTMLElement {
      if (this.childRef.current instanceof HTMLElement) {
        return this.childRef.current
      }

      throw Error('bad child')
    }

    componentDidMount() {
      this.context.transitionIn(this.element())
    }

    componentWillUnmount() {
      this.context.transitionOut(this.element())
    }

    render() {
      const child = React.Children.only(this.props.children)
      return React.cloneElement(child, { ref: this.childRef })
    }
  }

  class TransitionContext extends React.Component {
    static Fluid = Transition
    private outgoingElement?: HTMLElement
    private outgoingBounds?: DOMRect | ClientRect
    private positionRef = React.createRef<HTMLDivElement>()

    transitionIn(incoming: HTMLElement) {
      if (this.outgoingElement && this.positionRef.current) {
        const context = this.positionRef.current
        const outgoing = this.outgoingElement
        const transitioning = outgoing.cloneNode() as HTMLElement

        const startBounds = this.outgoingBounds!
        const targetBounds = incoming.getBoundingClientRect()
        const contextBounds = context.getBoundingClientRect()

        const from = {
          x: startBounds.left - contextBounds.left,
          y: startBounds.top - contextBounds.top
        }

        const to = {
          x: targetBounds.left - contextBounds.left,
          y: targetBounds.top - contextBounds.top
        }
        
        const transitionStyler = styler(transitioning)
        const transitionVal = value(from, transitionStyler.set)

        transitioning.style.position = 'absolute'
        transitioning.style.left = '0px'
        transitioning.style.top = '0px'
        context.appendChild(transitioning)

        const incomingParent = incoming.parentElement!

        spring({
          from: transitionVal.get(),
          to,
          stiffness: 50,
        }).start({
          update: transitionVal.update.bind(transitionVal),
          complete: () => {
            transitionVal.complete()
            transitioning.remove()
            incomingParent.appendChild(incoming)
          }
        })

        incoming.remove()
      }

      this.outgoingElement = undefined
    }

    transitionOut(el: HTMLElement) {
      this.outgoingElement = el
      this.outgoingBounds = el.getBoundingClientRect()
    }

    render() {
      return (
        <context.Provider value={this}>
          <div ref={this.positionRef} style={{ position: 'relative' }}>
            {this.props.children}
          </div>
        </context.Provider>
      )
    }
  }

  return TransitionContext
}
