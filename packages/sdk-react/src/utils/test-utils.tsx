import { ReactElement, ReactNode, useEffect } from 'react';

import { createAPIClient } from '@/api/client';
import { getDefaultComponentSettings } from '@/core/componentSettings';
import { getLocaleWithDefaults } from '@/core/context/i18nUtils';
import { MoniteAPIProvider } from '@/core/context/MoniteAPIProvider';
import { MoniteContext, MoniteTheme } from '@/core/context/MoniteContext';
import { MoniteQraftContext } from '@/core/context/MoniteContext';
import { MoniteI18nProvider } from '@/core/context/MoniteI18nProvider';
import {
  MoniteProviderProps,
  MoniteSettings,
} from '@/core/context/MoniteProvider';
import { RootElementsProvider } from '@/core/context/RootElementsProvider';
import { createThemeWithDefaults } from '@/core/utils/createThemeWithDefaults';
import { entityIds } from '@/mocks/entities';
import { setupI18n } from '@lingui/core';
import {
  BrowserClient,
  defaultStackParser,
  makeFetchTransport,
} from '@sentry/react';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { waitForOptions } from '@testing-library/dom/types/wait-for';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';

import type { Locale as DateFnsLocale } from 'date-fns';
import DateFnsDeLocale from 'date-fns/locale/de';

const queryCache = new QueryCache();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
      gcTime: Infinity,
    },
  },
  queryCache,
});

export { queryClient as testQueryClient };

afterEach(() => {
  queryCache.clear();
  queryClient.removeQueries();
});

export const cachedMoniteSettings: MoniteSettings = {
  entityId: entityIds[0],
  fetchToken: () =>
    Promise.resolve({
      access_token: 'jx7qF9tLzKbDy5rG6HhVn2vEcxW4mA',
      token_type: 'Bearer',
      expires_in: 10_000,
    }),
};

export const Provider = ({
  children,
  client,
  monite,
  moniteProviderProps,
}: {
  children: ReactNode;
  client: QueryClient;
  monite?: MoniteSettings;
  moniteProviderProps?: ICreateRenderWithClientProps['providerOptions'];
}) => {
  const moniteSettings = monite ?? cachedMoniteSettings;
  const localeCode = moniteProviderProps?.locale?.code ?? 'de-DE';
  const dateFnsLocale = moniteProviderProps?.dateFnsLocale ?? DateFnsDeLocale;

  const mockRootElement =
    typeof document !== 'undefined' ? document.createElement('div') : undefined;
  const mockStylesElement =
    typeof document !== 'undefined' ? document.createElement('div') : undefined;

  if (typeof document !== 'undefined') {
    document.body.appendChild(mockRootElement!);
    document.body.appendChild(mockStylesElement!);
  }

  const i18n = setupI18n({
    locale: localeCode,
    messages: {
      [localeCode]: {},
    },
  });
  const _sentryClient = new BrowserClient({
    dsn: undefined,
    debug: true,
    transport: makeFetchTransport,
    stackParser: defaultStackParser,
    integrations: [],
  });
  const apiClient = createAPIClient({
    entityId: moniteSettings.entityId,
    context: MoniteQraftContext,
  });

  useEffect(() => {
    client.mount();
    return () => {
      client.unmount();

      if (mockRootElement && mockRootElement.parentNode) {
        mockRootElement.parentNode.removeChild(mockRootElement);
      }
      if (mockStylesElement && mockStylesElement.parentNode) {
        mockStylesElement.parentNode.removeChild(mockStylesElement);
      }
    };
  }, [client, mockRootElement, mockStylesElement]);

  return (
    <MoniteContext.Provider
      value={{
        entityId: moniteSettings.entityId,
        environment: 'dev',
        locale: getLocaleWithDefaults(moniteProviderProps?.locale),
        i18n,
        queryClient: client,
        theme: createThemeWithDefaults(
          moniteProviderProps?.theme
        ) as MoniteTheme,
        componentSettings: getDefaultComponentSettings(
          i18n,
          moniteProviderProps?.componentSettings
        ),
        dateFnsLocale,
        apiUrl: moniteSettings.apiUrl || 'https://api.sandbox.monite.com/v1',
        fetchToken: moniteSettings.fetchToken,
        ...apiClient,
      }}
    >
      <RootElementsProvider
        elements={{ root: mockRootElement, styles: mockStylesElement }}
      >
        <MoniteI18nProvider>
          <MoniteAPIProvider APIContext={MoniteQraftContext}>
            {children}
          </MoniteAPIProvider>
        </MoniteI18nProvider>
      </RootElementsProvider>
    </MoniteContext.Provider>
  );
};

