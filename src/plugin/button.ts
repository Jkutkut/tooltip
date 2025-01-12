import { makePersistentDraggable } from "./draggable";
import {lzDecompressUtf16} from "./lz";
import type { InitialPosition, TooltipHtmlElement } from "./types";
import { getElementByIdOr } from "./utils";

import logo from "@/../dist/toolbox-logo.svg.o" with { type: "text" };

const tooltipButton = (id: string, initialPosition?: InitialPosition) => {
  return getElementByIdOr(id, () => {
    const floatingButton: TooltipHtmlElement = document.createElement("div");
    floatingButton.classList.add("tooltip-button");
    floatingButton.id = id;
    floatingButton.innerHTML = lzDecompressUtf16(logo) || "";

    document.body.appendChild(floatingButton);
    floatingButton.hide = () => {
      floatingButton.style.display = "none";
    };
    makePersistentDraggable(floatingButton, initialPosition);
    return floatingButton;
  });
};

export { tooltipButton };
