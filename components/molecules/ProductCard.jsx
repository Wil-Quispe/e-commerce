import Link from 'next/link'
import { useContext } from 'react'
import { Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import CartContext from '../molecules/cart/cartContext'

const ProductCard = ({ product, path, cols }) => {
  const [state, dispatch] = useContext(CartContext)

  return (
    <div className={`column is-${cols || 3}`}>
      <div className="card">
        <div className="card-image">
          <Link href={`/products/${path}/${product._id}?name=${product.model}`}>
            <figure className="image is-4by3">
              <img src={`${product.imgs[0]}`} alt="Placeholder image" />
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
            {state.cart.find(c => c === product) ? (
              <Button
                type="primary"
                danger
                size="small"
                icon={<ShoppingCartOutlined />}
                onClick={() =>
                  dispatch({
                    type: 'REMOVE_FROM_CART',
                    products: product,
                  })
                }
              />
            ) : (
              <Button
                type="primary"
                size="small"
                icon={<ShoppingCartOutlined />}
                onClick={() =>
                  dispatch({
                    type: 'ADD_TO_CART',
                    products: product,
                  })
                }
              />
            )}
          </div>
          <div className="content">
            {product.description}{' '}
            <Link href="#">
              <a>mas detalles</a>
            </Link>
            .
            <br />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
