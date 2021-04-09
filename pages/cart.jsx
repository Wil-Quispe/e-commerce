import { Row } from 'antd'
import { connect } from 'react-redux'
import { navMobileNotSee } from '../redux/actionCreator'
import { useEffect } from 'react'
import CartProductCard from '../components/molecules/CartProductCard'
import Head from 'next/head'

const cart = ({ cartList, navNotSeeView }) => {
  useEffect(() => {
    navNotSeeView()
  }, [])
  return (
    <>
      <Head>
        <title>Carrito | {process.env.SITE_NAME}</title>
      </Head>
      <Row justify="center" gutter={[16, 16]} style={{ margin: '1.5em 3em' }}>
        {cartList?.cart.length > 0 ? (
          cartList.cart.map((p, i) => {
            return <CartProductCard p={p} key={i} />
          })
        ) : (
          <h1>Tu Carrito esta bacio</h1>
        )}
      </Row>
    </>
  )
}

const mapStateToProps = state => ({
  cartList: state.userReducer.user[0],
})

const mapDispatchToProps = dispatch => {
  return {
    navNotSeeView() {
      dispatch(navMobileNotSee())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(cart)
