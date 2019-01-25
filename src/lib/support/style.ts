type StyleKey = keyof CSSStyleDeclaration
export type StyleMap = Partial<Record<StyleKey, string>>

const permittedStyleKeys: StyleKey[] = [
  'borderRadius',
  'opacity',
  'backgroundColor',
]

export function getPermittedCssStyles(styles: CSSStyleDeclaration) {
  const object: StyleMap = {}

  permittedStyleKeys.forEach(key => {
    object[key as any] = styles[key]
  })

  return object
}
