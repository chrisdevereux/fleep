import { Platform } from "../platform/Platform";

export interface Animation {
  readonly id: string
  readonly active: boolean
  stop(): void
}

export interface AnimationDelegate<PlatformT extends Platform = Platform> {
  readonly platform: PlatformT
  animationDidComplete(animation: Animation): void
}
