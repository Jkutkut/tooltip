import {
  tooltipModal,
  tooltipButton,
  updateTooltip,
  loadTooltipCss
} from "./plugin/index";

const MODAL_ID = "jkutkut/tooltip-modal";
const tooltip = tooltipModal(MODAL_ID);
const BUTTON_ID = "jkutkut/tooltip-button";
const floatingButton = tooltipButton(BUTTON_ID);

loadTooltipCss();

floatingButton.addEventListener("click", () => {
  console.log("Floating button clicked!");
  tooltip.style.display = "flex";
  updateTooltip(tooltip, document.tmTools);
});

setTimeout(() => {
  const click = new MouseEvent("click");
  console.log("Dispatching click event...");
  floatingButton.dispatchEvent(click);
}, 800);
