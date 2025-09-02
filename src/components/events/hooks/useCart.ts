import { useState, useEffect } from 'react'

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image_url?: string | null
  venue?: string | null
  schedule?: string | null
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Initialize state from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart')
        return savedCart ? JSON.parse(savedCart) : []
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error)
        return []
      }
    }
    return []
  })

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined' && items.length > 0) {
      try {
        console.log('Saving cart to localStorage:', items)
        localStorage.setItem('cart', JSON.stringify(items))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [items])

  const addToCart = (event: any, price: number = 100) => {
    console.log('Adding to cart:', event, 'with price:', price)
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === event.id)
      
      if (existingItem) {
        const updatedItems = prevItems.map(item =>
          item.id === event.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        console.log('Updated item quantity:', updatedItems)
        return updatedItems
      } else {
        const newItem: CartItem = {
          id: event.id,
          title: event.title,
          price,
          quantity: 1,
          image_url: event.image_url,
          venue: event.venue,
          schedule: event.schedule
        }
        const newItems = [...prevItems, newItem]
        console.log('Added new item to cart:', newItems)
        return newItems
      }
    })
  }

  const removeFromCart = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity }
        : item
    ))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const isInCart = (id: string) => {
    return items.some(item => item.id === id)
  }

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart
  }
}