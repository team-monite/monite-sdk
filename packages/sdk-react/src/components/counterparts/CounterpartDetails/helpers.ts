export const printCounterpartType = (
  customer?: string,
  vendor?: string
): string => {
  const types: string[] = [];

  if (customer) types.push(customer);
  if (vendor) types.push(vendor);

  return types.join(', ');
};
