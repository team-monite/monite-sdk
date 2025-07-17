const STORAGE_KEY = 'sdk-playground-data';
const API_URL_FALLBACK = 'https://api.dev.monite.com/v1';

function readStorage() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse stored data from localStorage:', error);
    return null;
  }
}

function writeStorage(value: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    console.error(
      'Failed to save login environment data to localStorage:',
      error
    );
  }
}

function getFieldFromStorage(field: string) {
  const data = readStorage();

  if (!data || !data[field]) {
    return null;
  }

  return data[field];
}
export function setLoginEnvData(value: {
  entityId?: string;
  entityUserId?: string;
  clientId?: string;
  clientSecret?: string;
}) {
  writeStorage(value);
}

export function getLoginEnvData(fromEnv: boolean = true) {
  const entityUserId =
    getFieldFromStorage('entityUserId') ??
    (fromEnv ? import.meta.env.VITE_MONITE_ENTITY_USER_ID : null);
  const entityId =
    getFieldFromStorage('entityId') ??
    (fromEnv ? import.meta.env.VITE_MONITE_ENTITY_ID : null);
  const clientId =
    getFieldFromStorage('clientId') ??
    (fromEnv ? import.meta.env.VITE_MONITE_PROJECT_CLIENT_ID : null);
  const clientSecret =
    getFieldFromStorage('clientSecret') ??
    (fromEnv ? import.meta.env.VITE_MONITE_PROJECT_CLIENT_SECRET : null);

  const apiUrl = import.meta.env.VITE_MONITE_API_URL ?? API_URL_FALLBACK;

  return {
    entityUserId,
    entityId,
    clientId,
    clientSecret,
    apiUrl,
  };
}
