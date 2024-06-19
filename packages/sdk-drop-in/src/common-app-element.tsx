import React, { ComponentProps } from 'react';
import ReactDOM, { Root } from 'react-dom/client';

import { DropIn } from './DropIn';
import { IframeApp } from './iframe-app';

export enum NameProps {
  dropIn = 'drop-in',
  iframeApp = 'iframe-app',
}

export class CommonAppElement extends HTMLElement {
  /**
   * A record defining the types and allowed attributes that can be set on the element.
   *
   * - `router`: Allowed values are `memory | browser | hash`
   * - `basename`: Indicates the base path of your page.
   *   For example, if your app is served from `https://example.com/my-app/`, set `basename` to `/my-app` to properly resolve relative URLs.
   * - `component`: The component to render. Allowed values are `payables | receivables | counterparts | products | tags | approval-policies`
   * - `entity-id`: The ID of the entity to fetch data for.
   * - `api-url`: The URL of the API to fetch data from. Example: `https://api.snadbox.monite.com/v1`
   *
   * @static
   * @readonly
   */
  static readonly attributes: Record<
    'router' | 'basename' | 'component' | 'entity-id' | 'api-url',
    AttributeConfig
  > = {
    router: {
      type: 'string',
    },
    basename: {
      type: 'string',
    },
    component: {
      type: 'string',
    },
    'entity-id': {
      type: 'string',
    },
    'api-url': {
      type: 'string',
    },
  };

  /**
   * A record defining the types of slots that can be handled by the element.
   *
   * - `fetch-token`: A function that returns a promise resolving to an object containing the access token and its type.
   *   Example: ```
   *   <script slot="fetch-token">
   *     () => fetch('https://my-server.com/token').then((res) => res.json())
   *   </script>
   *   ```
   * - `theme`: A JSON object containing the theme to use. Example:
   *   ```
   *   <script slot="theme" type="application/json">
   *     {"fontFamily": "Comic Sans MS, Comic Sans, cursive, monospace"}
   *   </script>
   *   ```
   * - `locale`: A JSON object containing the locale to use. Example:
   *    ```
   *    <script slot="locale" type="application/json">
   *      {
   *         "code": "de-DE",
   *         "messages": { "Name, country, city": "City Test", "Payables": "My Payables" }
   *       }
   *   </script>
   *   ```
   */
  static readonly slots: Record<
    'fetch-token' | 'theme' | 'locale',
    SlotConfig
  > = {
    'fetch-token': {
      type: 'jsEval',
    },
    theme: {
      type: 'json',
    },
    locale: {
      type: 'json',
    },
  };
  private name: NameProps | undefined;

  static get observedAttributes(): (keyof (typeof CommonAppElement)['attributes'])[] {
    return ['router', 'basename', 'component', 'entity-id', 'api-url'];
  }

  private root: ShadowRoot | HTMLElement;
  private slotsData: { [key in JSONSourceSlot]?: object } | undefined;
  private isMounted = false;
  private reactAppRoot: Root | undefined;

  constructor() {
    super();
    const nameProp = this.getAttribute('name-prop') as NameProps;
    this.setupElement(nameProp);

    const templateContent =
      this.querySelector('template')?.content.cloneNode(true);

    if (templateContent) this.appendChild(templateContent);

    this.root = this.attachShadow({ mode: 'open', delegatesFocus: true });

    this.root.innerHTML = `
      <div id="monite-app-styles"></div>
      <div id="monite-app-root"></div>
    `;
  }

  setupElement(nameProp: NameProps) {
    switch (nameProp) {
      case NameProps.dropIn:
        this.name = NameProps.dropIn;
        break;
      case NameProps.iframeApp:
        this.name = NameProps.iframeApp;
        break;
      default:
        throw new Error(`Unsupported name-prop value: ${nameProp}`);
    }
  }

  getSlotsData(slots: Element[]) {
    const slotsData = slots.reduce<{ [key in JSONSourceSlot]?: object }>(
      (acc, slotElement) => {
        const slotName =
          slotElement.getAttribute('slot') || slotElement.getAttribute('name');

        if (!slotName) {
          console.error(
            `Slot ${slotElement} does not have a 'slot' or 'name' attribute, skipping...`
          );

          return acc;
        }

        const slotConfig =
          CommonAppElement.slots[
            slotName as keyof typeof CommonAppElement.slots
          ];

        if (!slotConfig) {
          console.error(
            `Slot '${slotElement}' is not a valid slot, skipping...`
          );

          return acc;
        }

        return {
          ...acc,
          ...getAssignedElementsData(slotConfig.type, {
            [slotName]: slotElement,
          }),
        };
      },
      {}
    );

    return slotsData;
  }

