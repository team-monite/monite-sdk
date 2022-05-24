import React, { createContext, useContext } from 'react';

import ApiService from '../api/ApiService';

type ComponentsContextValue = {
  api: ApiService;
};

export const ComponentsContext = createContext<ComponentsContextValue | null>(
  null
);

export function useComponentsContext() {
  const componentsContext = useContext(ComponentsContext);
  if (!componentsContext) {
    throw new Error('Could not find Components context');
  }
  return componentsContext;
}
