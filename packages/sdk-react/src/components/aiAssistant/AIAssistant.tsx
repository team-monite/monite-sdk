import React, { FC, PropsWithChildren } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const AIAssistant: FC<PropsWithChildren> = ({ children }) => (
  <MoniteScopedProviders>
    <AIAssistantBase>{children}</AIAssistantBase>
  </MoniteScopedProviders>
);

const AIAssistantBase: FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useLingui();

  return (
    <>
      <PageHeader
        className="mtw:border-solid mtw:border-b mtw:border-gray-200 mtw:pb-3 mtw:!mb-0 mtw:px-8"
        title={t(i18n)`AI Assistant`}
      />
      {children}
    </>
  );
};
