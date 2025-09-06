

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const theme = useSelector((state) => state.theme.theme); //  string 'light' or 'dark'

  useEffect(() => {
    // Apply/remove the 'dark' class from <html>
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
