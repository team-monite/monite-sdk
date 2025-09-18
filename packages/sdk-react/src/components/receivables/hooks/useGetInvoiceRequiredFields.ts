import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';

type RequiredFields = {
  entity_vat_id_id?: string;
  counterpart_billing_address_id?: string;
  counterpart_country?: components['schemas']['AllowedCountries'];
  counterpart_id?: string;
  counterpart_type?: components['schemas']['CounterpartType'];
  counterpart_vat_id_id?: string;
};

export const useGetInvoiceRequiredFields = ({
  entity_vat_id_id,
  counterpart_billing_address_id,
  counterpart_country,
  counterpart_id,
  counterpart_type,
  counterpart_vat_id_id,
}: RequiredFields) => {
  const { api } = useMoniteContext();

  return api.receivables.getReceivablesRequiredFields.useQuery(
    {
      query: {
        entity_vat_id_id,
        counterpart_billing_address_id,
        counterpart_country,
        counterpart_id,
        counterpart_type,
        counterpart_vat_id_id,
      },
    },
    {
      enabled:
        Boolean(entity_vat_id_id) &&
        Boolean(counterpart_billing_address_id) &&
        Boolean(counterpart_id),
    }
  );
};
