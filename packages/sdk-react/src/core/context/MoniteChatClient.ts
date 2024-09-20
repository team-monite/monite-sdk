import { MoniteFetchToken } from '@monite/sdk-api';

export interface IMoniteChat {}

type TokenProvider = () => Promise<{
  access_token: string;
  token_type: string;
}>;

// Function to get token (from cache or request new one)
export const createTokenProvider = async (
  fetchToken: MoniteFetchToken
): Promise<TokenProvider> => {
  let tokenCache: {
    access_token: string;
    token_type: string;
  } | null = null;
  let tokenExpiryTime: number = 0;

  return async (): Promise<{
    access_token: string;
    token_type: string;
  }> => {
    const currentTime = Date.now();

    // Check if we have a token and it's not expired (with 5 seconds buffer)
    if (tokenCache && tokenExpiryTime - currentTime > 5000) {
      return tokenCache; // Return cached token
    }

    // Otherwise, fetch a new token
    const newToken = await fetchToken();
    tokenCache = {
      access_token: newToken.access_token,
      token_type: newToken.token_type,
    };
    tokenExpiryTime = Date.now() + newToken.expires_in * 1000;

    return tokenCache;
  };
};

export type MoniteChatClient = {
  sendMessage: (message: string, threadId: string) => Promise<void>;
};

export const createChatClient = ({
  chatApiUrl,
  entityId,
  fetchToken,
}: {
  chatApiUrl: string;
  entityId: string;
  fetchToken: MoniteFetchToken;
}): MoniteChatClient => {
  let _tokenProvider: TokenProvider;
  const getToken = async () => {
    if (!_tokenProvider) _tokenProvider = await createTokenProvider(fetchToken);
    return await _tokenProvider();
  };

  const parseMultipleJSONObjects = (text: string) => {
    // Split the string into potential JSON objects
    const jsonObjects = text.split(/(?<=})\s*(?={)/);

    return jsonObjects
      .map((objString) => {
        try {
          // Try parsing each object and return it if valid
          return JSON.parse(objString);
        } catch (error) {
          // Handle parse error (e.g., log or skip invalid objects)
          console.error('JSON Parse Error: ', error);
          return null; // Or handle error as needed
        }
      })
      .filter((obj) => obj !== null); // Filter out any failed parses
  };

  const sendMessage = async (message: string, threadId: string = '') => {
    const token = await getToken();
    const response = await fetch(chatApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        thread_id: threadId,
        x_monite_entity_id: entityId,
        entity_user_token: `${token.token_type} ${token.access_token}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${await response.text()}`);
    }

    // Get the content-type header
    // eslint-disable-next-line lingui/no-unlocalized-strings
    const contentType = response.headers.get('Content-Type') || 'text/plain';

    // Parse the charset from the content-type header (default to utf-8)
    const charsetMatch = contentType.match(/charset=([^;]*)/);
    const encoding = charsetMatch ? charsetMatch[1] : 'utf-8';

    // Use the correct decoder based on the encoding
    const decoder = new TextDecoder(encoding);

    const reader = response.body!.getReader();
    for (let i = 0, maxMessageNumber = 10000; i < maxMessageNumber; i++) {
      const { value, done } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true })?.trim() ?? '';
      const events = parseMultipleJSONObjects(text);
      // Handle your event (e.g., process data)
      console.log(events);

      if (
        events.length > 0 &&
        events[events.length - 1].data === '[STREAM_DONE]'
      ) {
        console.log('Stream finished');
        break;
      }
    }
  };

  return {
    sendMessage,
  };
};
