import { ApiError } from './ApiError';
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';
import { CancelablePromise } from './CancelablePromise';
import type { OnCancel } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';
import { OpenAPI } from './OpenAPI';

const isDefined = <T>(
  value: T | null | undefined
): value is Exclude<T, null | undefined> => {
  return value !== undefined && value !== null;
};

const isString = (value: any): value is string => {
  return typeof value === 'string';
};

const isStringWithValue = (value: any): value is string => {
  return isString(value) && value !== '';
};

const isBlob = (value: any): value is Blob => {
  return (
    typeof value === 'object' &&
    typeof value.type === 'string' &&
    typeof value.stream === 'function' &&
    typeof value.arrayBuffer === 'function' &&
    typeof value.constructor === 'function' &&
    typeof value.constructor.name === 'string' &&
    /^(Blob|File)$/.test(value.constructor.name) &&
    /^(Blob|File)$/.test(value[Symbol.toStringTag])
  );
};

const isFormData = (value: any): value is FormData => {
  return value instanceof FormData;
};

const base64 = (str: string): string => {
  try {
    return btoa(str);
  } catch (err) {
    // @ts-ignore
    return Buffer.from(str).toString('base64');
  }
};

const getQueryString = (params: Record<string, any>): string => {
  const qs: string[] = [];

  const append = (key: string, value: any) => {
    qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  };

  const process = (key: string, value: any) => {
    if (isDefined(value)) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          process(key, v);
        });
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([k, v]) => {
          process(`${key}[${k}]`, v);
        });
      } else {
        append(key, value);
      }
    }
  };

  Object.entries(params).forEach(([key, value]) => {
    process(key, value);
  });

  if (qs.length > 0) {
    return `?${qs.join('&')}`;
  }

  return '';
};

const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
  const encoder = config.ENCODE_PATH || encodeURI;

  const path = options.url.replace(
    /{(.*?)}/g,
    (substring: string, group: string) => {
      if (options.path?.hasOwnProperty(group)) {
        return encoder(String(options.path[group]));
      }
      return substring;
    }
  );

  const url = `${config.BASE}${path}`;
  if (options.query) {
    return `${url}${getQueryString(options.query)}`;
  }
  return url;
};

const getFormData = (options: ApiRequestOptions): FormData | undefined => {
  if (options.formData) {
    const formData = new FormData();

    const process = (key: string, value: any) => {
      if (isString(value) || isBlob(value)) {
        formData.append(key, value);
      } else {
        formData.append(key, JSON.stringify(value));
      }
    };

    Object.entries(options.formData)
      .filter(([_, value]) => isDefined(value))
      .forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => process(key, v));
        } else {
          process(key, value);
        }
      });

    return formData;
  }
  return undefined;
};

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;

const resolve = async <T>(
  options: ApiRequestOptions,
  resolver: T | Resolver<T>
): Promise<T> => {
  if (typeof resolver === 'function') {
    return (resolver as Resolver<T>)(options);
  }
  return resolver;
};

