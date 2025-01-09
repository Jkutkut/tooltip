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

enum TooltipNodeType {
  Node = "node",
  RawObject = "rawObject",
  Invalid = "invalid",
}

type TooltipNode = {
  name: string;
  previous: TooltipNode | null;
  type: TooltipNodeType | string;
  content: TooltipNode[] | any;
};

const processors: ( (node: TooltipNode, parent?: TooltipNode) => void )[] = [
  /* Action */ (node) => {
    if (typeof node.content === "function") {
      node.type = "action";
    }
  },
  /* Node */ (node, parentNode) => {
   if (typeof node.content === "object") {
      node.type = "node";
      node.content = proccessObjectAsNodeArray(node.content, parentNode);
    }
  },
  /* Fallback */ (node) => {
    console.warn("Invalid node:", node.name, node);
    node.type = TooltipNodeType.Invalid;
  }
];

const actuators: { [key: string]: (node: TooltipNode, modalContent: HTMLElement) => void } = {
  action: (node, _) => {
    console.log("Executing action", node);
    (node.content as Function)();
  },
  node: (node, modal) => updateModalContent(modal, node),
};

const sortingTooltipNodes = [
  TooltipNodeType.Node,
  "action",
];

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
  for (let i = 0; node.type == TooltipNodeType.RawObject && i < processors.length; i++) {
    processors[i](node);
  }
};

const updateModalContent = (
  htmlElement: HTMLElement,
  currentNode: TooltipNode,
) => {
  const {
    name: title,
    previous,
    type,
  } = currentNode;
  if (htmlElement.hasChildNodes()) {
    htmlElement.innerHTML = "";
  }
  console.debug("Updating modal", title, currentNode, htmlElement);
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
  htmlElement.appendChild(actionsDiv);
  if (currentNode.type !== TooltipNodeType.Node) {
    console.warn("Invalid node type:", type);
    return;
  }
  
  let nodes = (currentNode.content as TooltipNode[]);
  nodes.forEach(proccessNode);
  nodes = nodes.filter((node) => node.type !== TooltipNodeType.Invalid);
  nodes.sort((a, b) => {
    const byType = sortingTooltipNodes.indexOf(a.type) - sortingTooltipNodes.indexOf(b.type);
    if (byType !== 0) {
      return byType;
    }
    return a.name.localeCompare(b.name, "en", { numeric: true });
  });
  for (const node of nodes) {
    const actionEl = document.createElement("a");
    actionEl.classList.add("action");
    actionEl.textContent = node.name;
    const icon = document.createElement("span");
    icon.innerHTML = (node.type === TooltipNodeType.Node) ? "&gt;" : "&#9658;";
    const clickAction = actuators[node.type];
    if (clickAction) {
      actionEl.addEventListener("click", () => {
        clickAction(node, htmlElement);
      });
    }
    actionEl.appendChild(icon);
    actionsDiv.appendChild(actionEl);
  }
};

const loadTooltipModal = (modal: any, tools: any, title?: string) => {
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

export { tooltipModal, loadTooltipModal };
