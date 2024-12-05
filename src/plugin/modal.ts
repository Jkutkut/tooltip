import {makePersistentDraggable} from "./draggable";
import type {TooltipHtmlElement, InitialPosition} from "./types";
import {getElementByIdOr} from "./utils";

const tooltipModal = (id: string, initialPosition?: InitialPosition) => {
  return getElementByIdOr(id, () => {
    const onClose = (e: MouseEvent) => {
      e.preventDefault();
      modal.style.display = "none";
      // TODO
      return false;
    };
    const modal = document.createElement("div") as TooltipHtmlElement;
    modal.id = id;
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

    makePersistentDraggable(modal, initialPosition);
    modal.style.display = "none";

    document.body.appendChild(modal);
    return modal;
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

export { tooltipModal, updateTooltip };
