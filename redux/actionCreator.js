const addToCart = product => ({
  type: 'ADD_TO_CART',
  product,
})
const removeFromCart = product => ({
  type: 'REMOVE_FROM_CART',
  product,
})

export { addToCart, removeFromCart }
