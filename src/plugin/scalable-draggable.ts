import {newDOMElement} from "@/plugin/utils";
import type {ScalableDraggableOptions} from "./types";

const DEF_WIDTH = 200;
const DEF_HEIGHT = 250;
const OFFSET = 20;

const scalableDraggableContainer = (
  children: HTMLElement | HTMLElement[],
  initialWidth: number = DEF_WIDTH,
  initialHeight: number = DEF_HEIGHT
) => {
  const container = newDOMElement("div", ["drag-scalable"]);
  const horizontal = newDOMElement("div", ["drag-scalable-horizontal"]);
  container.appendChild(horizontal);

  {
    const content = newDOMElement("div", ["drag-scalable-content"]);
    if (Array.isArray(children)) {
      for (const child of children) {
        content.appendChild(child);
      }
    }
    else if (children) {
      content.appendChild(children);
    }
    content.style.width = `${initialWidth}px`;
    content.style.height = `${initialHeight}px`;
    horizontal.appendChild(content);
  }

  const handleHorizontal = newDOMElement("div", ["drag-scalable-handle", "right"]);
  horizontal.appendChild(handleHorizontal);

  const handleVertical = newDOMElement("div", ["drag-scalable-handle", "bottom"]);
  handleVertical.appendChild(newDOMElement("div", ["drag-scalable-handle", "diagonal"]));
  container.appendChild(handleVertical);


  return container;
};

const makeScalableDraggable = (
  scalable: HTMLElement,
  {
    w: baseWidth,
    h: baseHeight 
  }: ScalableDraggableOptions = {
    w: DEF_WIDTH,
    h: DEF_HEIGHT
  },
  onDragEnd?: (e: MouseEvent) => void,
  onDragEndMobile?: (e: TouchEvent) => void
) => {
  const content = scalable.getElementsByClassName("drag-scalable-content")[0] as HTMLElement;

  const handleBot = scalable.querySelector(".drag-scalable-handle.bottom")!;
  const handleRight = scalable.querySelector(".drag-scalable-handle.right")!;
  const handleDiag = scalable.querySelector(".drag-scalable-handle.diagonal")!;

  const handleResizeVertical = (y: number) => {
    const contentRect = content.getBoundingClientRect();
    const newHeight = Math.max(y - contentRect.top, baseHeight);
    content.style.height = `${newHeight}px`;
  };
  const resizeVertical = (e: MouseEvent) => handleResizeVertical(e.clientY);
  const resizeVerticalTouch = (e: TouchEvent) => handleResizeVertical(e.touches[0].clientY);

  const handleResizeHorizontal = (x: number) => {
    const contentRect = content.getBoundingClientRect();
    const newWidth = Math.max(x - contentRect.left, baseWidth);
    content.style.width = `${newWidth}px`;
  };
  const resizeHorizontal = (e: MouseEvent) => handleResizeHorizontal(e.clientX);
  const resizeHorizontalTouch = (e: TouchEvent) => handleResizeHorizontal(e.touches[0].clientX);

  const handleResizeDiagonal = (x: number, y: number) => {
    const contentRect = content.getBoundingClientRect();
    const newWidth = Math.max(x - contentRect.left, baseWidth);
    const newHeight = Math.max(y - contentRect.top, baseHeight);
    content.style.width = `${newWidth}px`;
    content.style.height = `${newHeight}px`;
  };
  const resizeDiagonal = (e: MouseEvent) => handleResizeDiagonal(e.clientX, e.clientY);
  const resizeDiagonalTouch = (e: TouchEvent) => handleResizeDiagonal(e.touches[0].clientX, e.touches[0].clientY);

  const handleMouseUp = () => {
    const contentRect = content.getBoundingClientRect();
    const endX = contentRect.left + contentRect.width;
    const overflowX = endX - window.innerWidth;
    if (overflowX > 0) {
      const newWidth = Math.max(contentRect.width - overflowX - OFFSET, baseWidth);
      content.style.width = `${newWidth}px`;
    }
    const endY = contentRect.top + contentRect.height;
    const overflowY = endY - window.innerHeight;
    if (overflowY > 0) {
      const newHeight = Math.max(contentRect.height - overflowY - OFFSET, baseHeight);
      content.style.height = `${newHeight}px`;
    }
  };

  handleBot.addEventListener("mousedown", (_) => document.addEventListener("mousemove", resizeVertical));
  handleRight.addEventListener("mousedown", (_) => document.addEventListener("mousemove", resizeHorizontal));
  handleDiag.addEventListener("mousedown", (_) => document.addEventListener("mousemove", resizeDiagonal));
  handleBot.addEventListener("touchstart", (_) => document.addEventListener("touchmove", resizeVerticalTouch), { passive: false });
  handleRight.addEventListener("touchstart", (_) => document.addEventListener("touchmove", resizeHorizontalTouch), { passive: false });
  handleDiag.addEventListener("touchstart", (_) => document.addEventListener("touchmove", resizeDiagonalTouch), { passive: false });

  document.addEventListener("mouseup", (e) => {
    document.removeEventListener("mousemove", resizeVertical);
    document.removeEventListener("mousemove", resizeHorizontal);
    document.removeEventListener("mousemove", resizeDiagonal);
    handleMouseUp();
    onDragEnd && onDragEnd(e);
  });
  document.addEventListener("touchend", (e) => {
    document.removeEventListener("touchmove", resizeVerticalTouch);
    document.removeEventListener("touchmove", resizeHorizontalTouch);
    document.removeEventListener("touchmove", resizeDiagonalTouch);
    handleMouseUp();
    onDragEndMobile && onDragEndMobile(e);
  });
};

const makePersistentScalableDraggable = (
  element: HTMLElement,
  options?: ScalableDraggableOptions
) => {
  const elementIdKey = `${element.id}-drag-scale-persistent`;
  const content = element.getElementsByClassName("drag-scalable-content")[0] as HTMLElement;

  const stored = localStorage.getItem(elementIdKey);
  if (stored) {
    const { w, h } = JSON.parse(stored);
    content.style.width = `${w}px`;
    content.style.height = `${h}px`;
  }
  else {
    content.style.width = `${options?.w}px`;
    content.style.height = `${options?.h}px`;
  }

  const savePosition = (_) => {
    if (element.style.display === "none") {
      return;
    }
    const { width: w, height: h } = content.getBoundingClientRect();
    localStorage.setItem(elementIdKey, JSON.stringify({
      w: Math.max(Math.floor(w), options?.w || DEF_WIDTH),
      h: Math.max(Math.floor(h), options?.h || DEF_HEIGHT),
    }));
  };

  makeScalableDraggable(element, options, savePosition, savePosition);
  return {
    flush: () => localStorage.removeItem(elementIdKey),
  };
};

export {
  scalableDraggableContainer,
  makePersistentScalableDraggable,
};
