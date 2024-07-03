import React, { ReactElement, ReactNode } from 'react';

import { createAPIClient } from '@/api/client';
import { MoniteQraftContext } from '@/core/context/MoniteAPIProvider';
import { MoniteContext } from '@/core/context/MoniteContext';
import {
  getLocaleWithDefaults,
  MoniteI18nProvider,
} from '@/core/context/MoniteI18nProvider';
import { MoniteProviderProps } from '@/core/context/MoniteProvider';
import { createThemeWithDefaults } from '@/core/utils/createThemeWithDefaults';
import { entityIds } from '@/mocks/entities';
import { setupI18n } from '@lingui/core';
import { MoniteSDK } from '@monite/sdk-api';
import {
  BrowserClient,
  defaultStackParser,
  Hub,
  makeFetchTransport,
} from '@sentry/react';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { waitForOptions } from '@testing-library/dom/types/wait-for';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';

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

const { api } = createAPIClient();

export const cachedMoniteSDK = new MoniteSDK({
  entityId: entityIds[0],
  fetchToken: () =>
    Promise.resolve({
      access_token: 'jx7qF9tLzKbDy5rG6HhVn2vEcxW4mA',
      token_type: 'Bearer',
      expires_in: 10_000,
    }),
});

export const Provider = ({
  children,
  client,
  sdk,
  moniteProviderProps,
}: {
  children: ReactNode;
  client: QueryClient;
  sdk?: MoniteSDK;
  moniteProviderProps?: ICreateRenderWithClientProps['providerOptions'];
}) => {
  const monite = sdk ?? cachedMoniteSDK;
  const localeCode = moniteProviderProps?.locale?.code ?? 'de-DE';
  const dateFnsLocale = moniteProviderProps?.dateFnsLocale ?? DateFnsDeLocale;

  const i18n = setupI18n({
    locale: localeCode,
    messages: {
      [localeCode]: {},
    },
  });
  const sentryClient = new BrowserClient({
    dsn: undefined,
    debug: true,
    transport: makeFetchTransport,
    stackParser: defaultStackParser,
    integrations: [],
  });
  const sentryHub = new Hub(sentryClient);

  return (
    <QueryClientProvider client={client}>
      <MoniteContext.Provider
        value={{
          locale: getLocaleWithDefaults(moniteProviderProps?.locale),
          monite,
          i18n,
          sentryHub,
          queryClient: client,
          theme: createThemeWithDefaults(moniteProviderProps?.theme),
          dateFnsLocale,
          apiUrl: monite.baseUrl,
          fetchToken: monite.fetchToken,
          ...createAPIClient({
            entityId: monite.entityId,
            context: MoniteQraftContext,
          }),
        }}
      >
        <MoniteI18nProvider>{children}</MoniteI18nProvider>
      </MoniteContext.Provider>
    </QueryClientProvider>
  );
};

interface ICreateRenderWithClientProps {
  monite?: MoniteSDK;
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
  return ({ children }: { children: ReactElement }) => (
    <Provider
      client={queryClient}
      children={children}
      sdk={props?.monite}
      moniteProviderProps={props?.providerOptions}
    />
  );
}

// for component testing
export function renderWithClient(children: ReactElement, sdk?: MoniteSDK) {
  // const testQueryClient = createReactQueryClient();
  const testQueryClient = queryClient;
  testQueryClient.cancelQueries();
  testQueryClient.clear();
  testQueryClient.removeQueries();

  const { rerender, ...result } = render(children, {
    wrapper: ({ children }) => (
      <Provider client={testQueryClient} children={children} sdk={sdk} />
    ),
  });

  return {
    ...result,
    rerender: (children: ReactElement) =>
      rerender(
        <Provider client={testQueryClient} children={children} sdk={sdk} />
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

  return await waitForElementToBeRemoved(spinners, {
    timeout: waitForOptions?.timeout ?? 30_000,
    interval: waitForOptions?.interval,
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
    screen.getByRole('button', {
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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Selects an option in the async dropdown field.
 * @param dropdownName The name of the dropdown field.
 * @param optionText The text of the option to select.
 */
export async function selectAsyncDropdownOption(
  dropdownName: string | RegExp,
  optionText: string | RegExp
) {
  const dropdownButton = await screen.findByRole('button', {
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
