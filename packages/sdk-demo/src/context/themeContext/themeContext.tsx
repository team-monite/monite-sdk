import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { useLocalStorage } from 'react-use';

import { ThemeOptions } from '@mui/material';
import {
  materialLight as themeMaterialLight,
  materialDark as themeMaterialDark,
  moniteLight as themeMoniteLight,
  moniteDark as themeMoniteDark,
} from '@team-monite/sdk-themes';

interface ThemeContextProviderProps {
  children: ReactNode;
}

interface ThemeContextValue {
  themeIndex: 'material' | 'monite';
  theme: ThemeOptions;
  colorMode: 'light' | 'dark';
  setTheme: (theme: 'material' | 'monite') => void;
  toggleColorMode: () => void;
}

interface LocalStorageTheme {
  themeIndex: 'material' | 'monite';
  colorMode: 'light' | 'dark';
}

const getTheme = (
  theme: 'material' | 'monite',
  colorMode: 'light' | 'dark'
) => {
  if (theme === 'material') {
    return colorMode === 'light' ? themeMaterialLight : themeMaterialDark;
  }

  return colorMode === 'light' ? themeMoniteLight : themeMoniteDark;
};

export const ThemeContext = createContext<ThemeContextValue>({
  themeIndex: 'material',
  theme: themeMaterialLight,
  colorMode: 'light',
  setTheme: () => {},
  toggleColorMode: () => {},
});

export const ThemeContextProvider = ({
  children,
}: ThemeContextProviderProps) => {
  const [localStorageTheme, setLocalStorageTheme] =
    useLocalStorage<LocalStorageTheme>('theme');

  const [currentThemeIndex, setCurrentThemeIndex] = useState<
    'material' | 'monite'
  >(localStorageTheme?.themeIndex || 'material');
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(
    localStorageTheme?.colorMode || 'light'
  );
  const [currentTheme, setCurrentTheme] =
    useState<ThemeOptions>(themeMaterialLight);

  useEffect(() => {
    setCurrentTheme(getTheme(currentThemeIndex, colorMode));
    setLocalStorageTheme({ themeIndex: currentThemeIndex, colorMode });
  }, [setLocalStorageTheme, currentThemeIndex, colorMode]);

  const setTheme = (theme: 'material' | 'monite') => {
    setCurrentThemeIndex(theme);
  };

  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider
      value={{
        themeIndex: currentThemeIndex,
        theme: currentTheme,
        colorMode,
        setTheme,
        toggleColorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error(
      'Could not find ThemeContext. Make sure that you are using "AppMoniteProvider" component before calling this hook.'
    );
  }

  return themeContext;
};
