import { fetchToken } from '@/services/fetch-token';
import { getLoginEnvData } from '@/services/login-env-data';
import { MoniteProvider } from '@monite/sdk-react';
import { type ComponentProps, type ReactNode, useMemo } from 'react';

type AppMoniteProvider = {
  children: ReactNode;
} & Pick<ComponentProps<typeof MoniteProvider>, 'locale' | 'theme'>;

const AppMoniteProvider = ({ children }: AppMoniteProvider) => {
  const { entityId, entityUserId, clientId, clientSecret, apiUrl } =
    getLoginEnvData();

  const monite = useMemo(
    () => ({
      entityId,
      apiUrl,
      fetchToken: () =>
        fetchToken(apiUrl, {
          entity_user_id: entityUserId,
          client_id: clientId,
          client_secret: clientSecret,
        }),
    }),
    [apiUrl, entityId, entityUserId, clientId, clientSecret]
  );

  return (
    <MoniteProvider
      monite={monite}
      locale={{}}
      theme={{
        components: {
          payableStatusChip: {
            icon: null,
            colors: {
              draft: '#3bf67c',
            },
          },
          styles: {
            payables: {
              button: {
                // Primary: "Add new bill" trigger, Approve buttons, Force Approve
                primary: {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  borderRadius: 8,
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  hover: {
                    background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  },
                },
                // Secondary: "Add new bill" in dropdown, "Choose from device", Edit buttons
                secondary: {
                  background: '#ffffff',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  borderRadius: 8,
                  fontWeight: 500,
                  hover: {
                    background: '#f5f7ff',
                    border: '2px solid #667eea',
                  },
                },
                // Tertiary: "Add Bank Account", "Add Discount", Cancel buttons
                tertiary: {
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                  color: '#667eea',
                  hover: {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                  },
                },
                // Destructive: Reject, Force Reject, Delete buttons
                destructive: {
                  background: '#ef4444',
                  color: '#ffffff',
                  borderRadius: 8,
                  hover: {
                    background: '#dc2626',
                  },
                },
              },
            },
          },
        },
      }}
      componentSettings={{
        receivables: {
          paginationLayout: 'reversed',
          enableEntityBankAccount: true,
        },
        payables: {
          // Enabled to test button customization
          hideAddDiscountButton: false,
          hideAddBankAccountButton: false,
          // TODO: remove after testing. Just for testing purposes
          displayColumns: [
            'document_id',
            // 'counterpart_id',
            'created_at',
            // 'issued_at',
            'due_date',
            'status',
            'amount',
            // 'amount_to_pay',
            'amount_paid',
            'pay',
          ],
        },
      }}
    >
      {children}
    </MoniteProvider>
  );
};

export { AppMoniteProvider };
