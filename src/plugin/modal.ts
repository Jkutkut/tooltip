import {loadTooltipCss} from ".";
import {makePersistentDraggable} from "./draggable";
import {makePersistentScalableDraggable, scalableDraggableContainer} from "./scalable-draggable";
import type {InitialPosition, ScalableDraggableOptions, TooltipHtmlElement} from "./types";
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
    const modal = newDOMElement("div", ["tooltip-modal"]) as TooltipHtmlElement;
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

    makePersistentScalableDraggable(
      modal,
      scaleOptions
    );

    makePersistentDraggable(modal, initialPosition);
    modal.style.display = "none";

    document.body.appendChild(modal);
    return modal;
  });
};

export { tooltipModal };
