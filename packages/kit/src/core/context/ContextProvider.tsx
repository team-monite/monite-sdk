import React from 'react';
import { ComponentsContext } from './ComponentsContext';

import ApiService from '../api/ApiService';

interface MoniteProviderProps {
  api: ApiService;
  children?: any;
}

const MoniteProvider = ({ api, children }: MoniteProviderProps) => {
  return (
    <ComponentsContext.Provider
      value={{
        api,
      }}
    >
      {children}
    </ComponentsContext.Provider>
  );
};

export default MoniteProvider;
