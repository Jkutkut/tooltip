import {
  tooltipModal,
  tooltipButton,
  updateTooltip,
  loadTooltipCss
} from "./plugin/index";

const MODAL_ID = "jkutkut/tooltip-modal";
const BUTTON_ID = "jkutkut/tooltip-button";
const LONG_PRESS_DELAY = 500;

loadTooltipCss();

const tooltip = tooltipModal(MODAL_ID);
const floatingButton = tooltipButton(BUTTON_ID);
floatingButton.addEventListener("click", () => {
  console.log("Floating button clicked!");
  tooltip.style.display = "flex";
  updateTooltip(tooltip, document.tmTools);
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

setTimeout(() => {
  const click = new MouseEvent("click");
  console.log("Dispatching click event...");
  floatingButton.dispatchEvent(click);
}, 800);
