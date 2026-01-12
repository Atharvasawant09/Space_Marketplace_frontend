'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import axios from 'axios'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        params: search ? { search } : {}
      })
      setProducts(data.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(product)
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('✅ Added to cart!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-16">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="glass-card p-12 mb-12 text-center">
        <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Space Research Equipment
        </h1>
        <p className="text-xl text-gray-300 mb-8">Premium satellite components & sensors</p>
        
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-4 text-gray-400 h-6 w-6" />
          <input
            type="text"
            placeholder="Search equipment..."
            className="w-full pl-14 pr-4 py-4 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchProducts()}
          />
        </div>
      </div>

      {/* Products */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product._id} className="glass-card p-6 group">
            <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition duration-500"
              />
              {!product.inStock && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  Out of Stock
                </div>
              )}
            </div>
            
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {product.name}
            </h3>
            
            <p className="text-gray-400 mb-6 line-clamp-2">{product.description}</p>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-3xl font-black text-cyan-400">
                ₹{product.price.toLocaleString()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                product.inStock 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                Stock: {product.stock}
              </span>
            </div>

            <button
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
              className="w-full btn-gradient text-white py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
