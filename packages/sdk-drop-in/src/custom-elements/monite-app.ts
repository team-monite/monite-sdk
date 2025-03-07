import { ComponentProps } from 'react';

import { WidgetType } from '@/apps/MoniteApp';
import type { APISchema, MoniteProvider } from '@monite/sdk-react';

import {
  MoniteEventTypes,
  addMoniteEventListener,
  MONITE_EVENT_PREFIX,
  getMoniteAppElement,
  getMoniteAppEventTarget,
} from '../lib/MoniteEvents';
import { MoniteAppElement } from './MoniteAppElement';

const MONITE_APP_ELEMENT_NAME = 'monite-app';

customElements.define(MONITE_APP_ELEMENT_NAME, MoniteAppElement);

interface MoniteAppElementConfig {
  /**
   * Entity ID
   * @type {string}
   */
  entityId: string;

  /**
   * API URL
   * @type {string}
   */
  apiUrl: string;

  /**
   * Function to fetch the access token
   * @returns {Promise<APISchema.components['schemas']['AccessTokenResponse']>}
   */
  fetchToken:
    | string
    | (() => Promise<APISchema.components['schemas']['AccessTokenResponse']>);

  /**
   * Locale overrides
   * @type {string}
   */
  locale?: ComponentProps<typeof MoniteProvider>['locale'];

  /**
   * Theme overrides
   * @type {ThemeConfig}
   */
  theme?: ComponentProps<typeof MoniteProvider>['theme'];

  /**
   * Component settings overrides
   * @type {ComponentSettings}
   */
  componentSettings?: ComponentProps<
    typeof MoniteProvider
  >['componentSettings'];
}

class MoniteDropin {
  private moniteAppElement: HTMLElement;
  private config: MoniteAppElementConfig;
  private events: Partial<Record<MoniteEventTypes, () => void>> = {};

  constructor(config: MoniteAppElementConfig) {
    this.config = config;
    this.moniteAppElement = document.createElement(
      MONITE_APP_ELEMENT_NAME
    ) as HTMLElement;
  }

  public create(component: WidgetType) {
    this.moniteAppElement.setAttribute('entity-id', this.config.entityId);
    this.moniteAppElement.setAttribute('api-url', this.config.apiUrl);
    this.moniteAppElement.setAttribute('component', component);
    this.moniteAppElement.setAttribute('basename', '/');

    // Add fetch-token script
    const fetchTokenScript = document.createElement('script');
    fetchTokenScript.setAttribute('slot', 'fetch-token');
    fetchTokenScript.setAttribute('type', 'application/javascript');
    fetchTokenScript.textContent = this.config.fetchToken.toString();
    this.moniteAppElement.appendChild(fetchTokenScript);

    // Add locale script
    const localeScript = document.createElement('script');
    localeScript.setAttribute('slot', 'locale');
    localeScript.setAttribute('type', 'application/json');
    localeScript.textContent = JSON.stringify(this.config.locale);
    this.moniteAppElement.appendChild(localeScript);

    // Add theme script
    const themeScript = document.createElement('script');
    themeScript.setAttribute('slot', 'theme');
    themeScript.setAttribute('type', 'application/json');
    themeScript.textContent = JSON.stringify(this.config.theme);
    this.moniteAppElement.appendChild(themeScript);

    // Add component settings script
    const componentSettingsScript = document.createElement('script');
    componentSettingsScript.setAttribute('slot', 'component-settings');
    componentSettingsScript.setAttribute('type', 'application/json');
    componentSettingsScript.textContent = JSON.stringify(
      this.config.componentSettings
    );
    this.moniteAppElement.appendChild(componentSettingsScript);

    return this;
  }

  public mount(container: HTMLElement) {
    container.appendChild(this.moniteAppElement);
    return this;
  }

  public on(event: MoniteEventTypes, callback: (event: CustomEvent) => void) {
    this.events[event] = addMoniteEventListener(
      event,
      callback,
      this.moniteAppElement
    );
    return this;
  }

  public off(event: MoniteEventTypes) {
    this.events[event]?.();
    return this;
  }
}

export {
  /** Custom element class for Monite App */
  MoniteAppElement,

  /** Custom element name for Monite App */
  MONITE_APP_ELEMENT_NAME,

  /** Available event types that can be emitted by Monite App */
  MoniteEventTypes,

  /** Helper function to add event listeners to Monite App events */
  addMoniteEventListener,

  /** Prefix used for all Monite App events */
  MONITE_EVENT_PREFIX,

  /** Gets the Monite App element from the DOM */
  getMoniteAppElement,

  /** Gets the event target element for Monite App events */
  getMoniteAppEventTarget,

  /** Monite Dropin factory function */
  MoniteDropin,
};
