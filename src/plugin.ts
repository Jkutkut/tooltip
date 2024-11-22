console.log("Hello via Bun!");

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
    return floatingButton;
  });
};

const tooltipModal = () => {
  const ID = "jkutkut/tooltip-modal";

  return getElementByIdOr(ID, () => {
    const modal = document.createElement("div") as TooltipHtmlElement;
    modal.id = ID;

    modal.style.position = "absolute";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

    const content = document.createElement("div");
    content.style.padding = "100px";
    content.style.backgroundColor = "rgba(255, 255, 255, 0.8)";

    modal.appendChild(content);

    modal.style.display = "none";
    document.body.appendChild(modal);

    modal.hide = () => {
      modal.style.display = "none";
    };
    modal.addEventListener("click", () => modal.hide!());
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
