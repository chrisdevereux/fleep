import { Transition } from "./transition/Transition";

export interface TransitionDescriptor {
  transition: Transition
  target: React.ReactElement<{}>
}
