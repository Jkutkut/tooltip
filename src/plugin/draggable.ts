import { InitialPosition } from "./types";

const makeDraggable = (
  element: HTMLElement,
  onDragEnd?: (e: MouseEvent) => void,
  xAxis: "right" | "left" = "right",
  yAxis: "top" | "bottom" = "top",
) => {
  let prevX = 0, prevY = 0;
  let deltaX, deltaY, x, y;

  const dragMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    prevX = e.clientX;
    prevY = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = dragElement;
  };

  const dragElement = (e: MouseEvent) => {
    e.preventDefault();

    deltaX = prevX - e.clientX;
    deltaY = prevY - e.clientY;
    if (xAxis === "left") {
      x = element.offsetLeft - deltaX;
    } else {
      x = (window.innerWidth - element.offsetLeft - element.offsetWidth) + deltaX;
    }
    if (yAxis === "top") {
      y = element.offsetTop - deltaY;
    } else {
      y = (window.innerHeight - element.offsetTop - element.offsetHeight) + deltaY;
    }

    const validX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, x));
    const validY = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, y));

    if (validX === x) {
      prevX = e.clientX;
    }
    if (validY === y) {
      prevY = e.clientY;
    }

    element.style[xAxis] = x + "px";
    element.style[yAxis] = y + "px";
  };

  const closeDragElement = (e: MouseEvent) => {
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
      console.log("drag end", element.style[xAxis], element.style[yAxis]);
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
