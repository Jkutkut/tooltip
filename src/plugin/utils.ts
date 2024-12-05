import type {TooltipHtmlElement} from "./types";

const getElementByIdOr = (id: string, or: () => TooltipHtmlElement) => {
  const element = document.getElementById(id);
  if (element) {
    return element;
  }
  return or();
};

export { getElementByIdOr };
