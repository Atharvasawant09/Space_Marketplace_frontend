import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'SpaceMarket - Research Equipment',
  description: 'Premium space research equipment marketplace',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
