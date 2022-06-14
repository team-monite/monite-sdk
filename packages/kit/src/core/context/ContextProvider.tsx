import React from 'react';
import { MoniteApp } from '@monite/js-sdk';
import ConfigProvider from 'antd/es/config-provider';

import { ComponentsContext } from './ComponentsContext';

import '../../index.less';

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
      <ConfigProvider prefixCls="monite">{children}</ConfigProvider>
    </ComponentsContext.Provider>
  );
};

export default MoniteProvider;
