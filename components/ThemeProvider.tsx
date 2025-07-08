import React from 'react';
import { COLORS } from '../constants/theme';

interface ThemeContextType {
  colors: typeof COLORS;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  colors: COLORS,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ colors: COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
};