'use client'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Update cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartCount(cart.length)
    
    // Listen for cart changes
    const handleStorageChange = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartCount(cart.length)
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <nav className="sticky top-0 z-50 glass-card mx-4 my-4 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
              🚀
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SpaceMarket
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative glass-card p-3 hover:bg-white/10">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <Link href="/admin" className="glass-card px-6 py-3 font-semibold hover:bg-white/10">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
