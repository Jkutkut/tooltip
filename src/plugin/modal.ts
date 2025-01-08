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

const proccessObjectAsNodeArray = (obj: any, previousNode: TooltipNode | null = null) => {
  return Object.entries(obj).map(([name, value]) => (
      {
        name,
        previous: previousNode,
        type: TooltipNodeType.RawObject,
        content: value
      } as TooltipNode 
  )).filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }));
};

const proccessNode = (node: TooltipNode) => {
  switch (node.type) {
    case TooltipNodeType.RawObject:
      if (typeof node.content === "function") {
        node.type = TooltipNodeType.Action;
      }
      else if (typeof node.content === "object") {
        node.type = TooltipNodeType.Node;
        node.content = proccessObjectAsNodeArray(node.content, node);
      }
      else {
        console.error("TODO invalid node:", node.name, node);
        node.type = TooltipNodeType.Invalid;
      }
      break;
    case TooltipNodeType.Node:
    case TooltipNodeType.Action:
      break;
    default:
      console.warn("TODO unknown node type:", node.name, node.type);
      break;
  }
};

const updateModalContent = (
  htmlElement: HTMLElement,
  node: TooltipNode,
) => {
  const {
    name: title,
    previous,
    type,
  } = node;
  if (htmlElement.hasChildNodes()) {
    htmlElement.innerHTML = "";
  }
  {
    const titleEl = document.createElement("span");
    titleEl.classList.add("title");
    titleEl.textContent = title;
    if (previous) {
      const backBtn = document.createElement("a");
      backBtn.classList.add("back");
      backBtn.textContent = "<";
      backBtn.addEventListener("click", () => updateModalContent(htmlElement, previous));
      backBtn.appendChild(titleEl);
      htmlElement.appendChild(backBtn);
    }
    else {
      htmlElement.appendChild(titleEl);
    }
  }
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("actions");
  switch (type) {
    case TooltipNodeType.Node:
      const nodes = node.content as TooltipNode[];
      {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          proccessNode(node);
          if (node.type === TooltipNodeType.Invalid) {
            nodes.splice(i, 1);
            i--;
            continue;
          }
          const actionEl = document.createElement("a");
          actionEl.classList.add("action");
          actionEl.textContent = node.name;
          const icon = document.createElement("span");
          if (node.type === TooltipNodeType.Node) {
            icon.innerHTML = "&gt;";
            actionEl.addEventListener("click", () => {
              updateModalContent(htmlElement, node);
            });
          }
          else {
            icon.innerHTML = "&#9658;";
            if (node.type === TooltipNodeType.Action) {
              actionEl.addEventListener("click", () => {
                console.log("Executing action", node);
                (node.content as TooltipAction)();
              });
            }
          }
          actionEl.appendChild(icon);
          actionsDiv.appendChild(actionEl);
        }
      }
      break;
    default:
      console.warn("Invalid node type:", type);
  }
  htmlElement.appendChild(actionsDiv);
};

type TooltipRawObject = any;
type TooltipAction = () => void;
type TooltipForm = {
};

enum TooltipNodeType {
  Node = "node",
  Action = "action",
  Form = "form",
  RawObject = "rawObject",
  Invalid = "invalid",
}
type TooltipOption = TooltipAction | TooltipForm | TooltipRawObject;

type TooltipNode = {
  name: string;
  previous: TooltipNode | null;
  type: TooltipNodeType;
  content: TooltipNode[] | TooltipOption;
};

const updateTooltip = (modal: any, tools: any, title?: string) => {
  if (!tools) {
    return;
  }
  const root: TooltipNode = {
    name: title || "Tooltip",
    previous: null,
    type: TooltipNodeType.Node,
    content: [] as TooltipNode[],
  };
  root.content = proccessObjectAsNodeArray(tools, root);
  updateModalContent(
    modal.querySelector(".content") || modal,
    root
  );
};

export { tooltipModal, updateTooltip };
