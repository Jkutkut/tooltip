import { makePersistentDraggable } from "./draggable";
import type { InitialPosition, TooltipHtmlElement } from "./types";
import { getElementByIdOr } from "./utils";

const tooltipButton = (id: string, initialPosition?: InitialPosition) => {
  return getElementByIdOr(id, () => {
    const floatingButton: TooltipHtmlElement = document.createElement("div");
    floatingButton.classList.add("tooltip-button");
    floatingButton.id = id;

    document.body.appendChild(floatingButton);
    floatingButton.hide = () => {
      floatingButton.style.display = "none";
    };
    makePersistentDraggable(floatingButton, initialPosition);
    return floatingButton;
  });
};

export { tooltipButton };
