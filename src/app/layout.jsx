import '@/assets/scss/style.scss';
import AppProvidersWrapper from '@/components/wrapper/AppProvidersWrapper';
import { Roboto } from 'next/font/google';
import { Toaster } from 'sonner';

const roboto = Roboto({
  display: 'swap',
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-bs-theme="dark">
      <body className={`${roboto.className} theme-dark`}>
        <AppProvidersWrapper>
          {children}

          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </AppProvidersWrapper>
      </body>
    </html>
  );
}