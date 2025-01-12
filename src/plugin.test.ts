import {
  tooltipModal,
  tooltipButton,
  loadTooltipModal,
} from "./plugin/index";
import type {TooltipHtmlElement} from "./plugin/types";

const MODAL_ID = "jkutkut/tooltip-modal";
const BUTTON_ID = "jkutkut/tooltip-button";
const LONG_PRESS_DELAY = 500;

const tooltip = tooltipModal(MODAL_ID) as TooltipHtmlElement;
const floatingButton = tooltipButton(BUTTON_ID) as TooltipHtmlElement;
floatingButton.addEventListener("click", () => {
  tooltip.show();
  loadTooltipModal(tooltip, document.tmTools);
});

// long press
let __tooltipLongPressTimeout: ReturnType<typeof setTimeout> | null = null;
const disableTooltipLongPress = () => {
  if (__tooltipLongPressTimeout) {
    clearTimeout(__tooltipLongPressTimeout);
    __tooltipLongPressTimeout = null;
  }
};
floatingButton.addEventListener("mouseup", disableTooltipLongPress);
floatingButton.addEventListener("mousemove", disableTooltipLongPress);
floatingButton.addEventListener("mousedown", () => {
  __tooltipLongPressTimeout = setTimeout(() => {
    tooltip.hide();
    floatingButton.hide();
  }, LONG_PRESS_DELAY);
});
floatingButton.addEventListener("touchend", disableTooltipLongPress, { passive: false });
floatingButton.addEventListener("touchmove", disableTooltipLongPress, { passive: false });
floatingButton.addEventListener("touchstart", () => {
  __tooltipLongPressTimeout = setTimeout(() => {
    tooltip.hide();
    floatingButton.hide();
  }, LONG_PRESS_DELAY);
}, { passive: false });

setTimeout(() => {
  const click = new MouseEvent("click");
  floatingButton.dispatchEvent(click);
}, 800);
