import { Row } from 'antd'
import { connect } from 'react-redux'
import { navMobileNotSee } from '../redux/actionCreator'
import { useEffect } from 'react'
import CartProductCard from '../components/molecules/CartProductCard'
import Head from 'next/head'
import Spinner from '../components/Atoms/Spinner'
import Link from 'next/link'

const cart = ({ cartList, navNotSeeView }) => {
  if (!Boolean(localStorage.getItem('token')))
    return (
      <div
        className='result_page'
        style={{ textAlign: 'center', margin: '1.5em 3em' }}
      >
        <h1>
          Tienes que iniciar sesión y agregar ítems a tu carrito para ver algún
          contenido
        </h1>
        <Link href='/'>Inicio</Link>
      </div>
    )
  useEffect(() => {
    navNotSeeView()
  }, [])
  return (
    <>
      <Head>
        <title>Carrito | {process.env.SITE_NAME}</title>
      </Head>
      <Row justify='center' gutter={[16, 16]} style={{ margin: '1.5em 3em' }}>
        {cartList ? (
          <>
            {cartList?.cart.length > 0 ? (
              cartList.cart.map((p, i) => {
                return <CartProductCard p={p} key={i} />
              })
            ) : (
              <h1 className='result_page'>Tu Carrito esta bacio</h1>
            )}
          </>
        ) : (
          <Spinner />
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
