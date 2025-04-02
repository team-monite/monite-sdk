import { useMoniteContext } from '../context/MoniteContext';

export const useOnboardingPaymentTheme = () => {
  const { api, partnerId = '', projectId = '' } = useMoniteContext();

  return api.internal.getInternalPaymentPageTheme.useQuery(
    {
      query: {
        partner_id: partnerId,
        project_id: projectId,
      },
    },
    {
      enabled: Boolean(partnerId && projectId),
    }
  );
};
