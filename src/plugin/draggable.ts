import type {InitialPosition} from "./types";

const makeDraggable = (
  element: HTMLElement,
  onDragEnd?: (e: MouseEvent) => void,
  onDragEndMobile?: (e: TouchEvent) => void,
) => {
  let offsetMouseObjX: number = 0;
  let offsetMouseObjY: number = 0;
  let x: number, y: number;

  const handleDragMouseDown = (startX: number, startY: number) => {
    offsetMouseObjX = startX - element.offsetLeft;
    offsetMouseObjY = startY - element.offsetTop;
  };

  const handleDragElement = (eventX: number, eventY: number) => {
    x = eventX - offsetMouseObjX;
    y = eventY - offsetMouseObjY;
    element.style["left"] = x + "px";
    element.style["top"] = y + "px";
  };

  const handleCloseDragElement = () => {
    x = Math.max(0, element.offsetLeft);
    y = Math.max(0, element.offsetTop);
    x -= Math.max(element.offsetLeft + element.offsetWidth - window.innerWidth, 0);
    y -= Math.max(element.offsetTop + element.offsetHeight - window.innerHeight, 0);
    element.style["left"] = x + "px";
    element.style["top"] = y + "px";
  };

  const dragMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    document.onmouseup = closeDragElement;
    document.onmousemove = dragElement;
    handleDragMouseDown(e.clientX, e.clientY);
  };
  const dragMouseDownTouch = (e: TouchEvent) => {
    document.ontouchend = closeDragElementTouch;
    document.ontouchmove = dragElementTouch;
    handleDragMouseDown(e.touches[0].clientX, e.touches[0].clientY);
  };
  const dragElement = (e: MouseEvent) => {
    e.preventDefault();
    handleDragElement(e.clientX, e.clientY);
  };
  const dragElementTouch = (e: TouchEvent) => {
    handleDragElement(e.touches[0].clientX, e.touches[0].clientY);
  };
  const closeDragElement = (e: MouseEvent) => {
    handleCloseDragElement();
    document.onmouseup = null;
    document.onmousemove = null;
    onDragEnd && onDragEnd(e);
  };
  const closeDragElementTouch = (e: TouchEvent) => {
    handleCloseDragElement();
    document.ontouchend = null;
    document.ontouchmove = null;
    onDragEndMobile && onDragEndMobile(e);
  };

  const dragHandle = element.querySelector('.drag-handle') as HTMLElement;
  if (dragHandle) {
      dragHandle.onmousedown = dragMouseDown;
      dragHandle.addEventListener('touchstart', dragMouseDownTouch, { passive: true });
  }
  else {
      element.onmousedown = dragMouseDown;
      element.addEventListener('touchstart', dragMouseDownTouch, { passive: true });
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
    element.style["left"] = x;
    element.style["top"] = y;
  }
  else {
    const bBox = element.getBoundingClientRect();
    const startX = xAxis === "left" ? initialX : window.innerWidth - initialX - bBox.width;
    const startY = yAxis === "top" ? initialY : window.innerHeight - initialY - bBox.height;
    element.style["left"] = startX + "px";
    element.style["top"] = startY + "px";
  }
  const savePosition = () => {
    if (element.style["display"] === "none") {
      return;
    }
    localStorage.setItem(
      elementIdKey,
      JSON.stringify({
        x: element.style["left"],
        y: element.style["top"],
      })
    );
  };
  makeDraggable(
    element,
    savePosition, savePosition,
  );
};

export { makeDraggable, makePersistentDraggable };
