import { faker } from '@faker-js/faker';

import { DemoDataGenerationMessage } from '@/lib/monite-api/demo-data-generator/generate-payables';
import { AccessToken } from '@/lib/monite-api/fetch-token';
import { createMoniteClient } from '@/lib/monite-api/monite-client';

export function getRandomItemFromArray<T = unknown>(array: Array<T>): T {
  const randomIndex = faker.number.int({ min: 0, max: array.length - 1 });

  return array[randomIndex];
}

export function getRandomProperty<T = unknown>(obj: Record<string, T>): T {
  const keys = Object.keys(obj);

  return obj[keys[(keys.length * Math.random()) << 0]];
}

export interface Logger {
  (message: DemoDataGenerationMessage): void;
}

export interface GeneralServiceConstructor {
  token: AccessToken;
  entityId: string;
  logger?: Logger;
}

export abstract class GeneralService {
  protected readonly token: AccessToken;
  protected readonly entityId: string;
  protected readonly logger?: Logger;
  protected readonly request: ReturnType<typeof createMoniteClient>;

  constructor(params: GeneralServiceConstructor) {
    this.token = params.token;
    this.entityId = params.entityId;
    this.logger = params.logger;
    this.request = createMoniteClient(params.token);
  }

  /** Should be called to set options for the service */
  public withOptions?(options: unknown): this;

  /**
   * Should be called to fetch the data by GET request
   * Mustn't be called to create the data by POST request
   */
  public getAll?(): Promise<unknown>;

  /** Should be called to create the data by POST request */
  public create?(): Promise<unknown>;
}
