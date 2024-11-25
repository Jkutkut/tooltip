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

const tooltipModal = () => {
  const ID = "jkutkut/tooltip-modal";

  return getElementByIdOr(ID, () => {
    const {onClose} = {
      onClose: (e: MouseEvent) => {
        e.preventDefault();
        console.log("Closing modal");
        // TODO
        return false;
      },
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

    // modal.style.display = "none";
    document.body.appendChild(modal);
    console.log(modal);

    makeDraggable(modal);
    // modal.hide = () => {
    //   modal.style.display = "none";
    // };
    // modal.addEventListener("click", () => modal.hide!());
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
