'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, X } from 'lucide-react'
import axios from 'axios'

export default function Cart() {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    organization: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'))
  }, [])

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index)
    localStorage.setItem('cart', JSON.stringify(newCart))
    setCart(newCart)
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const placeOrder = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      return alert('Please fill name and email')
    }

    setLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        items: cart.map(item => ({ product: item._id, quantity: 1 })),
        customerInfo
      })
      localStorage.removeItem('cart')
      alert('✅ Order placed successfully!')
      router.push('/')
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Failed'))
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-16 text-center">
          <ShoppingCart className="h-24 w-24 mx-auto mb-6 text-gray-600" />
          <h2 className="text-3xl font-bold mb-4">Cart is empty</h2>
          <button onClick={() => router.push('/')} className="btn-gradient text-white">
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item, index) => (
            <div key={index} className="glass-card p-6 flex gap-6">
              <Image src={item.image} alt={item.name} width={120} height={120} className="rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-gray-400 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-cyan-400">₹{item.price.toLocaleString()}</span>
                  <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-8">
          <h3 className="text-2xl font-bold mb-6">Checkout</h3>
          <div className="space-y-4 mb-6">
            <input
              placeholder="Name *"
              className="w-full p-4 bg-white/10 border border-purple-500/30 rounded-xl"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
            />
            <input
              placeholder="Email *"
              className="w-full p-4 bg-white/10 border border-purple-500/30 rounded-xl"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            />
            <input
              placeholder="Phone"
              className="w-full p-4 bg-white/10 border border-purple-500/30 rounded-xl"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
            />
            <input
              placeholder="Organization"
              className="w-full p-4 bg-white/10 border border-purple-500/30 rounded-xl"
              value={customerInfo.organization}
              onChange={(e) => setCustomerInfo({...customerInfo, organization: e.target.value})}
            />
          </div>

          <div className="border-t border-purple-500/30 pt-6 mb-6">
            <div className="flex justify-between text-3xl font-bold text-cyan-400">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full btn-gradient text-white py-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}
