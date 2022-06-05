import React from 'react';
import { MoniteApp } from '@monite/js-sdk';

import { ComponentsContext } from './ComponentsContext';

interface MoniteProviderProps {
  monite: MoniteApp;
  children?: any;
}

const MoniteProvider = ({ monite, children }: MoniteProviderProps) => {
  return (
    <ComponentsContext.Provider
      value={{
        monite,
      }}
    >
      {children}
    </ComponentsContext.Provider>
  );
};

export default MoniteProvider;
