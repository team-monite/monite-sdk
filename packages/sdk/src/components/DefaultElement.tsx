import { h } from 'preact';
import * as monite from '@monite/react-kit';

import UIElement from './UIElement';

class DefaultElement extends UIElement {
  render() {
    const { modules, componentType, ...props } = this.props;

    const Component = monite[componentType];

    if (!Component) {
      return null;
    }

    return (
      <monite.MoniteProvider api={modules.api}>
        <Component {...props} />
      </monite.MoniteProvider>
    );
  }
}

export default DefaultElement;
