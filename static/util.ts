import * as elements from "./elements";
import { HtmlElementModifiable } from "./types";

function createElement(name: HtmlElementModifiable, dict: object = {}) {
  let element = elements[name];
  for (const [key, value] of Object.entries(dict)) {
    element = element.replace(key, value);
  }
  return element;
}

export { createElement };
