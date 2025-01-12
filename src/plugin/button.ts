import {loadTooltipCss} from ".";
import { makePersistentDraggable } from "./draggable";
import {lzDecompressUtf16} from "./lz";
import type { InitialPosition, TooltipHtmlElement } from "./types";
import { getElementByIdOr, newDOMElement } from "./utils";

import logo from "@/../dist/toolbox-logo.svg.o" with { type: "text" };

const tooltipButton = (id: string, initialPosition?: InitialPosition) => {
  loadTooltipCss();
  return getElementByIdOr(id, () => {
    const floatingButton = newDOMElement("div", ["tooltip-button"]) as TooltipHtmlElement;
    floatingButton.id = id;
    floatingButton.hide = () => {
      floatingButton.style.display = "none";
    };
    floatingButton.show = () => {
      floatingButton.style.display = "flex";
    };
    floatingButton.innerHTML = lzDecompressUtf16(logo) || "";

    document.body.appendChild(floatingButton);
    makePersistentDraggable(floatingButton, initialPosition);
    return floatingButton;
  });
};

export { tooltipButton };
