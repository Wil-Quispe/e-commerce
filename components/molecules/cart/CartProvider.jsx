import { useReducer } from 'react'
import CartContext from './cartContext'

const initialState = {
  cart: [],
}

const cartReducer = (state, { type, products }) => {
  switch (type) {
    case 'ADD_TO_CART':
      return {
        cart: state.cart.concat(products),
      }

    case 'REMOVE_FROM_CART':
      return {
        cart: state.cart.filter(p => p !== products),
      }
  }

  return state
}

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartContext.Provider value={[state, dispatch]}>
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider
