export const addToCart = product => ({
  type: 'ADD_TO_CART',
  product,
})

export const removeFromCart = product => ({
  type: 'REMOVE_FROM_CART',
  product,
})

export const addtUserInfo = userInfo => ({
  type: 'ADD_USER_INFO',
  userInfo,
})

export const addSells = sells => ({
  type: 'ADD_SELLS',
  sells,
})

export const navMobileSee = () => ({
  type: 'NAV_MOBILE_SEE',
})

export const navMobileNotSee = () => ({
  type: 'NAV_MOBILE_NOT_SEE',
})
