import { ComponentChild, render } from 'preact';

export interface BaseElementProps {}
class BaseElement<P extends BaseElementProps> {
  public _node;
  public _component;

  public props: P;

  protected constructor(props: P) {
    this.props = this.formatProps({
      ...props,
    });

    this._node = null;
  }

  protected formatProps(props: P) {
    return props;
  }

  public render(): ComponentChild | Error {
    throw new Error('BaseElement render must be extended.');
  }

  mount(domNode: HTMLElement | string): this {
    const node =
      typeof domNode === 'string' ? document.querySelector(domNode) : domNode;

    if (!node) {
      throw new Error('Component could not mount. Root node was not found.');
    }

    if (this._node) {
      throw new Error('Component is already mounted.');
    }

    this._node = node;
    this._component = this.render();

    render(this._component, node);

    return this;
  }
}

export default BaseElement;
