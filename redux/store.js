import { createStore } from 'redux'

const initialState = {
  cart: [],
}

const cartReducer = (state = initialState, { type, product }) => {
  switch (type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: state.cart.concat(product),
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(c => c._id !== product._id),
      }
  }
  return state
}

export default createStore(cartReducer)
