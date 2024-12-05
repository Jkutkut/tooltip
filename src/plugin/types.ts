type TooltipHtmlElement = HTMLElement & {
  hide?: () => void
};

type InitialPosition = {
  x?: number,
  y?: number,
  xAxis?: "left" | "right",
  yAxis?: "top" | "bottom",
};

export type { TooltipHtmlElement, InitialPosition };