interface ICreateRenderWithClientProps {
  monite?: MoniteSettings;
  providerOptions?: Omit<MoniteProviderProps, 'monite'> & {
    dateFnsLocale?: DateFnsLocale;
  };
}

/**
 * Creates a wrapper for the component testing
 * Uses mostly for `react-hooks` when we have to provide
 *  a wrapper for `reactHook` option different
 *  from the default one
 *
 * @param props Function configuration
 *
 * @see {@link https://tkdodo.eu/blog/testing-react-query#always-await-the-query}
 */
export function createRenderWithClient(props?: ICreateRenderWithClientProps) {
  return ({ children }: { children: React.ReactNode }) => (
    <Provider
      client={queryClient}
      children={children}
      monite={props?.monite}
      moniteProviderProps={props?.providerOptions}
    />
  );
}

// for component testing
export function renderWithClient(
  children: ReactElement,
  sdk?: MoniteSettings
): Omit<RenderResult, 'rerender'> & {
  rerender: (children: ReactElement) => void;
} {
  // const testQueryClient = createReactQueryClient();
  const testQueryClient = queryClient;
  testQueryClient.cancelQueries();
  testQueryClient.clear();
  testQueryClient.removeQueries();

  const { rerender, ...result } = render(children, {
    wrapper: ({ children }) => (
      <Provider client={testQueryClient} children={children} monite={sdk} />
    ),
  });

  return {
    ...result,
    rerender: (children: ReactElement) =>
      rerender(
        <Provider client={testQueryClient} children={children} monite={sdk} />
      ),
  };
}

/**
 * Waits when the spinner `progressbar`
 *  (which is used for all data-tables in our project)
 *  will be removed from the DOM.
 * That action will mean that the data is loaded in the table
 *
 *
 * ## Example
 * ```typescript
 * test('should render table when the data is fully fetched', async () => {
 *   renderWithClient(<MyTableComponent />);
 *
 *   // After that we are sure that data is fetched
 *   //  and we can interact with the table
 *   await waitUntilTableIsLoaded();
 *
 *   const tableItem = screen.getByText('element title');
 *
 *   expect(tableItem).toBeInTheDocument();
 * });
 * ```
 */
export async function waitUntilTableIsLoaded(
  waitForOptions?: waitForOptions
): Promise<void> {
  const spinners = await screen.findAllByRole('progressbar'); // todo::Conflicts with any other progress bar on the page

  try {
    return await waitForElementToBeRemoved(spinners, {
      timeout: waitForOptions?.timeout ?? 30_000,
      interval: waitForOptions?.interval,
    });
  } catch (error) {
    console.warn('Error waiting for spinners to be removed:', error);
  }
}

/**
 * Waits for condition to be true
 *
 * @param predicate Predicate checking for condition
 * @param timeout Wait function timeout
 * @param checkInterval Wait function check interval
 */
export function waitForCondition(
  predicate: () => boolean,
  timeout: number = 1_000,
  checkInterval: number = 50
) {
  return new Promise<void>((resolve, reject) => {
    let timeLeft = timeout;
    const intervalId = setInterval(() => {
      if (predicate()) {
        clearInterval(intervalId);
        resolve();
      } else {
        timeLeft -= checkInterval;
        if (timeLeft <= 0) {
          clearInterval(intervalId);
          reject(new Error('Timed out in waitForCondition.'));
        }
      }
    }, checkInterval);
  });
}

/**
 * Triggers a click on a select option
 *
 * @param selectName Select name
 * @param selectOption On which option to click
 */
export function triggerClickOnSelectOption(
  selectName: string | RegExp,
  selectOption: string | RegExp
) {
  fireEvent.mouseDown(
    screen.getByRole('combobox', {
      name: selectName,
    })
  );

  const dropdown = screen.getByRole('listbox', {
    name: selectName,
  });

  const { getByRole } = within(dropdown);
  const option = getByRole('option', {
    name: selectOption,
  });
  fireEvent.click(option);
}

export function triggerClickOnAutocompleteOption(
  selectName: string | RegExp,
  selectOption: string | RegExp
) {
  const dropdown = screen.getByRole('combobox', {
    name: selectName,
  });
  fireEvent.mouseDown(dropdown);

  const option = screen.getByText(selectOption);
  fireEvent.click(option);
}

