import {loadTooltipCss} from ".";
import {makePersistentDraggable} from "./draggable";
import {makePersistentScalableDraggable, scalableDraggableContainer} from "./scalable-draggable";
import type {InitialPosition, ScalableDraggableOptions, TooltipModalHtmlElement} from "./types";
import {getElementByIdOr, newDOMElement} from "./utils";

interface Props {
  id: string;
  initialPosition?: InitialPosition;
  scaleOptions?: ScalableDraggableOptions;
};

const tooltipModal = ({
  id,
  initialPosition,
  scaleOptions
}: Props) => {
  loadTooltipCss();
  return getElementByIdOr(id, () => {
    const modal = newDOMElement("div", ["tooltip-modal"]) as TooltipModalHtmlElement;
    modal.id = id;
    modal.hide = () => {
      modal.style.display = "none";
    };
    modal.show = () => {
      modal.style.display = "flex";
    };

    const elements: HTMLElement[] = [];

    {
      const dragHandle = newDOMElement("div", ["drag-handle"]);
      const closeBtn = newDOMElement("a", ["close"]);
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.hide();
        return false;
      });
      dragHandle.appendChild(closeBtn);
      elements.push(dragHandle);
    }

    elements.push(newDOMElement("div", ["content"]));

    const scalableContent = scalableDraggableContainer(
      elements,
      scaleOptions?.w,
      scaleOptions?.h
    );
    modal.appendChild(scalableContent);
    document.body.appendChild(modal);

    const { flush: flushScalable } = makePersistentScalableDraggable(
      modal,
      scaleOptions
    );
    modal.flushPersitanceScalableDraggable = flushScalable;
    const { flush } = makePersistentDraggable(modal, initialPosition);
    modal.flushPersitanceDraggablePosition = flush;

    modal.hide();
    return modal;
  });
};

export { tooltipModal };
