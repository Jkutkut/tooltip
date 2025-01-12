import {lzDecompressUtf16} from "./lz";
import tooltipCssObj from "d/plugin.min.css.o" with { type: "text", encoding: "utf16" };

const loadTooltipCss = () => {
  const ID = "jkutkut/tooltip-css";
  if (document.getElementById(ID)) {
    return;
  }
  const style = document.createElement("style");
  style.id = ID;
  style.textContent = lzDecompressUtf16(tooltipCssObj);
  document.head.appendChild(style);
};

export { loadTooltipCss };
