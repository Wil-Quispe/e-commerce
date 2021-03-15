import { Row } from 'antd'
import { useState } from 'react'
import CartContext from '../components/molecules/cart/cartContext'
import ProductCard from '../components/molecules/ProductCard'

const cart = () => {
  const [cart, setCart] = useState()
  return (
    <main>
      <CartContext.Consumer>
        {context => setCart(context[0].cart)}
      </CartContext.Consumer>
      <section className="section">
        <div className="container">
          <div className="columns">
            {cart ? (
              cart.map((c, i) => <ProductCard product={c} key={i} />)
            ) : (
              <Row justify="center" style={{ width: '100%' }}>
                <h2>No tienes ningun producto agregado al carrito</h2>
              </Row>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default cart
