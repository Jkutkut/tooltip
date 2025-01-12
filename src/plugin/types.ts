type TooltipHtmlElement = HTMLElement & {
  hide: () => void,
  show: () => void,
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

export type { TooltipHtmlElement, InitialPosition, ScalableDraggableOptions };
