import type { ReactNode } from 'react';
import './globals.css';
import { SiteThemeProvider } from '../../shared/react/SiteThemeProvider';

export const metadata = {
  title: 'Immersive Scroll',
  description:
    'A product site and playground for immersive scroll video storytelling.'
};

const themeScript = `
  (() => {
    try {
      const storageKey = 'immersive-scroll-theme';
      const storedTheme = window.localStorage.getItem(storageKey);
      const theme =
        storedTheme === 'light' || storedTheme === 'dark'
          ? storedTheme
          : window.matchMedia('(prefers-color-scheme: light)').matches
            ? 'light'
            : 'dark';
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.style.colorScheme = 'dark';
    }
  })();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SiteThemeProvider>{children}</SiteThemeProvider>
      </body>
    </html>
  );
}
