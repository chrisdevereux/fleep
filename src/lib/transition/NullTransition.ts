import { Transition } from "./Transition";

export function nullTransition(): Transition {
  return {
    start({ onCompleted }) {
      onCompleted()

      return {
        stop() {
          onCompleted()
        }
      }
    }
  }
}
