const makeDraggable = (
  element: HTMLElement,
  onDragStart?: (e: MouseEvent) => void,
  onDragEnd?: (e: MouseEvent) => void,
  xAxis: "right" | "left" = "right",
  yAxis: "top" | "bottom" = "top",
) => {
  let deltaX = 0, deltaY = 0, prevX = 0, prevY = 0;

  const dragMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    prevX = e.clientX;
    prevY = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = dragElement;
    onDragStart && onDragStart(e);
  };

  const dragElement = (e: MouseEvent) => {
    e.preventDefault();

    let x: number;
    let y: number;
    deltaX = prevX - e.clientX;
    if (xAxis === "left") {
      x = element.offsetLeft - deltaX;
    } else {
      const offsetRight = window.innerWidth - element.offsetLeft - element.offsetWidth; 
      x = offsetRight + deltaX;
    }
    deltaY = prevY - e.clientY;
    if (yAxis === "top") {
      y = element.offsetTop - deltaY;
    } else {
      const offsetBottom = window.innerHeight - element.offsetTop - element.offsetHeight; 
      y = offsetBottom + deltaY;
    }

    x = Math.max(0, x);
    x = Math.min(window.innerWidth - element.offsetWidth, x);
    y = Math.max(0, y);
    y = Math.min(window.innerHeight - element.offsetHeight, y);

    prevX = e.clientX;
    prevY = e.clientY;

    console.log("Dragging", xAxis, x, yAxis, y);
    element.style[xAxis] = x + "px";
    element.style[yAxis] = y + "px";
  };

  const closeDragElement = (e: MouseEvent) => {
    document.onmouseup = null;
    document.onmousemove = null;
    onDragEnd && onDragEnd(e);
  };

  const dragHandle = element.querySelector('.drag-handle') as HTMLElement;
  if (dragHandle) {
      dragHandle.onmousedown = dragMouseDown;
  }
  else {
      element.onmousedown = dragMouseDown;
  }
};

const makePersistentDraggable = (
  element: HTMLElement,
  initialX: number = 50,
  initialY: number = 50,
  xAxis: "right" | "left" = "right",
  yAxis: "top" | "bottom" = "top",
) => {
  const elementIdKey = `${element.id}-drag-persistent`;
  element.style.position = "absolute";
  const stored = localStorage.getItem(elementIdKey);
  if (stored) {
    const { x, y } = JSON.parse(stored);
    element.style[xAxis] = x;
    element.style[yAxis] = y;
  }
  else {
    element.style[yAxis] = initialY + "px";
    element.style[xAxis] = initialX + "px";
  }
  makeDraggable(
    element,
    () => {
      console.log("drag start");
    },
    () => {
      console.log("drag end", element.style[xAxis], element.style[yAxis]);
      localStorage.setItem(
        elementIdKey,
        JSON.stringify({
          x: element.style[xAxis],
          y: element.style[yAxis],
        })
      );
    },
    xAxis, yAxis
  );
}

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

    floatingButton.style.width = "50px";
    floatingButton.style.height = "50px";
    floatingButton.style.borderRadius = "50%";
    floatingButton.style.backgroundColor = "red";

    document.body.appendChild(floatingButton);
    floatingButton.hide = () => {
      floatingButton.style.display = "none";
    };
    makePersistentDraggable(floatingButton, 10, 10, "right");
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
    modal.classList.add("tooltip-modal");

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

    makePersistentDraggable(modal, 10, 100, "left");
    modal.style.display = "none";

    document.body.appendChild(modal);
    return modal;
  });
};

const updateTooltip = (modal: any, tools: any, title?: string, canGoBack?: () => void) => {
  if (!tools) {
    return;
  }
  title = title || "Tooltip";
  updateModalContent(
    modal.querySelector(".content") || modal,
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

const tooltip = tooltipModal();

const floatingButton = tooltipButton();
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
