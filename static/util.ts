type HtmlElement = "elementIdle" | "elementCompleted" | "elementPromptStart";
import * as elements from "./elements";

function createElement(name: HtmlElement, dict: object = {}) {
  let element = elements[name];
  for (const [key, value] of Object.entries(dict)) {
    element = element.replace(key, value);
  }
  return element;
}

export { createElement };
