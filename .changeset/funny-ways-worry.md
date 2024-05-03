---
'@monite/sdk-react': minor
---

1.  Providers that may affect the customer's context have been moved to `<MoniteScopedProviders/>`.
2.  A new `<ScopedCssBaseline/>` component has been added to provide default styles for components.
3.  The `<MoniteContext/>` interface has been updated to include:
  -   `theme`: Moved from `<MoniteThemeContext/>`.
  -   `i18n`: Added instead of `code`, pre-created via Suspense to contain all necessary data for components and hooks.
  -   `dateFnsLocale`: Added for DatePicker functionality, pre-created via Suspense.
  -   `queryClient`: Added for usage within `<MoniteScopedProviders/>`.

These changes improve the modularity and maintainability of the `MoniteProvider` while providing enhanced context management and usability for Monite SDK customers.
