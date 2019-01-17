export function debug(...args: any[]) {
  console.log(...args)
}

type Constructor<T = object> = new (...args: any[]) => T 

export function isInstanceOf<T>(constructor: Constructor<T>) {
  return (x: unknown): x is T => x instanceof constructor
}
