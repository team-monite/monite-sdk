import { authenticationTokenFixture } from './mocks';
import { MoniteSDK } from './moniteSDK';
import { AccessTokenResponse, GrantType, ObtainTokenPayload } from './old-api';
import { ApiError } from './old-api/ApiError';
import { apiVersion } from './old-api/apiVersion';
import { packageVersion } from './packageVersion';

const fetchTokenMockWithImplementation =
  (mock: jest.Mock, config?: Partial<ObtainTokenPayload>) =>
  async (): Promise<AccessTokenResponse> => {
    mock();

    const request: ObtainTokenPayload = Object.assign(
      {
        grant_type: GrantType.ENTITY_USER,
        client_id: 'SECRET_CLIENT_ID',
        client_secret: 'SECRET_CLIENT_SECRET',
        entity_user_id: 'SECRET_ENTITY_USER_ID',
      },
      config
    );

    const response = await fetch(
      'https://api.sandbox.monite.com/v1/auth/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      // do not rely on the error returned by `fetchToken()`,
      // it's implemented by the customer, it can throw whatever it wants
      throw new Error('FetchToken mock callback error');
    }

    return await response.json();
  };

const generateRandomId = () => (Math.random() + 1).toString(36).substring(2);
const defaultFetchTokenMock = () =>
  Promise.resolve({
    access_token: 'MY_PRIVATE_TOKEN',
    token_type: 'Bearer',
    expires_in: 86400,
  });

