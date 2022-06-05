import * as monite from '@monite/react-kit';

import componentsMap from '../components';
import UIElement from '../components/UIElement';
import DefaultElement from '../components/DefaultElement';

type CoreOptions = monite.MoniteAppConfig;

class Core {
  components = [];
  public app: monite.MoniteApp;

  constructor(config: CoreOptions) {
    this.create = this.create.bind(this);

    this.app = new monite.MoniteApp(config);
    Object.assign(this, this.app);
  }

  create(componentType, options) {
    const props = {
      ...options,
      modules: {
        monite: this.app,
      },
    };
    return componentType ? this.handleCreate(componentType, props) : null;
  }

  handleCreate(componentType, props = {}) {
    const isValidClass = componentType.prototype instanceof UIElement;

    if (isValidClass) {
      const component = new componentType({ ...props });

      return component;
    }

    if (typeof componentType === 'string') {
      if (componentsMap[componentType]) {
        return this.handleCreate(componentsMap[componentType], {
          ...props,
        });
      }

      if (monite[componentType]) {
        return this.handleCreate(DefaultElement, {
          ...props,
          componentType,
        });
      }
    }

    return null;
  }
}

export default Core;
