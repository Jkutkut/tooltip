import {
  tooltipModal,
  tooltipButton,
  loadTooltipModal,
} from "./plugin/index";
import type {TooltipHtmlElement, TooltipModalHtmlElement} from "./plugin/types";

const MODAL_ID = "jkutkut/tooltip-modal";
const BUTTON_ID = "jkutkut/tooltip-button";

const tooltip = tooltipModal({
  id: MODAL_ID,
  initialPosition: {
    x: 10, y: 10,
    xAxis: "right",
    yAxis: "top",
  },
  // scaleOptions: {
  //   w: 200,
  //   h: 200,
  // }
}) as TooltipModalHtmlElement;
const floatingButton = tooltipButton({
  id: BUTTON_ID,
  initialPosition: {
    x: 10, y: 10,
    xAxis: "right",
    yAxis: "bottom",
  },
  onClick: () => {
    tooltip.show();
    loadTooltipModal(tooltip, document.tmTools);
  },
  onLongClick: () => {
    tooltip.hide();
    tooltip.flushPersitanceDraggablePosition();
    tooltip.flushPersitanceScalableDraggable();
    floatingButton.hide();
    floatingButton.flushPersitanceDraggablePosition();
  },
  longClickDelay: 500
}) as TooltipHtmlElement;

setTimeout(() => {
  const click = new MouseEvent("click");
  floatingButton.dispatchEvent(click);
}, 800);
