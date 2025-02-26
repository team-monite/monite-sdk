export abstract class MoniteAppElementBase<
  TSlot extends string
> extends HTMLElement {
  protected root: ShadowRoot | HTMLElement;
  protected slotsData: { [key in TSlot]?: object } | undefined;
  protected isMounted = false;

  abstract render(): void;

  protected abstract readonly slotsSchema: Record<TSlot, SlotConfig>;

  constructor() {
    super();

    const templateContent =
      this.querySelector('template')?.content.cloneNode(true); // custom <template> content if specified

    if (templateContent) this.appendChild(templateContent);

    this.root = this.attachShadow({ mode: 'open', delegatesFocus: true });

    this.root.innerHTML = `
      <div id="monite-app-styles">
        <style>
          :host {
            display: block;
            height: 100%;
            width: 100%;
          }
          #monite-app-root {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
          }
        </style>
      </div>
      <div id="monite-app-root"></div>
    `;
  }

  getSlotsData(slots: Element[]) {
    const slotsData = slots.reduce<{ [key in TSlot]?: object }>(
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
          this.slotsSchema[slotName as keyof typeof this.slotsSchema];

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

  attributeChangedCallback(_: string, oldValue: string, newValue: string) {
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
}

const getAssignedElementsData = <
  T extends {
    [key: string]: Element;
  }
>(
  dataType: 'json' | 'jsEval',
  jsonSourceElements: T
) => {
  return Object.entries(jsonSourceElements).reduce<{
    [key in string]?: object;
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

export const parseElementAttribute = ({
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

export type SlotConfig = {
  type: 'json' | 'jsEval';
};

export type AttributeConfig = {
  type: 'boolean' | 'string';
};
