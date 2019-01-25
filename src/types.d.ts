declare module 'react-keyframes' {
  import React from 'react'

  export const Keyframes: React.ComponentType<{ loop?: number | true }>
  export const Frame: React.ComponentType<{ duration: number }>
}
