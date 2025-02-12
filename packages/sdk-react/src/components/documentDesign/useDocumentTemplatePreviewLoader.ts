import { components } from '@/api';
import { Services } from '@/api/services';
import { useMoniteContext, FetchToken } from '@/core/context/MoniteContext';

type FetchPdfPreviewParams = {
  apiUrl: string;
  api: Services;
  entityId: string;
  version: string;
  id: string;
  token: string;
};

const getTokenCaller = (fetchToken: FetchToken): (() => Promise<string>) => {
  let expiresAt: number;
  let token: string;
  let promise: null | Promise<{ access_token: string; expires_in: number }>;

  return async () => {
    const now = Date.now();

    if (!promise && (!expiresAt || expiresAt < now)) {
      promise = fetchToken();
    }

    if (promise) {
      const { access_token, expires_in } = await promise;

      expiresAt = now + expires_in;
      token = access_token;

      promise = null;
    }

    return token;
  };
};

const pdfPreveiwStore: Record<string, string> = {};

const getPdfPreview = async ({
  apiUrl,
  api,
  entityId,
  version,
  id,
  token,
}: FetchPdfPreviewParams): Promise<string> => {
  const path =
    api.documentTemplates.getDocumentTemplatesIdPreview.schema.url.replace(
      /{(.*?)}/g,
      id
    );

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const authorisation = `Bearer ${token}`;

  const response = await fetch(`${apiUrl}${path}`, {
    headers: {
      Authorization: authorisation,
      'x-monite-entity-id': entityId,
      'x-monite-version': version,
    },
  });

  const blob = await response.blob();
  pdfPreveiwStore[id] = URL.createObjectURL(blob);

  return pdfPreveiwStore[id];
};

export const useDocumentTemplatePreviewLoader = () => {
  const { api, fetchToken, apiUrl, entityId, version } = useMoniteContext();
  const tokenCaller = getTokenCaller(fetchToken);

  const getPreview = async (
    id: components['schemas']['TemplateReceivableResponse']['id']
  ) => {
    if (pdfPreveiwStore[id]) return pdfPreveiwStore[id];

    const token = await tokenCaller();
    const preview = await getPdfPreview({
      api,
      apiUrl,
      entityId,
      version,
      id,
      token,
    });

    return preview;
  };

  return {
    getPreview,
  };
};
