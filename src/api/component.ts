export default class Component {
  /**
   * Creating html element
   */
  createElement(
    tagName: string,
    options?: {
      inElement?: HTMLElement,
      content?: HTMLElement | string | number,
    }
  ): HTMLElement {
    const element = document.createElement(tagName);

    if (options) {
      if (options.inElement) options.inElement.appendChild(element);
      if (options.content) {
        if (options.content instanceof HTMLElement) {
          element.appendChild(options.content);
        } else element.innerHTML = String(options.content);
      };
    }

    return element;
  }
}