  connectedCallback() {
    const slots = this.querySelectorAll('slot, [slot]');
    this.slotsData = this.getSlotsData(Array.from(slots));

    slots.forEach((slot) =>
      slot.addEventListener('slotchange', this.handleSlotChange)
    );

    this.isMounted = true;
    this.render();
  }

  disconnectedCallback() {
    this.isMounted = false;

    this.root
      .querySelectorAll('slot, [slot]')
      .forEach((slot) =>
        slot.removeEventListener('slotchange', this.handleSlotChange)
      );
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  handleSlotChange(event: Event) {
    const slot = event.target;
    if (!(slot instanceof HTMLSlotElement)) return;
    this.slotsData = {
      ...this.slotsData,
      ...this.getSlotsData([slot]),
    };

    this.render();
  }

  render() {
    if (!this.isMounted) return;

    const appRootNode = this.root.querySelector('#monite-app-root');

    if (!appRootNode)
      throw new Error('#monite-app-root not found in Shadow DOM');

    const stylesRootNode = this.root.querySelector('#monite-app-styles');

    if (!stylesRootNode)
      throw new Error('#monite-app-styles not found in Shadow DOM');

    this.reactAppRoot = this.reactAppRoot || ReactDOM.createRoot(appRootNode);

    const attributesProperties = Object.entries(
      CommonAppElement.attributes
    ).reduce((acc, [attribute, attributeConfig]) => {
      const attributeCamelCase = kebabToCamelCase(attribute);
      const attributeValue = this.getAttribute(attribute);

      return {
        ...acc,
        [attributeCamelCase]: parseElementAttribute({
          attribute,
          value: attributeValue,
          config: attributeConfig,
        }),
      };
    }, {});

    const slotProperties = Object.entries(this.slotsData ?? {}).reduce(
      (acc, [slot, data]) => {
        return {
          ...acc,
          [kebabToCamelCase(slot)]: data,
        };
      },
      {}
    );

    if (this.name === NameProps.iframeApp) {
      const props = {
        ...attributesProperties,
        ...slotProperties,
      } as Omit<ComponentProps<typeof IframeApp>, 'rootElements'>;

      this.reactAppRoot.render(
        <React.StrictMode>
          <IframeApp
            {...props}
            rootElements={{
              root: appRootNode,
              styles: stylesRootNode ?? undefined,
            }}
          />
        </React.StrictMode>
      );
    }

    if (this.name === NameProps.dropIn) {
      const props = {
        ...attributesProperties,
        ...slotProperties,
      } as Omit<ComponentProps<typeof DropIn>, 'rootElements'>;

      this.reactAppRoot.render(
        <React.StrictMode>
          <DropIn
            {...props}
            rootElements={{
              root: appRootNode,
              styles: stylesRootNode ?? undefined,
            }}
          />
        </React.StrictMode>
      );
    }
  }
}

const parseElementAttribute = ({
  value,
  config,
  attribute,
}: {
  attribute: string;
  value: string | null;
  config: AttributeConfig;
}): boolean | string | null => {
  if (value === null) return null;

  if (config.type === 'string') {
    return value;
  }

  if (config.type === 'boolean') {
    return ['true', 'yes', '1', ''].includes(value.toLowerCase());
  }

  throw new Error(
    `Invalid attribute type "${config.type}" for the "${attribute}"`
  );
};

const getAssignedElementsData = <
  T extends {
    [key: string]: Element;
  }
>(
  dataType: 'json' | 'jsEval',
  jsonSourceElements: T
) => {
  return Object.entries(jsonSourceElements).reduce<{
    [key in JSONSourceSlot]?: object;
  }>((acc, [slotName, slot]) => {
    try {
      return {
        ...acc,
        [slotName]:
          dataType === 'json'
            ? JSON.parse(slot.textContent ?? '')
            : eval(slot.textContent ? `(() => ${slot.textContent})()` : ''),
      };
    } catch (error) {
      console.error(
        `Error when parsing JSON content of assigned element "${slotName}", skipping...`,
        error
      );
    }

    return acc;
  }, {});
};

export const kebabToCamelCase = (s: string): string =>
  s.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

type JSONSourceSlot = keyof (typeof CommonAppElement)['slots'];

type AttributeConfig = {
  type: 'boolean' | 'string';
};

type SlotConfig = {
  type: 'json' | 'jsEval';
};
