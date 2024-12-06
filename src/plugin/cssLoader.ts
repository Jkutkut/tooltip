import lzString from "lz-string";

import tooltipCssObj from "d/plugin.min.css.o" with { type: "text", encoding: "utf16" };

const loadTooltipCss = () => {
  const style = document.createElement("style");
  style.textContent = lzString.decompressFromUTF16(tooltipCssObj);
  document.head.appendChild(style);
};

export { loadTooltipCss };
