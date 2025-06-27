import { StrictMode, ComponentProps } from 'react';
import { Root, createRoot } from 'react-dom/client';

import { MoniteApp } from '@/apps/MoniteApp';
import {
  AttributeConfig,
  MoniteAppElementBase,
  parseElementAttribute,
  SlotConfig,
} from '@/custom-elements/MoniteAppElementBase.tsx';
import { kebabToCamelCase } from '@/utils/string-utils';
import { APISchema } from '@monite/sdk-react';

export class MoniteAppElement extends MoniteAppElementBase<
  'fetch-token' | 'theme' | 'locale' | 'component-settings'
> {
  private reactAppRoot: Root | undefined;

  /**
   * A record defining the types and allowed attributes that can be set on the element.
   *
   * - `router`: Allowed values are `memory | browser | hash`
   * - `basename`: Indicates the base path of your page.
   *   For example, if your app is served from `https://example.com/my-app/`, set `basename` to `/my-app` to properly resolve relative URLs.
   * - `component`: The component to render. Allowed values are `payables | receivables | counterparts | products | tags | approval-policies | user-roles`
   * - `entity-id`: The ID of the entity to fetch data for.
   * - `api-url`: The URL of the API to fetch data from. Example: `https://api.snadbox.monite.com/v1`
   *
   * @static
   * @readonly
   */
  static readonly attributesSchema: Record<
    'disabled' | 'router' | 'basename' | 'component' | 'entity-id' | 'api-url',
    AttributeConfig
  > = {
    disabled: {
      type: 'boolean',
    },
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
   * - `component-settings`: A JSON object containing the component settings to use. Example:
   *   ```
   *   <script slot="component-settings" type="application/json">
   *     {
   *       "general": {
   *         iconWrapper: {
   *           icon: <ArrowBackIcon />,
   *           showCloseIcon: true,
   *         },
   *       },
   *     }
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
  protected readonly slotsSchema: Record<
    'fetch-token' | 'theme' | 'locale' | 'component-settings',
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
    'component-settings': {
      type: 'json',
    },
  };

  static get observedAttributes() {
    return Object.keys(
      MoniteAppElement.attributesSchema
    ) as (keyof (typeof MoniteAppElement)['attributesSchema'])[];
  }

  public fetchToken:
    | (() => Promise<APISchema.components['schemas']['AccessTokenResponse']>)
    | null = null;

  render() {
    if (!this.isMounted) return;

    const appRootNode = this.root.querySelector(
      '#monite-app-root'
    ) as HTMLElement | null;

    if (!appRootNode)
      throw new Error('#monite-app-root not found in Shadow DOM');

    const stylesRootNode = this.root.querySelector(
      '#monite-app-styles'
    ) as HTMLElement | null;

    if (!stylesRootNode)
      throw new Error('#monite-app-styles not found in Shadow DOM');

    this.reactAppRoot = this.reactAppRoot ?? createRoot(appRootNode);

    const attributesProperties = Object.entries(
      MoniteAppElement.attributesSchema
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

    const props = {
      fetchToken: this.fetchToken,
      ...attributesProperties,
      ...slotProperties,
    } as Omit<ComponentProps<typeof MoniteApp>, 'rootElements'>;

    this.reactAppRoot.render(
      <StrictMode>
        <MoniteApp
          {...props}
          rootElements={{
            root: appRootNode,
            styles: stylesRootNode ?? undefined,
          }}
        />
      </StrictMode>
    );
  }
}
