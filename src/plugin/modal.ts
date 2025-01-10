import {makePersistentDraggable} from "./draggable";
import {makePersistentScalableDraggable, scalableDraggableContainer} from "./scalable-draggable";
import type {InitialPosition, ScalableDraggableOptions} from "./types";
import {getElementByIdOr, newDOMElement} from "./utils";

const tooltipModal = (
  id: string,
  initialPosition?: InitialPosition,
  scaleOptions?: ScalableDraggableOptions
) => {
  return getElementByIdOr(id, () => {
    const onClose = (e: MouseEvent) => {
      e.preventDefault();
      modal.style.display = "none";
      // TODO
      return false;
    };
    const modal = newDOMElement("div", ["tooltip-modal"]);
    modal.id = id;

    const elements = [];

    {
      const dragHandle = newDOMElement("div", ["drag-handle"]);
      const closeBtn = newDOMElement("a", ["close"]);
      closeBtn.addEventListener("click", onClose);
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
