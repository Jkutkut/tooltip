import {
  tooltipModal,
  tooltipButton,
  loadTooltipModal,
} from "./plugin/index";
import type {TooltipHtmlElement} from "./plugin/types";

const MODAL_ID = "jkutkut/tooltip-modal";
const BUTTON_ID = "jkutkut/tooltip-button";

const tooltip = tooltipModal(MODAL_ID) as TooltipHtmlElement;
const floatingButton = tooltipButton({
  id: BUTTON_ID,
  onClick: () => {
    tooltip.show();
    loadTooltipModal(tooltip, document.tmTools);
  },
  onLongClick: () => {
    tooltip.hide();
    floatingButton.hide();
  },
  longClickDelay: 500
}) as TooltipHtmlElement;

setTimeout(() => {
  const click = new MouseEvent("click");
  floatingButton.dispatchEvent(click);
}, 800);
