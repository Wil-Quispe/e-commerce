import { combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

const navInitialState = {
  nav: '',
}
const navMobileReducer = (state = navInitialState, action) => {
  switch (action.type) {
    case 'NAV_MOBILE_SEE':
      localStorage.setItem('navMobile', 'is-active')
      return {
        nav: state.nav.replace('', 'is-active'),
      }
    case 'NAV_MOBILE_NOT_SEE':
      localStorage.setItem('navMobile', '')
      return {
        nav: state.nav.replace('is-active', ''),
      }
  }
  return state
}

const initialStates = {
  loading: false,
}

const stateReducer = (state = initialStates, action) => {
  switch (action.type) {
    case 'LOADING_TRUE':
      return {
        loading: (state.loading = true),
      }

    case 'LOADING_FALSE':
      return {
        loading: (state.loading = false),
      }
  }
  return state
}

const cartInitialState = {
  cart: typeof window !== 'undefined' && Number(localStorage.getItem('cart')),
}
const cartReducer = (state = cartInitialState, { type, product }) => {
  switch (type) {
    case 'ADD_TO_CART':
      return {
        cart: state.cart + 1,
      }

    case 'REMOVE_FROM_CART':
      return {
        cart: state.cart - 1,
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

const sellsInitialState = {
  sells: [],
}
const sellsReducer = (state = sellsInitialState, action) => {
  // console.log(action.sells)
  switch (action.type) {
    case 'ADD_SELLS':
      return {
        ...state,
        sells: state.sells.concat(action.sells),
      }
  }
  return state
}

export default createStore(
  combineReducers({
    cartReducer,
    userReducer,
    sellsReducer,
    navMobileReducer,
    stateReducer,
  }),
  composeWithDevTools()
)
