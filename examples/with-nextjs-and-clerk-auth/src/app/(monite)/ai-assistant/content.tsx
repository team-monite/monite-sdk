'use client';

import dynamicImport from 'next/dynamic';

import LoadingFallback from '@/components/LoadingFallback';

const AIAssistant = dynamicImport(
  () =>
    import('@monite/sdk-react').then((mod) => ({ default: mod.AIAssistant })),
  {
    ssr: false,
    loading: () => <LoadingFallback minimal />,
  }
);

export const AIPageContent = () => {
  return <AIAssistant />;
};
