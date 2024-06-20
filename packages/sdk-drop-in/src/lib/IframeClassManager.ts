import { createAPIClient } from '@monite/sdk-react';

import { getConfig } from './ConfigLoader';

class IframeManager {
  iframe: HTMLIFrameElement | null;
  channel: MessageChannel;

  constructor(iframeId: string) {
    this.iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    this.channel = new MessageChannel();
    this.init();
  }

  async fetchTokenFromServer(): Promise<string> {
    const config = await getConfig();
    const { api, requestFn } = createAPIClient();
    const response = await api.auth.postAuthToken(
      {
        body: {
          entity_user_id: config.entity_user_id,
          client_id: config.client_id,
          client_secret: config.client_secret,
          grant_type: 'entity_user',
        },
        baseUrl: `${config.api_url}/v1`,
        parameters: {},
      },
      requestFn
    );
    return response.access_token;
  }

  init() {
    if (this.iframe) {
      this.iframe.onload = () => {
        if (this.iframe?.contentWindow) {
          this.iframe.contentWindow.postMessage({ type: 'connect' }, '*', [
            this.channel.port2,
          ]);

          this.channel.port1.onmessage = async (event) => {
            const { type } = event.data;
            if (type === 'fetch-token') {
              const token = await this.fetchTokenFromServer();
              this.channel.port1.postMessage({ type: 'token', payload: token });
            }

            // ToDo: add handling for other message types: theme, locale, etc.
          };

          this.sendMessageToIframe('theme', 'dark');
          this.sendMessageToIframe('locale', 'en');
        }
      };
    }
  }

  sendMessageToIframe(type: string, payload: any) {
    this.channel.port1.postMessage({ type, payload });
  }
}

interface IframeAppState {
  theme: string | null;
  locale: string | null;
}

class IframeAppManager {
  state: IframeAppState;
  fetchTokenResolve: ((value: string) => void) | null;
  port?: MessagePort;

  constructor() {
    this.state = {
      theme: null,
      locale: null,
    };
    this.fetchTokenResolve = null;
    this.init();
  }

  init() {
    window.addEventListener('message', (event) => this.handleMessage(event));
  }

  handleMessage(event: MessageEvent) {
    if (event.data.type === 'connect') {
      this.port = event.ports[0];
      this.port.onmessage = ({ data }) => this.handlePortMessage(data);
    }
  }

  handlePortMessage(data: { type: string; payload: any }) {
    const { type, payload } = data;

    switch (type) {
      case 'token':
        if (this.fetchTokenResolve) {
          this.fetchTokenResolve(payload);
          this.fetchTokenResolve = null;
        }
        break;
      case 'theme':
        this.state.theme = payload;
        this.updateTheme();
        break;
      case 'locale':
        this.state.locale = payload;
        this.updateLocale();
        break;
      // ToDo: add more cases as needed
    }
  }

  fetchToken(): Promise<string> {
    return new Promise((resolve) => {
      this.fetchTokenResolve = resolve;
      this.port?.postMessage({ type: 'fetch-token' });
    });
  }

  updateTheme() {
    console.log('Theme updated:', this.state.theme);
  }

  updateLocale() {
    console.log('Locale updated:', this.state.locale);
  }
}

export { IframeManager, IframeAppManager };
