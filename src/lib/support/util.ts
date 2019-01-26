import React from 'react'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type Constructor<T = object> = new (...args: any[]) => T
export type Dict<T> = Partial<Record<string, T>>

export function isInstanceOf<T>(constructor: Constructor<T>) {
  return (x: unknown): x is T => x instanceof constructor
}

export function asInstanceOf<T>(constructor: Constructor<T>) {
  return (x: unknown): T => {
    if (x instanceof constructor) {
      return x
    }

    throw Error(`Expected ${constructor.name}`)
  }
}

export function isElementOfType<Props>(
  constructor: Constructor<React.Component<Props>>,
) {
  return (x: React.ReactNode): x is React.ReactElement<Props> => {
    return React.isValidElement(x) && isSubclassOf(constructor)(x.type)
  }
}

export function isElementNotOfType(constructor: Constructor<React.Component>) {
  return (x: React.ReactNode): x is React.ReactElement<React.Props<{}>> => {
    return React.isValidElement(x) && !isSubclassOf(constructor)(x.type)
  }
}

export function isSubclassOf<T>(superclass: Constructor<T>) {
  return (x: any) => x === superclass || x.prototype instanceof superclass
}
