import type { Metadata } from 'next'
import { Geist, Geist_Mono, Tiny5 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { MusicPlayerProvider } from '@/components/music-player-provider'
import { GlobalMusicPlayer } from '@/components/global-music-player'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
export const tiny5 = Tiny5({ 
  subsets: ["latin"],
  weight: "400",
  variable: "--font-tiny5"
});

export const metadata: Metadata = {
  title: 'CloudPlus',
  description: 'CloudPlus - Cloud Solutions',
  icons: {
    icon: '/icon.svg',
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${tiny5.variable}`}>
        <MusicPlayerProvider>
          <GlobalMusicPlayer />
          {children}
        </MusicPlayerProvider>
        <Analytics />
      </body>
    </html>
  )
}
