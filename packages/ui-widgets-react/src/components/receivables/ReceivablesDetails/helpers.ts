export const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
  });
