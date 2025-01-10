enum TooltipNodeType {
  Node = "node",
  RawObject = "rawObject",
  Invalid = "invalid",
}

type TooltipNode = {
  name: string;
  type: TooltipNodeType | string;
  previous: TooltipNode | null;
  content: TooltipNode[] | any;
};

type TooltipInstance = {
  modal: HTMLElement;
  node: TooltipNode;
  rootNode: TooltipNode;
}

type TooltipInternals = {
  processors: ( (instance: TooltipInstance, node: TooltipNode) => void )[];
  actuators: { [key: string]: (instance: TooltipInstance, node: TooltipNode) => void };
  sortingTooltipNodes: string[];
  instances: { [key: string]: TooltipInstance }
}

declare global {
  interface Document {
    tooltip: TooltipInternals;
  }
}

const getTooltipInternals = () => {
  document.tooltip = document.tooltip || {
    processors: [
      /* Action */ (_, node) => {
        if (typeof node.content === "function") {
          node.type = "action";
        }
      },
      /* Node */ (_, node) => {
       if (typeof node.content === "object") {
          node.type = "node";
          node.content = proccessObjectAsNodeArray(node.content, node.previous);
        }
      },
      /* Fallback */ (_, node) => {
        console.warn("Invalid node:", node.name, node);
        node.type = TooltipNodeType.Invalid;
      }
    ],
    actuators: {
      action: (_, node) => {
        console.log("Executing action", node);
        (node.content as Function)();
      },
      node: (instance, node) => updateModalContent(instance, node),
    },
    sortingTooltipNodes: [
      TooltipNodeType.Node,
      "action",
    ],
    instances: {}
  };
  return document.tooltip;
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

const proccessNodes = (instance: TooltipInstance, nodes: TooltipNode[]) => {
  const { processors } = getTooltipInternals();
  for (const node of nodes) {
    for (let i = 0; node.type == TooltipNodeType.RawObject && i < processors.length; i++) {
      processors[i](instance, node);
    }
  }
  return nodes
};

const formatNodes = (nodes: TooltipNode[]) => {
  const { sortingTooltipNodes } = getTooltipInternals();
  nodes = nodes.filter((node) => node.type !== TooltipNodeType.Invalid);
  nodes.sort((a, b) => {
    const byType = sortingTooltipNodes.indexOf(a.type) - sortingTooltipNodes.indexOf(b.type);
    if (byType !== 0) {
      return byType;
    }
    return a.name.localeCompare(b.name, "en", { numeric: true });
  });
  return nodes;
}

const createTitle = (title: string, go2previous?: () => void) => {
  const titleEl = document.createElement("span");
  titleEl.classList.add("title");
  titleEl.textContent = title;
  if (!go2previous) {
    return titleEl;
  } 
  const backBtn = document.createElement("a");
  backBtn.classList.add("back");
  backBtn.textContent = "<";
  backBtn.addEventListener("click", go2previous);
  backBtn.appendChild(titleEl);
  return backBtn;
};

const createActionsContainer = () => {
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("actions");
  return actionsDiv;
};

const loadNodeOptions = (instance: TooltipInstance, container: HTMLElement) => {
  const { type, content } = instance.node;
  const { actuators } = getTooltipInternals();
  if (type !== TooltipNodeType.Node) {
    console.warn("Invalid node type:", type);
    return;
  }
  const nodes = formatNodes(proccessNodes(instance, content as TooltipNode[]));
  for (const node of nodes) {
    const actionEl = document.createElement("a");
    actionEl.classList.add("action");
    actionEl.textContent = node.name;
    const icon = document.createElement("span");
    icon.innerHTML = (node.type === TooltipNodeType.Node) ? "&gt;" : "&#9658;";
    const clickAction = actuators[node.type];
    if (clickAction) {
      actionEl.addEventListener("click", () => {
        clickAction(instance, node);
      });
    }
    actionEl.appendChild(icon);
    container.appendChild(actionEl);
  }
};

const updateModalContent = (
  instance: TooltipInstance,
  currentNode: TooltipNode,
) => {
  instance.node = currentNode;
  const domContainer = instance.modal;
  const { name: title, previous } = currentNode;
  if (domContainer.hasChildNodes()) {
    domContainer.innerHTML = "";
  }
  console.debug("Updating modal", title, currentNode, domContainer);
  domContainer.appendChild(createTitle(
    title, 
    previous ? () => updateModalContent(instance, previous) : undefined
  ));
  const actionsContainer = createActionsContainer();
  loadNodeOptions(instance, actionsContainer);
  domContainer.appendChild(actionsContainer);
};

const getTooltipInstance = (modal: HTMLElement, tools?: any, title?: string) => {
  const { instances } = getTooltipInternals();
  let instance: TooltipInstance = instances[modal.id];
  if (!instance) {
    if (!tools) {
      throw new Error("No tools provided");
    }
    const node = {
      name: title || "Tooltip",
      previous: null,
      type: TooltipNodeType.Node,
      content: [] as TooltipNode[],
    };
    node.content = proccessObjectAsNodeArray(tools, node);
    instance = {
      modal: modal.querySelector(".content") || modal,
      node,
      rootNode: node
    };
    instances[modal.id] = instance;
  }
  return instance;
};

const loadTooltipModal = (modal: any, tools: any) => {
  if (!modal) {
    return;
  }
  try {
    const instance = getTooltipInstance(modal, tools);
    updateModalContent(
      instance,
      instance.node
    );
  }
  catch (e) {
    console.error(e);
  }
};

export { loadTooltipModal };
