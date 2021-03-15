import Link from 'next/link'
import { Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'

const ProductCard = ({ product, path, cols }) => {
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
            <Button type="primary" icon={<ShoppingCartOutlined />} />
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
