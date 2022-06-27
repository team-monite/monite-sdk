import { createContext, useContext } from 'react';
import { MoniteApp } from '@monite/js-sdk';
import { useTranslation } from 'react-i18next';

type ComponentsContextValue = {
  monite: MoniteApp;
};

export const ComponentsContext = createContext<ComponentsContextValue | null>(
  null
);

export function useComponentsContext() {
  const { t } = useTranslation();

  const componentsContext = useContext(ComponentsContext);
  if (!componentsContext) {
    throw new Error('Could not find Components context');
  }
  return {
    ...componentsContext,
    t,
  };
}
