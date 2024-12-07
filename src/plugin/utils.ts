import type {TooltipHtmlElement} from "./types";

const getElementByIdOr = (id: string, or: () => TooltipHtmlElement) => {
  const element = document.getElementById(id);
  if (element) {
    return element;
  }
  return or();
};

const newDOMElement = (type: string, classes?: string[]) => {
  const element = document.createElement(type);
  if (classes) {
    element.classList.add(...classes);
  }
  return element;
};

export {
  getElementByIdOr,
  newDOMElement,
};
