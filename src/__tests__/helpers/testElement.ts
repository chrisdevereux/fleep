import { DOMViewNode } from "../../lib/platform/web/WebNode";

export function createTestElement() {
  const el = document.createElement('div')
  el.style.position = 'absolute'
  el.style.left = '0px'
  el.style.top = '0px'

  document.body.appendChild(el)

  return new DOMViewNode(el, document.body)
}