export async function triggerClickOnFirstAutocompleteOption(
  selectName: string | RegExp,
  timeout: number = 3_000
) {
  const dropdown = screen.getByRole('combobox', {
    name: selectName,
  });
  act(() => fireEvent.mouseDown(dropdown));

  await waitForCondition(
    () => screen.queryAllByRole('option').length > 0,
    timeout
  );
  const options = screen.getAllByRole('option');
  act(() => fireEvent.click(options[0]));

  // Wait for options to be hidden
  await waitForCondition(
    () => !screen.queryAllByRole('option').length,
    timeout
  );
}

/**
 * Changes the value of the input
 *
 * @param inputName Input name
 * @param value New value for the input
 */
export function triggerChangeInput(
  inputName: string | RegExp,
  value: string | RegExp
) {
  const input = screen.getByRole('textbox', {
    name: inputName,
  });

  fireEvent.change(input, {
    target: { value },
  });
}

/**
 * Selects an option in the async dropdown field.
 * @param dropdownName The name of the dropdown field.
 * @param optionText The text of the option to select.
 */
export async function selectAsyncDropdownOption(
  dropdownName: string | RegExp,
  optionText: string | RegExp
) {
  const dropdownButton = await screen.findByRole('combobox', {
    name: dropdownName,
  });

  await waitFor(() => {
    expect(dropdownButton).not.toBeDisabled();
  });

  // Open the dropdown
  fireEvent.mouseDown(dropdownButton);

  // Wait for the dropdown to open and the options to load
  const dropdown = await screen.findByRole('listbox', {
    name: dropdownName,
  });

  // Find the option within the dropdown
  const { findAllByText } = within(dropdown);
  const option = await findAllByText(optionText);

  // Click the option
  fireEvent.click(option[0]);
}

/**
 * Selects an option in the autocomplete field.
 * @param autoCompleteName The name of the autocomplete field.
 * @param optionText The text of the option to select.
 */
export async function selectAutoCompleteOption(
  autoCompleteName: string | RegExp,
  optionText: string | RegExp
) {
  const autoComplete = screen.getByRole('combobox', { name: autoCompleteName });

  expect(autoComplete).toBeVisible();

  const autoCompleteDropdown = screen.getByRole('button', { name: 'Open' });

  // Autocomplete dropdown button.
  expect(autoCompleteDropdown).toBeVisible();
  fireEvent.click(autoCompleteDropdown);

  // Autocomplete dropdown view.
  expect(screen.getByRole('presentation')).toBeVisible();

  // click on menu option in autocomplete.
  fireEvent.click(screen.getByText(optionText));

  // imitate click away(this is only required if you have disableCloseOnSelect is enabled.
  fireEvent.click(document.body);
  expect(screen.queryByRole('presentation')).not.toBeInTheDocument();

  //Verify autocomplete shows the correct value.
  expect(autoComplete.getAttribute('value')).toMatch(optionText);
}

/**
 * Throws an error if the permissions are not loaded
 * Could be used in `waitFor` function
 *
 * @example
 * ```tsx
 * await waitFor(() => checkPermissionQueriesLoaded(queryClient));
 * await expect(screen.findByText(/Access Restricted/i)).resolves.toBeInTheDocument();
 * ```
 * @param queryClient QueryClient with the queries: `[ENTITY_USERS_QUERY_ID, 'my_role']` and `[ENTITY_USERS_QUERY_ID, 'me']`
 * @throws Error if the permissions are not loaded
 */
export async function checkPermissionQueriesLoaded(queryClient: QueryClient) {
  const { api } = createAPIClient();

  const roleQuery = api.entityUsers.getEntityUsersMyRole.getQueryState(
    {},
    queryClient
  );

  const meQuery = api.entityUsers.getEntityUsersMe.getQueryState(
    {},
    queryClient
  );

  if (!roleQuery || !meQuery) throw new Error('Permissions query not exists');

  if (roleQuery.status !== 'success' || meQuery.status !== 'success')
    throw new Error('Permissions not loaded');
}

export function findParentElement(
  childElement: HTMLElement,
  predicate: (elem: HTMLElement) => boolean
) {
  let parent: HTMLElement | null | undefined = childElement.parentElement;
  do {
    if (parent && predicate(parent)) return parent;
    parent = parent?.parentElement;
  } while (parent != null);
}
