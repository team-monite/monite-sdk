import { OpenAPI } from '../OpenAPI';

export abstract class CommonService {
  protected readonly openApi: OpenAPI;

  constructor(openApi: OpenAPI) {
    this.openApi = openApi;
  }
}
