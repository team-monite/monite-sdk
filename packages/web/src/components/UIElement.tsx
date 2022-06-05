import BaseElement, { BaseElementProps } from './BaseElement';

interface UIElementProps extends BaseElementProps {}
class UIElement<P extends UIElementProps = any> extends BaseElement<P> {
  constructor(props: P) {
    super({
      ...props,
    });
  }
}

export default UIElement;
