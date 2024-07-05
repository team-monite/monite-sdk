import {
  AttributeConfig,
  MoniteAppElementBase,
  parseElementAttribute,
  SlotConfig,
} from '@/custom-elements/MoniteAppElementBase';
import { MoniteIframeAppCommunicator } from '@/lib/MoniteIframeAppCommunicator';

export class MoniteIframeAppElement extends MoniteAppElementBase<
  'fetch-token' | 'theme' | 'locale'
> {
  private iframeAppRoot: HTMLIFrameElement | undefined;
  private communicator?: MoniteIframeAppCommunicator | undefined;

  /**
   * A record defining the types and allowed attributes that can be set on the element.
   *
   * - `component`: The component to render. Allowed values are `payables | receivables | counterparts | products | tags | approval-policies`
   * - `app-url`: The URL of the Monite Iframe App. Example: `https://cdn.monite.com/monite-iframe-app` or `https://cdn.sandbox.monite.com/monite-iframe-app`
   *
   * @static
   * @readonly
   */
  static readonly attributesSchema: Record<
    'disabled' | 'component' | 'app-url' | 'style',
    AttributeConfig
  > = {
    disabled: {
      type: 'boolean',
    },
    component: {
      type: 'string',
    },
    'app-url': {
      type: 'string',
    },
    style: {
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
  protected readonly slotsSchema: Record<
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

  static get observedAttributes() {
    return Object.keys(
      MoniteIframeAppElement.attributesSchema
    ) as (keyof (typeof MoniteIframeAppElement)['attributesSchema'])[];
  }

  render() {
    if (!this.isMounted) return;

    const appRootNode = this.root.querySelector('#monite-app-root');

    if (!appRootNode)
      throw new Error('#monite-app-root not found in Shadow DOM');

    const stylesRootNode = this.root.querySelector('#monite-app-styles');

    if (!stylesRootNode)
      throw new Error('#monite-app-styles not found in Shadow DOM');

    const attributesProperties = Object.entries(
      MoniteIframeAppElement.attributesSchema
    ).reduce<
      Partial<
        Record<
          keyof (typeof MoniteIframeAppElement)['attributesSchema'],
          ReturnType<typeof parseElementAttribute>
        >
      >
    >((acc, [attribute, attributeConfig]) => {
      const attributeValue = this.getAttribute(attribute);

      return {
        ...acc,
        [attribute]: parseElementAttribute({
          attribute,
          value: attributeValue,
          config: attributeConfig,
        }),
      };
    }, {});

    if (attributesProperties['disabled']) {
      return;
    }

    this.iframeAppRoot =
      this.iframeAppRoot ||
      (() => {
        const iframeNode = document.createElement('iframe');
        iframeNode.id = 'monite-iframe-app';
        iframeNode.style.border = 'none';
        iframeNode.style.width = '100%';
        iframeNode.style.height = '100%';
        appRootNode.appendChild(iframeNode);
        this.communicator = new MoniteIframeAppCommunicator(iframeNode);
        this.communicator.connect();
        return iframeNode;
      })();

    if (!this.slotsData?.['fetch-token'])
      throw new Error('Monite Iframe App: Slot "fetch-token" is required');

    this.communicator?.mountSlot('fetch-token', this.slotsData['fetch-token']);
    this.communicator?.mountSlot('locale', this.slotsData['locale']);
    this.communicator?.mountSlot('theme', this.slotsData['theme']);

    const iframeSrc = `${attributesProperties['app-url']}/${attributesProperties['component']}`;

    if (
      !this.iframeAppRoot.src ||
      this.getPathname(iframeSrc) !== this.getPathname(this.iframeAppRoot.src)
    ) {
      this.iframeAppRoot.src = iframeSrc;
    }

    appRootNode.setAttribute(
      'style',
      attributesProperties['style'] ? String(attributesProperties['style']) : ''
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.querySelector('#monite-app-styles')?.insertAdjacentHTML(
      'beforeend',
      `
        <style>
          #monite-app-root { height: 100%; overflow: hidden }
          :host { height: 100% }
        </style>
      `
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.communicator?.disconnect();
  }

  protected getPathname(url: string) {
    if (url.startsWith('//')) return new URL(`http:${url}`).pathname;
    return new URL(url).pathname;
  }
}
