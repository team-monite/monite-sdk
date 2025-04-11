import { PageHeader } from '@/components/PageHeader';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const AIAssistant = () => (
  <MoniteScopedProviders>
    <AIAssistantBase />
  </MoniteScopedProviders>
);

const AIAssistantBase = () => {
  const { i18n } = useLingui();

  return (
    <>
      <PageHeader title={t(i18n)`AI Assistant`} />
      <div>hello world</div>
    </>
  );
};
