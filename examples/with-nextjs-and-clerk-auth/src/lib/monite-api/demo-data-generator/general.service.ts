import { faker } from '@faker-js/faker';

import { DemoDataGenerationMessage } from '@/lib/monite-api/demo-data-generator/generate-payables';
import { AccessToken } from '@/lib/monite-api/fetch-token';
import {
  createMoniteClient,
  getMoniteApiVersion,
} from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';


export function getRandomItemFromArray<T = unknown>(array: Array<T>): T {
  const randomIndex = faker.number.int({ min: 0, max: array.length - 1 });

  return array[randomIndex];
}

export function getRandomProperty<T = unknown>(obj: Record<string, T>): T {
  const keys = Object.keys(obj);

  return obj[keys[(keys.length * Math.random()) << 0]];
}

export interface ILogger {
  (message: DemoDataGenerationMessage): void;
}

export interface IGeneralServiceConstructor {
  token: AccessToken;
  entityId: string;
  logger?: ILogger;
}

export abstract class GeneralService {
  protected readonly token: AccessToken;
  protected readonly entityId: string;
  protected readonly logger?: ILogger;
  protected readonly request: ReturnType<typeof createMoniteClient>;
  private cachedEntity:
    | components['schemas']['EntityOrganizationResponse']
    | undefined;

  constructor(params: IGeneralServiceConstructor) {
    this.token = params.token;
    this.entityId = params.entityId;
    this.logger = params.logger;
    this.request = createMoniteClient({
      headers: {
        Authorization: `${params.token.token_type} ${params.token.access_token}`,
      },
    });
  }

  protected async getEntity(): Promise<
    components['schemas']['EntityOrganizationResponse']
  > {
    if (this.cachedEntity) return this.cachedEntity;

    const entityResponse = await this.request.GET(`/entities/{entity_id}`, {
      params: {
        path: { entity_id: this.entityId },
        header: {
          'x-monite-version': getMoniteApiVersion(),
        },
      },
    });

    if (entityResponse.error) {
      console.error(
        `Failed to fetch entity details when creating Receivables for the entity_id: "${this.entityId}"`,
        `x-request-id: ${entityResponse.response.headers.get('x-request-id')}`
      );

      throw new Error(
        `Bank account create failed: ${JSON.stringify(entityResponse.error)}`
      );
    }

    const entity =
      entityResponse.data as components['schemas']['EntityOrganizationResponse'];
    this.cachedEntity = entity;
    return entity;
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
