import {loadTooltipCss} from ".";
import { makePersistentDraggable } from "./draggable";
import {lzDecompressUtf16} from "./lz";
import type { InitialPosition, TooltipHtmlElement } from "./types";
import { getElementByIdOr, newDOMElement } from "./utils";

import logo from "@/../dist/toolbox-logo.svg.o" with { type: "text" };

const DEF_LONG_PRESS_DELAY = 500;
interface Props {
  id: string;
  initialPosition?: InitialPosition;
  onClick?: () => void;
  onLongClick?: () => void;
  longClickDelay?: number;
}

const tooltipButton = ({
  id, initialPosition,
  onClick,
  onLongClick, longClickDelay = DEF_LONG_PRESS_DELAY
}: Props) => {
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
    if (onClick) {
      floatingButton.addEventListener("click", onClick);
    }
    if (onLongClick) {
      addLongPress(floatingButton, onLongClick, longClickDelay);
    }
    floatingButton.innerHTML = lzDecompressUtf16(logo) || "";

    document.body.appendChild(floatingButton);
    makePersistentDraggable(floatingButton, initialPosition);
    return floatingButton;
  });
};

const addLongPress = (button: TooltipHtmlElement, onLongClick: () => void, longClickDelay: number) => {
  let __tooltipLongPressTimeout: ReturnType<typeof setTimeout> | null = null;
  const enableTooltipLongPress = () => {
    __tooltipLongPressTimeout = setTimeout(onLongClick, longClickDelay);
  };
  const disableTooltipLongPress = () => {
    if (__tooltipLongPressTimeout) {
      clearTimeout(__tooltipLongPressTimeout);
      __tooltipLongPressTimeout = null;
    }
  };
  button.addEventListener("mouseup", disableTooltipLongPress);
  button.addEventListener("mousemove", disableTooltipLongPress);
  button.addEventListener("mousedown", enableTooltipLongPress);
  button.addEventListener("touchend", disableTooltipLongPress, { passive: false });
  button.addEventListener("touchmove", disableTooltipLongPress, { passive: false });
  button.addEventListener("touchstart", enableTooltipLongPress, { passive: false });
};

export { tooltipButton };
