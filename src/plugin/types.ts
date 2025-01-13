type TooltipHtmlElement = HTMLElement & {
  hide: () => void,
  show: () => void,
  flushPersitanceDraggablePosition: () => void,
};

type TooltipModalHtmlElement = TooltipHtmlElement & {
  flushPersitanceScalableDraggable: () => void,
};

type InitialPosition = {
  x?: number,
  y?: number,
  xAxis?: "left" | "right",
  yAxis?: "top" | "bottom",
};

type ScalableDraggableOptions = {
  w: number,
  h: number,
  onDragEnd?: (e: MouseEvent) => void,
};

export type { TooltipHtmlElement, TooltipModalHtmlElement, InitialPosition, ScalableDraggableOptions };
