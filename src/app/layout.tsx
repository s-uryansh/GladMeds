import { Inter } from 'next/font/google'
import './globals.css'
import Aoscompo from '@/lib/utils/aos'
import ScrollToTop from './components/scroll-to-top'
import Header from './components/layout/header'
import Footer from './components/layout/footer'
import { Toaster } from 'react-hot-toast';
import Providers from '@/app/components/Providers';

const font = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${font.className}`}>
        <Aoscompo>
          <Header />
          <Providers>{children}</Providers>
          <Footer />
        </Aoscompo>
        <ScrollToTop />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
