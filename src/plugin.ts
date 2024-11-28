const makeDraggable = (element: HTMLElement) => {
  let currentPosX = 0, currentPosY = 0, previousPosX = 0, previousPosY = 0;

  const dragMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    previousPosX = e.clientX;
    previousPosY = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = dragElement;
  };

  const dragElement = (e: MouseEvent) => {
    e.preventDefault();
    currentPosX = previousPosX - e.clientX;
    currentPosY = previousPosY - e.clientY;

    let y = element.offsetTop - currentPosY;
    let x = element.offsetLeft - currentPosX;

    y = Math.max(0, y);
    x = Math.max(0, x);

    y = Math.min(window.innerHeight - element.offsetHeight, y);
    x = Math.min(window.innerWidth - element.offsetWidth, x);

    previousPosX = e.clientX;
    previousPosY = e.clientY;
    element.style.top = y + 'px';
    element.style.left = x + 'px';
  };

  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  };

  const dragHandle = element.querySelector('.drag-handle') as HTMLElement;
  if (dragHandle) {
      dragHandle.onmousedown = dragMouseDown;
  }
  else {
      element.onmousedown = dragMouseDown;
  }
};

type TooltipHtmlElement = HTMLElement & {
  hide?: () => void
};

const getElementByIdOr = (id: string, or: () => TooltipHtmlElement) => {
  const element = document.getElementById(id);
  if (element) {
    return element;
  }
  return or();
};

const tooltipButton = () => {
  const ID = "jkutkut/tooltip-button";

  return getElementByIdOr(ID, () => {
    const floatingButton: TooltipHtmlElement = document.createElement("div");
    floatingButton.id = ID;

    floatingButton.style.position = "absolute";
    floatingButton.style.top = "10px";
    floatingButton.style.right = "10px";
    floatingButton.style.width = "50px";
    floatingButton.style.height = "50px";
    floatingButton.style.borderRadius = "50%";
    floatingButton.style.backgroundColor = "red";

    document.body.appendChild(floatingButton);
    floatingButton.hide = () => {
      floatingButton.style.display = "none";
    };
    makeDraggable(floatingButton);
    return floatingButton;
  });
};

const updateModalContent = (content: HTMLElement, {
  title,
  canGoBack,
  actions
}: any) => {
  console.debug(
    "Update modal content\n",
    "Modal content", content,
    "\ntitle", title,
    "\ncanGoBack", canGoBack,
    "\nactions", actions
  );
  if (content.hasChildNodes()) {
    content.innerHTML = "";
  }
  {
    const titleEl = document.createElement("span");
    titleEl.classList.add("title");
    titleEl.textContent = title;
    if (canGoBack) {
      const backBtn = document.createElement("a");
      backBtn.classList.add("back");
      backBtn.textContent = "<";
      backBtn.addEventListener("click", canGoBack);
      backBtn.appendChild(titleEl);
      content.appendChild(backBtn);
    }
    else {
      content.appendChild(titleEl);
    }
  }
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("actions");
  if (actions && actions.length > 0) {
    for (const action of actions) {
      const actionEl = document.createElement("a");
      actionEl.classList.add("action");
      actionEl.textContent = action.text;
      const icon = document.createElement("span");
      switch (action.type) {
        case "tooltip":
          icon.innerHTML = "&gt;";
          break;
        case "action":
          icon.innerHTML = "&#9658;";
          break;
        default:
          console.warn("Invalid action type:", action.type);
          continue;
      }
      if (action.action) {
        actionEl.addEventListener("click", action.action);
      }
      actionEl.appendChild(icon);
      actionsDiv.appendChild(actionEl);
    }
  }
  content.appendChild(actionsDiv);
};

const tooltipModal = () => {
  const ID = "jkutkut/tooltip-modal";

  return getElementByIdOr(ID, () => {
    const onClose = (e: MouseEvent) => {
      e.preventDefault();
      modal.style.display = "none";
      // TODO
      return false;
    };
    const modal = document.createElement("div") as TooltipHtmlElement;
    modal.id = ID;
    modal.classList.add("modal");

    // modal.style.top = "0";
    // modal.style.left = "0";

    {
      const dragHandle = document.createElement("div");
      dragHandle.classList.add("drag-handle");
      const closeBtn = document.createElement("a");
      closeBtn.classList.add("close");
      dragHandle.appendChild(closeBtn);
      modal.appendChild(dragHandle);
      closeBtn.addEventListener("click", onClose);
    }

    const content = document.createElement("div");
    content.classList.add("content");
    modal.appendChild(content);

    makeDraggable(modal);
    modal.style.display = "none";

    document.body.appendChild(modal);
    return modal;
  });
};

const updateTooltip = (modal: any, tools: any, title?: string, canGoBack?: () => void) => {
  if (!tools) {
    return;
  }
  updateModalContent(
    modal,
    {
      title,
      canGoBack,
      actions: Object.entries(tools).map(([name, value]) => {
        if (typeof value === "function") {
          return { text: name, type: "action", action: value };
        }
        if (typeof value === "object") {
          const newGoBack = () => {
            updateTooltip(modal, tools, title, canGoBack);
          }; // TODO memory?
          return { text: name, type: "tooltip", action: () => updateTooltip(modal, value, name, newGoBack) };
        }
        console.warn("Invalid action / toolbook:", name, value);
        return;
      }).filter(Boolean)
    }
  );
};

const actions = {
  "action 1": () => {
    console.log("Action 1");
  },
  "book 1": {
    "action 2": () => {
      console.log("Action 2");
    },
    "book 2": {
      "action 3": () => {
        console.log("Action 3");
      }
    }
  }
};

const tooltip = tooltipModal();
updateTooltip(tooltip.querySelector(".content"), actions, "Tooltip");

const floatingButton = tooltipButton();
floatingButton.addEventListener("click", () => {
  console.log("Floating button clicked!");
  tooltip.style.display = "flex";
});

setTimeout(() => {
  const click = new MouseEvent("click");
  console.log("Dispatching click event...");
  floatingButton.dispatchEvent(click);
}, 800);
