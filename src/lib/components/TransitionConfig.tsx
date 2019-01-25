import React from 'react'
import { Transition } from '../transition/Transition'

export interface TransitionConfigProps extends React.Props<{}> {
  using?: Transition
}

export class TransitionConfig extends React.Component<TransitionConfigProps> {
  render() {
    return this.props.children
  }
}

export class TransitionIn extends TransitionConfig {}
export class TransitionOut extends TransitionConfig {}
export class TransitionFrom extends TransitionConfig {}
