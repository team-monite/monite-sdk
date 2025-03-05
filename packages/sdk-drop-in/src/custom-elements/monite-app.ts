import {
  MoniteEventTypes,
  addMoniteEventListener,
  MONITE_EVENT_PREFIX,
  getMoniteAppElement,
  getMoniteAppEventTarget,
} from '../lib/MoniteEvents';
import { MoniteAppElement } from './MoniteAppElement';

const MONITE_APP_ELEMENT_NAME = 'monite-app';

export const registerMoniteAppElement = () => {
  customElements.define(MONITE_APP_ELEMENT_NAME, MoniteAppElement);
};

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
};

// eslint-disable-next-line import/no-default-export
export default MoniteAppElement;
