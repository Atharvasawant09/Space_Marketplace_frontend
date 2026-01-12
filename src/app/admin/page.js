'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'

export default function Admin() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    customCategory: '',
    stock: 10,
    inStock: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}`

  useEffect(() => {
    fetchProducts()
    fetchOrders()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/products/categories`)
      setCategories(data.data || [])
    } catch (error) {
      console.error('Fetch categories error:', error)
      // Fallback categories
      setCategories(['Sensors', 'Communication Systems', 'Power Systems', 'Satellite Components', 'Research Instruments'])
    }
  }

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/products`)
      setProducts(data.data)
    } catch (error) {
      console.error('Fetch products error:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/admin/orders`, {
        headers: { 'x-admin-key': 'admin-secret-key' }
      })
      setOrders(data.data)
    } catch (error) {
      console.error('Fetch orders error:', error)
      setOrders([])
    }
  }

  const addProduct = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Determine final category (custom or selected)
    const finalCategory = showCustomCategory ? newProduct.customCategory : newProduct.category

    // Frontend validation
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.image || !finalCategory) {
      setError('Please fill all required fields')
      setLoading(false)
      return
    }

    try {
      console.log('Sending product data:', { ...newProduct, category: finalCategory })

      const response = await axios.post(`${API_BASE}/admin/products`, {
        name: newProduct.name.trim(),
        category: finalCategory.trim(),
        description: newProduct.description.trim(),
        price: Number(newProduct.price),
        image: newProduct.image.trim(),
        stock: Number(newProduct.stock) || 10,
        inStock: newProduct.inStock !== false
      }, {
        headers: { 
          'x-admin-key': 'admin-secret-key',
          'Content-Type': 'application/json'
        }
      })

      console.log('Product added:', response.data)
      alert('✅ Product added successfully!')
      
      // Reset form
      setNewProduct({
        name: '',
        price: '',
        description: '',
        image: '',
        category: '',
        customCategory: '',
        stock: 10,
        inStock: true
      })
      setShowCustomCategory(false)
      
      fetchProducts()
      fetchCategories() // Refresh categories to include new one
    } catch (error) {
      console.error('Add product error:', error.response?.data || error.message)
      const errorMsg = error.response?.data?.message || error.message
      setError(`Failed to add product: ${errorMsg}`)
      alert(`❌ Error: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
        Admin Dashboard
      </h1>

      {/* Add Product Form */}
      <div className="glass-card p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={addProduct} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Product Name *</label>
            <input
              placeholder="High-Resolution Optical Sensor"
              className="w-full p-4 bg-white/10 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Price (₹) *</label>
            <input
              placeholder="125000"
              type="number"
              min="0"
              step="1"
              className="w-full p-4 bg-white/10 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Image URL *</label>
            <input
              placeholder="https://images.unsplash.com/photo-123.jpg"
              className="w-full p-4 bg-white/10 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500"
              value={newProduct.image}
              onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Category * 
              <span className="text-xs text-gray-500 ml-2">
                ({categories.length} available)
              </span>
            </label>
            
            {!showCustomCategory ? (
              <div className="flex gap-2">
                <select
                  className="flex-1 p-4 bg-white/10 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  required={!showCustomCategory}
                >
                  <option value="" className="bg-gray-900">Select existing category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat} className="bg-gray-900">
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCustomCategory(true)}
                  className="px-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all whitespace-nowrap"
                >
                  + New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  placeholder="Enter new category (e.g., Shuttle Tech)"
                  className="flex-1 p-4 bg-white/10 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  value={newProduct.customCategory}
                  onChange={(e) => setNewProduct({...newProduct, customCategory: e.target.value})}
                  required={showCustomCategory}
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomCategory(false)
                    setNewProduct({...newProduct, customCategory: ''})
                  }}
                  className="px-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {showCustomCategory ? 'Creating new category' : 'Or click "+ New" to add custom category'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Stock Quantity</label>
            <input
              placeholder="10"
              type="number"
              min="0"
              className="w-full p-4 bg-white/10 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-300">Description *</label>
            <textarea
              placeholder="Multi-spectral imaging sensor for Earth observation satellites..."
              rows={4}
              className="w-full p-4 bg-white/10 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500"
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 btn-gradient text-white py-4 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>

      {/* Products List */}
      <div className="glass-card p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">All Products ({products.length})</h2>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm text-gray-400">Filter by category:</span>
          {categories.map((cat, index) => (
            <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
              {cat}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="p-4 bg-white/5 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all">
              <Image 
                src={product.image} 
                alt={product.name} 
                width={200} 
                height={150} 
                className="w-full h-32 object-cover rounded-lg mb-2" 
              />
              <h3 className="font-bold truncate">{product.name}</h3>
              <p className="text-xs text-gray-400 mb-1">{product.category}</p>
              <p className="text-cyan-400 font-bold">₹{product.price.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/30">
                  <th className="text-left py-4 px-4">Order ID</th>
                  <th className="text-left py-4 px-4">Customer</th>
                  <th className="text-left py-4 px-4">Email</th>
                  <th className="text-center py-4 px-4">Items</th>
                  <th className="text-right py-4 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-purple-500/20 hover:bg-white/5">
                    <td className="py-4 px-4 font-mono text-sm">{order._id.slice(-8)}</td>
                    <td className="py-4 px-4">{order.customerInfo?.name || 'N/A'}</td>
                    <td className="py-4 px-4 text-sm text-gray-400">{order.customerInfo?.email || 'N/A'}</td>
                    <td className="py-4 px-4 text-center">{order.items?.length || 0}</td>
                    <td className="py-4 px-4 text-right font-bold text-cyan-400">₹{order.totalPrice?.toLocaleString() || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
