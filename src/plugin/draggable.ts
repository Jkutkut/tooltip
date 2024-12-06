import type {InitialPosition} from "./types";

const makeDraggable = (
  element: HTMLElement,
  onDragEnd?: (e: MouseEvent) => void,
  xAxis: "right" | "left" = "right",
  yAxis: "top" | "bottom" = "top",
) => {
  let offsetMouseObjX: number = 0;
  let offsetMouseObjY: number = 0;
  let x: number, y: number;

  const dragMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    document.onmouseup = closeDragElement;
    document.onmousemove = dragElement;
    offsetMouseObjX = e.clientX - element.offsetLeft;
    offsetMouseObjY = e.clientY - element.offsetTop;
  };

  const dragElement = (e: MouseEvent) => {
    e.preventDefault();
    x = e.clientX - offsetMouseObjX;
    y = e.clientY - offsetMouseObjY;
    element.style[xAxis] = x + "px";
    element.style[yAxis] = y + "px";
  };

  const closeDragElement = (e: MouseEvent) => {
    x = Math.max(0, element.offsetLeft);
    y = Math.max(0, element.offsetTop);
    x -= Math.max(element.offsetLeft + element.offsetWidth - window.innerWidth, 0);
    y -= Math.max(element.offsetTop + element.offsetHeight - window.innerHeight, 0);
    element.style[xAxis] = x + "px";
    element.style[yAxis] = y + "px";

    document.onmouseup = null;
    document.onmousemove = null;
    onDragEnd && onDragEnd(e);
  };

  const dragHandle = element.querySelector('.drag-handle') as HTMLElement;
  if (dragHandle) {
      dragHandle.onmousedown = dragMouseDown;
  }
  else {
      element.onmousedown = dragMouseDown;
  }
};

const makePersistentDraggable = (
  element: HTMLElement,
  {
    x: initialX = 50,
    y: initialY = 50,
    xAxis = "right",
    yAxis = "top",
  }: InitialPosition = {
    x: 50,
    y: 50,
    xAxis: "left",
    yAxis: "top",
  }
) => {
  const elementIdKey = `${element.id}-drag-persistent`;
  element.style.position = "absolute";
  const stored = localStorage.getItem(elementIdKey);
  if (stored) {
    const { x, y } = JSON.parse(stored);
    element.style[xAxis] = x;
    element.style[yAxis] = y;
  }
  else {
    element.style[yAxis] = initialY + "px";
    element.style[xAxis] = initialX + "px";
  }
  makeDraggable(
    element,
    () => {
      localStorage.setItem(
        elementIdKey,
        JSON.stringify({
          x: element.style[xAxis],
          y: element.style[yAxis],
        })
      );
    },
    xAxis, yAxis
  );
};

export { makeDraggable, makePersistentDraggable };
