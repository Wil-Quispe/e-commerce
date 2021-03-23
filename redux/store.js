import { combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

const cartInitialState = {
  cart: [],
}

const cartReducer = (state = cartInitialState, { type, product }) => {
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

const userInitialState = {
  user: [],
}

const userReducer = (state = userInitialState, action) => {
  let typeUser = typeof window !== 'undefined' && localStorage.getItem('redux')
  // console.log(action)
  // console.log(typeUser)
  switch (action.type) {
    case 'ADD_USER_INFO':
      if (state.user[0]) return state
      else if (action.userInfo)
        switch (typeUser) {
          case 'thirdUser':
            // console.log('third added')
            return {
              user: state.user.concat(action.userInfo.thirdUser),
            }
          case 'user':
            return {
              user: state.user.concat(action.userInfo.user),
            }
          case 'admin':
            return {
              user: state.user.concat(action.userInfo.admin),
            }
        }
  }
  return state
}

export default createStore(
  combineReducers({ cartReducer, userReducer }),
  composeWithDevTools()
)
