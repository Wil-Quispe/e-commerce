import { Row } from 'antd'
import { connect } from 'react-redux'
import ProductCard from '../components/molecules/ProductCard'

const cart = ({ cartList }) => {
  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="columns">
            {cartList.length > 0 ? (
              cartList?.map((d, i) => {
                if (i > 4) {
                  console.log('mayor')
                  return (
                    <Row wrap>
                      <ProductCard key={i} product={d} path="shoes" />
                    </Row>
                  )
                }
                return <ProductCard key={i} product={d} path="shoes" />
              })
            ) : (
              <h1>Aun no tines nada en el carrito de compras</h1>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

const mapStateToProps = state => ({
  cartList: state.cartReducer.cart,
})

export default connect(mapStateToProps, {})(cart)
