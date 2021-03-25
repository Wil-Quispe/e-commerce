import Link from 'next/link'
import { Button, message } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { addToCart, removeFromCart } from '../../redux/actionCreator'

const ProductCard = ({
  product,
  path,
  cols,
  cartList,
  removeFromCartView,
  addToCartView,
}) => {
  const addToCartBtn = product => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('token')) {
        addToCartView(product)
      } else {
        message.info('tienes que registrarte')
      }
    }
  }

  return (
    <>
      <div className={`column is-${cols || 3}`}>
        <div className="card">
          <div className="card-image">
            <Link href={`/products/${path}/${product._id}`}>
              <figure className="image is-4by3">
                <img
                  src={`${product.imgs[0]}`}
                  alt="Placeholder image"
                  style={{ objectFit: 'cover' }}
                />
              </figure>
            </Link>
          </div>
          <div className="card-content">
            <div className="media">
              <div className="media-left">
                <figure className="image is-48x48">
                  <img src={`${product.imgs[1]}`} alt="Placeholder image" />
                </figure>
              </div>
              <div className="media-content">
                <p className="title is-4">{product.brand}</p>
                <p className="subtitle is-6">{product.model}</p>
              </div>
              {cartList && cartList.find(c => c === product) ? (
                <Button
                  onClick={() => removeFromCartView(product)}
                  type="primary"
                  danger
                  icon={<ShoppingCartOutlined />}
                />
              ) : (
                <Button
                  onClick={() => addToCartBtn(product)}
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                />
              )}
            </div>
            <div className="content">
              {product.description}{' '}
              <Link href={`/products/${path}/${product._id}`}>
                <a>mas detalles</a>
              </Link>
              .
              <br />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  cartList: state.cartReducer.cart,
})
const mapDispatchToProps = dispatch => {
  return {
    addToCartView(product) {
      dispatch(addToCart(product))
    },
    removeFromCartView(product) {
      dispatch(removeFromCart(product))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard)
