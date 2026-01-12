'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import axios from 'axios'

export default function ProductDetail() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    if (params.id) {
      fetchProduct()
      fetchRelatedProducts()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`)
      setProduct(data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${params.category || 'Sensors'}&limit=4`)
      setRelatedProducts(data.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const addToCart = () => {
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

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="glass-card p-8">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={500}
            className="w-full h-96 object-cover rounded-xl"
          />
        </div>

        {/* Product Info */}
        <div className="glass-card p-8 space-y-6">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-cyan-400">
              ₹{product.price.toLocaleString()}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              product.inStock 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
            }`}>
              Stock: {product.stock}
            </span>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
          
          <div className="flex gap-4">
            <button
              onClick={addToCart}
              disabled={!product.inStock}
              className="flex-1 btn-gradient text-white py-4 font-bold text-lg disabled:opacity-50"
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-3xl font-bold mb-8">Related Products</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.slice(0, 4).map((related) => (
            <div key={related._id} className="glass-card p-4 hover:scale-105 transition-all">
              <Image src={related.image} alt={related.name} width={200} height={150} className="w-full h-48 object-cover rounded-xl" />
              <h3 className="font-bold mt-2">{related.name}</h3>
              <p className="text-cyan-400 font-bold">₹{related.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