describe('MoniteSDK', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('# Initialize MoniteSDK', () => {
    test('should check that if the user does not pass "fetchToken" required parameter the error will be thrown', () => {
      expect(
        () =>
          new MoniteSDK({
            entityId: generateRandomId(),

            // @ts-expect-error Expect that the user does not support TypeScript and didn't pass `fetchToken`
            fetchToken: undefined,
          })
      ).toThrowError('MoniteSDK: fetchToken and entityId are required');
    });

    test('should check that if the user does not pass "entityId" required parameter the error will be thrown', () => {
      expect(
        () =>
          new MoniteSDK({
            fetchToken: defaultFetchTokenMock,

            // @ts-expect-error Expect that the user does not support TypeScript and didn't pass `fetchToken`
            entityId: undefined,
          })
      ).toThrowError('MoniteSDK: fetchToken and entityId are required');
    });

    test('should make request to production API when the user provided production "apiUrl"', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const monite = new MoniteSDK({
        entityId: generateRandomId(),
        fetchToken: defaultFetchTokenMock,
        apiUrl: 'https://api.monite.com/v1',
      });

      await monite.api.receivable.getAllReceivables();

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.monite.com/v1/receivables?limit=100',
        expect.anything()
      );
    });

    test('should make request to sandbox API when the user provided sandbox "apiUrl"', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const monite = new MoniteSDK({
        entityId: generateRandomId(),
        fetchToken: defaultFetchTokenMock,
        apiUrl: 'https://api.sandbox.monite.com/v1',
      });

      await monite.api.receivable.getAllReceivables();

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.sandbox.monite.com/v1/receivables?limit=100',
        expect.anything()
      );
    });

    test('should make request to dev API when the user provided dev "apiUrl"', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      const monite = new MoniteSDK({
        entityId: generateRandomId(),
        fetchToken: defaultFetchTokenMock,
        apiUrl: 'https://api.dev.monite.com/v1',
      });

      await monite.api.receivable.getAllReceivables();

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.dev.monite.com/v1/receivables?limit=100',
        expect.anything()
      );
    });

    test('should create monite app with required fields', () => {
      const monite = new MoniteSDK({
        fetchToken: defaultFetchTokenMock,
        entityId: generateRandomId(),
      });

      expect(monite).toBeInstanceOf(MoniteSDK);
    });
  });

  describe('# Headers', () => {
    test('should send "Authorization" as Bearer token when the user initiate any HTTP request', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');
      const entityId = generateRandomId();

      const monite = new MoniteSDK({
        fetchToken: defaultFetchTokenMock,
        entityId,
      });

      await monite.api.receivable.getAllReceivables();

      expect(fetchSpy).toHaveBeenCalled();

      const [, config] = fetchSpy.mock.calls[0];

      expect(config?.headers).toEqual(
        expect.arrayContaining([
          ['Accept', 'application/json'],
          ['Authorization', 'Bearer MY_PRIVATE_TOKEN'],
          ['x-monite-entity-id', entityId],
          ['x-monite-version', apiVersion],
          ['x-monite-sdk-version', packageVersion],
        ])
      );
    });

    test('should send additional headers when the user initiate any HTTP request', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');
      const entityId = generateRandomId();

      const monite = new MoniteSDK({
        fetchToken: defaultFetchTokenMock,
        entityId,
        headers: {
          'my-additional-header': 'MY_USER_ID',
        },
      });

      await monite.api.receivable.getAllReceivables();

      expect(fetchSpy).toHaveBeenCalled();

      const [, config] = fetchSpy.mock.calls[0];

      expect(config?.headers).toEqual(
        expect.arrayContaining([
          ['Accept', 'application/json'],
          ['Authorization', 'Bearer MY_PRIVATE_TOKEN'],
          ['x-monite-entity-id', entityId],
          ['x-monite-version', apiVersion],
          ['x-monite-sdk-version', packageVersion],
          ['my-additional-header', 'MY_USER_ID'],
        ])
      );
    });

    test('should rewrite current headers when the user pass the same header as SDK already has', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');
      const entityId = generateRandomId();

      const monite = new MoniteSDK({
        fetchToken: defaultFetchTokenMock,
        entityId,
        headers: {
          'x-monite-version': 'MY_UPDATED_BACKEND_VERSION',
        },
      });

      await monite.api.receivable.getAllReceivables();

      expect(fetchSpy).toHaveBeenCalled();

      const [, config] = fetchSpy.mock.calls[0];

      expect(config?.headers).toEqual(
        expect.arrayContaining([
          ['Accept', 'application/json'],
          ['Authorization', 'Bearer MY_PRIVATE_TOKEN'],
          ['x-monite-entity-id', entityId],
          ['x-monite-version', 'MY_UPDATED_BACKEND_VERSION'],
          ['x-monite-sdk-version', packageVersion],
        ])
      );
    });

    test('should NOT rewrite header "x-monite-sdk-version" when the user pass the same header as SDK already has', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');
      const entityId = generateRandomId();

      const monite = new MoniteSDK({
        fetchToken: defaultFetchTokenMock,
        entityId,
        headers: {
          'x-monite-sdk-version': 'MY_UPDATED_SDK_VERSION',
        },
      });

      await monite.api.receivable.getAllReceivables();

      expect(fetchSpy).toHaveBeenCalled();

      const [, config] = fetchSpy.mock.calls[0];

      const headers = config?.headers as string[][] | undefined;

      const sdkVersionHeader = headers?.find(
        ([key]) => key === 'x-monite-sdk-version'
      );
      expect(sdkVersionHeader?.[1]).toEqual(packageVersion);
    });
  });

  describe('# Authentication', () => {
    test('should fetch user token when the any first HTTP request has been made', async () => {
      let authTokenResponse: AccessTokenResponse | undefined = undefined;

      const monite = new MoniteSDK({
        entityId: generateRandomId(),
        fetchToken: async () => {
          const request: ObtainTokenPayload = {
            grant_type: GrantType.ENTITY_USER,
            client_id: 'SECRET_CLIENT_ID',
            client_secret: 'SECRET_CLIENT_SECRET',
            entity_user_id: 'SECRET_ENTITY_USER_ID',
          };

          const response = await fetch(
            'https://api.sandbox.monite.com/v1/auth/token',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(request),
            }
          );

          return (authTokenResponse = await response.json());
        },
      });

      /** Here we should fetch the first token */
      await monite.api.receivable.getAllReceivables();

      expect(authTokenResponse).toEqual(authenticationTokenFixture);
    });

    test('should fetch token once when the first request is made', async () => {
      const fetchTokenSpy = jest
        .fn()
        .mockResolvedValue(authenticationTokenFixture);

      const monite = new MoniteSDK({
        entityId: generateRandomId(),
        fetchToken: fetchTokenSpy,
      });

      /** Here we should fetch the first token */
      await monite.api.receivable.getAllReceivables();
      expect(fetchTokenSpy).toHaveBeenCalledTimes(1);

      /** Here we should NOT fetch the token again */
      await monite.api.receivable.getAllReceivables();
      expect(fetchTokenSpy).toHaveBeenCalledTimes(1);
    });

    test('should fetch token once when several requests is made at the same time', async () => {
      const fetchTokenMock = jest.fn();

      const monite = new MoniteSDK({
        entityId: generateRandomId(),
        fetchToken: fetchTokenMockWithImplementation(fetchTokenMock),
      });

      /** Make 3 request at one time. BUT `fetchToken` must be called only once */
      await Promise.all([
        monite.api.receivable.getAllReceivables(),
        monite.api.receivable.getAllReceivables(),
        monite.api.receivable.getAllReceivables(),
      ]);

      expect(fetchTokenMock).toHaveBeenCalledTimes(1);
    });

    test('should re-fetch token when the server respond with "token has been revoked" error on initialization', async () => {
      const fetchTokenMock = jest.fn();
      let iterationTimes = 0;

      const monite = new MoniteSDK({
        entityId: 'token_expired',

        fetchToken: () => {
          if (++iterationTimes === 2) {
            return fetchTokenMockWithImplementation(fetchTokenMock)();
          }

          // Simulate `getAllReceivables()` response with "token has been revoked" error
          throw new ApiError(
            {
              ok: false,
              status: 400,
              statusText: 'Bad Request',
              body: {
                error: {
                  message: 'The token has been revoked, expired or not found.',
                },
              },
            },
            'Fetch token error'
          );
        },
      });

      await monite.api.receivable.getAllReceivables();

      expect(fetchTokenMock).toHaveBeenCalledTimes(1);
    });

    test('should re-fetch token ones and do not fall into recursion when the server respond with any error on initialization', async () => {
      const fetchTokenMock = jest.fn();

      const monite = new MoniteSDK({
        entityId: 'token_expired',

        /** This request should fail over and over again. We have to handle it in our SDK */
        fetchToken: fetchTokenMockWithImplementation(fetchTokenMock, {
          entity_user_id: 'random_error',
        }),
      });

      expect(monite.api.receivable.getAllReceivables()).rejects.toThrowError();

      expect(fetchTokenMock).toHaveBeenCalledTimes(1);
    });

    test('should re-fetch token when the server respond with "token has been revoked" error after some time', async () => {
      const fetchTokenMock = jest.fn();

      const monite = new MoniteSDK({
        entityId: generateRandomId(),
        fetchToken: fetchTokenMockWithImplementation(fetchTokenMock),
      });

      /** Get All receivables called with correct result */
      await monite.api.receivable.getAllReceivables();
      expect(fetchTokenMock).toHaveBeenCalledTimes(1);

      /** Get receivable by id called with correct result */
      await monite.api.receivable.getById(generateRandomId());
      expect(fetchTokenMock).toHaveBeenCalledTimes(1);

      /**
       * Get receivable by id called but got `Token Expired` error
       * We expect that `fetchTokenMock` will be called again to fetch new token
       */
      await monite.api.receivable.getById('token_expired');
      expect(fetchTokenMock).toHaveBeenCalledTimes(2);

      /** After expired token has been fe-fetched we shouldn't call `fetchToken` again */
      await monite.api.receivable.getById(generateRandomId());
      expect(fetchTokenMock).toHaveBeenCalledTimes(2);
    });

    test('should re-fetch token when the server respond with "token has been revoked" and do not fall into recurssion', async () => {
      const fetchTokenMock = jest.fn();

      const monite = new MoniteSDK({
        entityId: generateRandomId(),
        fetchToken: fetchTokenMockWithImplementation(fetchTokenMock),
      });

      /** Get receivable by id called with a correct result */
      await monite.api.receivable.getById(generateRandomId());
      expect(fetchTokenMock).toHaveBeenCalledTimes(1);

      /**
       * This request should fail over and over again.
       * It will end up with error by itself, simulating a token expiration
       */
      await expect(async () =>
        monite.api.receivable.getById('token_expired_permanently')
      ).rejects.toThrow('');

      expect(fetchTokenMock).toHaveBeenCalledTimes(3);

      /**
       * After the expired token has been refetched we shouldn't call `fetchToken` again.
       * For the previous request token was not expired (expiration simulated by `getById` request)
       * */
      await monite.api.receivable.getById(generateRandomId());
      expect(fetchTokenMock).toHaveBeenCalledTimes(3);
    });

    test('token invalidation runs once when the server responds with "token has been expired, revoked" error', async () => {
      const fetchTokenMock = jest.fn();

      const monite = new MoniteSDK({
        entityId: generateRandomId(),
        fetchToken: fetchTokenMockWithImplementation(fetchTokenMock),
      });

      /** Get receivable by id called with token expired error */
      await Promise.all([
        monite.api.receivable.getById(generateRandomId()),
        monite.api.receivable.getById(generateRandomId()),
        monite.api.receivable.getById(generateRandomId()),
      ]);

      expect(fetchTokenMock).toHaveBeenCalledTimes(1);

      /** Get receivable by id called with token expired error */
      await Promise.all([
        monite.api.receivable.getById(`token_expired-${generateRandomId()}`),
        monite.api.receivable.getById(`token_expired-${generateRandomId()}`),
        monite.api.receivable.getById(`token_expired-${generateRandomId()}`),
      ]);

      expect(fetchTokenMock).toHaveBeenCalledTimes(2);
    });
  });
});
