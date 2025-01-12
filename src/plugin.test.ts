import {
  tooltipModal,
  tooltipButton,
  loadTooltipModal,
  loadTooltipCss
} from "./plugin/index";

const MODAL_ID = "jkutkut/tooltip-modal";
const BUTTON_ID = "jkutkut/tooltip-button";
const LONG_PRESS_DELAY = 500;

loadTooltipCss();

const tooltip = tooltipModal(MODAL_ID);
const floatingButton = tooltipButton(BUTTON_ID);
floatingButton.addEventListener("click", () => {
  tooltip.style.display = "flex";
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
    tooltip.style.display = "none";
    floatingButton.style.display = "none";
  }, LONG_PRESS_DELAY);
});
floatingButton.addEventListener("touchend", disableTooltipLongPress, { passive: false });
floatingButton.addEventListener("touchmove", disableTooltipLongPress, { passive: false });
floatingButton.addEventListener("touchstart", () => {
  __tooltipLongPressTimeout = setTimeout(() => {
    tooltip.style.display = "none";
    floatingButton.style.display = "none";
  }, LONG_PRESS_DELAY);
}, { passive: false });

setTimeout(() => {
  const click = new MouseEvent("click");
  floatingButton.dispatchEvent(click);
}, 800);