const getHeaders = async (
  openApi: OpenAPI,
  options: ApiRequestOptions,
  invalidateToken = false
): Promise<Headers> => {
  const accessToken = await openApi.getOrFetchToken(invalidateToken);
  const token = accessToken.access_token;
  const username = await resolve(options, openApi.config.USERNAME);
  const password = await resolve(options, openApi.config.PASSWORD);
  const additionalHeaders = await resolve(options, openApi.config.HEADERS);

  const headers = Object.entries({
    Accept: 'application/json',
    ...options.headers,
    ...additionalHeaders,
  })
    .filter(([_, value]) => isDefined(value))
    .reduce(
      (headers, [key, value]) => ({
        ...headers,
        [key]: String(value),
      }),
      {} as Record<string, string>
    );

  if (!('Authorization' in headers)) {
    if (isStringWithValue(token)) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (isStringWithValue(username) && isStringWithValue(password)) {
      const credentials = base64(`${username}:${password}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }
  }

  if (options.body) {
    if (options.mediaType) {
      headers['Content-Type'] = options.mediaType;
    } else if (isBlob(options.body)) {
      headers['Content-Type'] = options.body.type || 'application/octet-stream';
    } else if (isString(options.body)) {
      headers['Content-Type'] = 'text/plain';
    } else if (!isFormData(options.body)) {
      headers['Content-Type'] = 'application/json';
    }
  }

  return new Headers(headers);
};

const getRequestBody = (options: ApiRequestOptions): any => {
  if (options.body) {
    if (options.mediaType?.includes('/json')) {
      return JSON.stringify(options.body);
    } else if (
      isString(options.body) ||
      isBlob(options.body) ||
      isFormData(options.body)
    ) {
      return options.body;
    } else {
      return JSON.stringify(options.body);
    }
  }
  return undefined;
};

const sendRequest = async (
  config: OpenAPIConfig,
  options: ApiRequestOptions,
  url: string,
  body: any,
  formData: FormData | undefined,
  headers: Headers,
  onCancel: OnCancel
): Promise<Response> => {
  const controller = new AbortController();

  const request: RequestInit = {
    headers,
    body: body ?? formData,
    method: options.method,
    signal: controller.signal,
  };

  if (config.WITH_CREDENTIALS) {
    request.credentials = config.CREDENTIALS;
  }

  onCancel(() => controller.abort());

  return await fetch(url, request);
};

const getResponseHeader = (
  response: Response,
  responseHeader?: string
): string | undefined => {
  if (responseHeader) {
    const content = response.headers.get(responseHeader);
    if (isString(content)) {
      return content;
    }
  }
  return undefined;
};

const getResponseBody = async (response: Response): Promise<any> => {
  if (response.status !== 204) {
    const contentType = response.headers.get('Content-Type');
    if (contentType) {
      const isJSON = contentType.toLowerCase().startsWith('application/json');
      if (isJSON) {
        return await response.json();
      } else {
        return await response.text();
      }
    }
  }

  return undefined;
};

const catchErrorCodes = (
  options: ApiRequestOptions,
  result: ApiResult
): void => {
  const errors: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    422: `Invalid data provided`,
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    ...options.errors,
  };

  const defaultError = errors[result.status];
  const error = result.body?.error?.message ?? defaultError;

  if (error) {
    throw new ApiError(result, error);
  }

  if (!result.ok) {
    throw new ApiError(result, 'Generic Error');
  }
};

const failedRequestCounters = new WeakMap<ApiRequestOptions, number>();

/**
 * Request method
 *
 * @param openApi The OpenAPI configuration object
 * @param options The request options from the service
 * @param invalidateToken Refetch the access token
 *
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
export const request = <T>(
  options: ApiRequestOptions,
  openApi: OpenAPI,
  invalidateToken = false
): CancelablePromise<T> => {
  return new CancelablePromise(async (resolve, reject, onCancel) => {
    try {
      const url = getUrl(openApi.config, options);
      const formData = getFormData(options);
      const body = getRequestBody(options);
      const headers = await getHeaders(openApi, options, invalidateToken);

      if (!onCancel.isCancelled) {
        const response = await sendRequest(
          openApi.config,
          options,
          url,
          body,
          formData,
          headers,
          onCancel
        );
        const responseBody = await getResponseBody(response);
        const responseHeader = getResponseHeader(
          response,
          options.responseHeader
        );

        const result: ApiResult = {
          url,
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          body: responseHeader ?? responseBody,
        };

        catchErrorCodes(options, result);

        resolve(result.body);
      }
    } catch (error: ApiError | Error | unknown) {
      if (ApiError.isAuthExpiredError(error)) {
        const retry = failedRequestCounters.get(options) ?? 0;

        if (retry >= 2) {
          return reject(
            new Error('[MoniteSDK] Could not fetch authentication token')
          );
        }

        failedRequestCounters.set(options, retry + 1);

        return resolve(
          request(options, openApi, true).then((result) => {
            failedRequestCounters.delete(options);
            return result as T;
          })
        );
      }

      reject(error);
    }
  });
};
