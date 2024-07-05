import { ReactNode, createContext, useContext, lazy } from 'react';

import { getConfig, ConfigSchema } from '@/core/getConfig';

type ConfigContextType = ConfigSchema | null;

const ConfigContext = createContext<ConfigContextType>(null);

interface ConfigProviderProps {
  config: ConfigSchema;
  children: ReactNode;
}

const ConfigProviderComponent = ({ config, children }: ConfigProviderProps) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === null) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

export const ConfigProvider = lazy(async () => {
  const config = await getConfig();
  return {
    default: function WrapperComponent({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <ConfigProviderComponent config={config}>
          {children}
        </ConfigProviderComponent>
      );
    },
  };
});
