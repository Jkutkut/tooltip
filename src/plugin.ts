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
    const data = {
      canGoBack: null,
      // canGoBack: () => {
      //   console.log("Going back");
      // },
      title: "Tooltip",
      actions: [
        {
          text: "Action 1",
          type: "action",
          action: () => {
            console.log("Action 1");
          },
        },
        {
          text: "Tooltip",
          type: "tooltip",
          action: () => {
            console.log("Tooltip");
          }
        }
      ]
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
    updateModalContent(content, data);
    modal.appendChild(content);

    makeDraggable(modal);
    modal.style.display = "none";

    document.body.appendChild(modal);
    return modal;
  });
};

const floatingButton = tooltipButton();
const tooltip = tooltipModal();

floatingButton.addEventListener("click", () => {
  console.log("Floating button clicked!");
  tooltip.style.display = "flex";
});

setTimeout(() => {
  const click = new MouseEvent("click");
  console.log("Dispatching click event...");
  floatingButton.dispatchEvent(click);
}, 800);
