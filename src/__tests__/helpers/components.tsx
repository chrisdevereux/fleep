import React from "react";

interface WidgetProps {
  id?: string
  x: number
  y: number
  opacity?: number
}

export const Widget = React.forwardRef((props: WidgetProps, ref: React.Ref<any>) => (
  <div id={props.id} ref={ref} style={{ ...widgetSize, position: 'absolute', left: props.x, top: props.y, opacity: props.opacity }} />
))

export const widgetSize = { width: 1, height: 1 }