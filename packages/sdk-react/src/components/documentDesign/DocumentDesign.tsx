import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';

import { DocumentDesignSelection } from './components/DocumentDesignSelection/DocumentDesignSelection';

const DocumentDesignBase = () => {
  return <DocumentDesignSelection />;
};

export const DocumentDesign = () => (
  <MoniteScopedProviders>
    <DocumentDesignBase />
  </MoniteScopedProviders>
);
