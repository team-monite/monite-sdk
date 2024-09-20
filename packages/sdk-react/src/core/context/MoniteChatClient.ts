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

export type MoniteChatResponseChunk = {
  data: {
    message: string;
    timestamp: number;
  };
  thread_id: string;
  error: string;
};

export type MoniteChatClient = {
  sendMessage: (
    message: string,
    threadId: string
  ) => Promise<ReadableStream<MoniteChatResponseChunk>>;
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
    const jsonObjects = text.split(/(?<=})\s*(?={)/);

    return jsonObjects
      .map((objString) => {
        try {
          return JSON.parse(objString);
        } catch (error) {
          console.error('JSON Parse Error: ', error);
          return null;
        }
      })
      .filter((obj) => obj !== null);
  };

  const getEncoding = (response: Response) => {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    const contentType = response.headers.get('Content-Type') || 'text/plain';
    const charsetMatch = contentType.match(/charset=([^;]*)/);
    return charsetMatch ? charsetMatch[1] : 'utf-8';
  };

  const sendMessage = async (
    message: string,
    threadId: string = ''
  ): Promise<ReadableStream<MoniteChatResponseChunk>> => {
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

    const encoding = getEncoding(response);
    const decoder = new TextDecoder(encoding);

    return new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();

        try {
          for (let i = 0, maxMessageNumber = 10000; i < maxMessageNumber; i++) {
            const { value, done } = await reader.read();
            if (done) {
              controller.close();
              break;
            }

            const text = decoder.decode(value, { stream: true })?.trim() ?? '';
            const events = parseMultipleJSONObjects(text);
            if (!events.length) continue;

            if (events[events.length - 1].data === '[STREAM_DONE]') {
              controller.close();
              break;
            } else {
              events.forEach((event) => controller.enqueue(event));
            }
          }
        } catch (err) {
          controller.error(err);
        }
      },
    });
  };

  return {
    sendMessage,
  };
};
