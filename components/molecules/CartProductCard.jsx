import { Col, Button, message } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { connect } from 'react-redux'
import { removeFromCart } from '../../redux/actionCreator'
import { gql, useMutation } from '@apollo/client'

const USERCARTDEC = gql`
  mutation ($id: ID!, $pId: ID!) {
    userCartDec(_id: $id, productId: $pId)
  }
`
const THIRDUSERCARTDEC = gql`
  mutation ($id: ID!, $pId: ID!) {
    thirdUserCartDec(_id: $id, productId: $pId) {
      name
    }
  }
`

const CartProductCard = ({ p, removeFromCartView, typeUser }) => {
  const [userCartDec] = useMutation(USERCARTDEC)
  const [thirdUserCartDec] = useMutation(THIRDUSERCARTDEC)

  const removeFromCartViewBtn = async product => {
    if (typeUser.__typename === 'UserThirdServices') {
      await thirdUserCartDec({
        variables: {
          id: localStorage.getItem('_id'),
          pId: product.productId,
        },
      })
    } else {
      await userCartDec({
        variables: {
          id: localStorage.getItem('_id'),
          pId: product.productId,
        },
      })
    }
    removeFromCartView(product)
    message.info('Eliminacion Correcta')
    const productContainer = document.getElementById(`${p.productId}`)
    productContainer.remove()
  }

  return (
    <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={3} id={`${p.productId}`}>
      <div className="card">
        <div className="card-image">
          <figure className="image is-4by3">
            <img src={p.img1} alt={p.brand} style={{ objectFit: 'cover' }} />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={p.img2} alt={p.brand} />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-4">{p.brand}</p>
              <p className="subtitle is-6">{p.model}</p>
            </div>
            <Button
              onClick={() => removeFromCartViewBtn(p)}
              type="primary"
              danger
              icon={<ShoppingCartOutlined />}
            />
          </div>
          <div className="content">
            {p.description}{' '}
            <Link
              href={`/productos/${p.typeProduct.toLowerCase()}/${p.productId}`}
            >
              <a>más detalles</a>
            </Link>
            .
            <br />
          </div>
        </div>
      </div>
    </Col>
  )
}

const mapStateToProps = state => {
  return {
    typeUser: state.userReducer.user[0],
  }
}
const mapDispatchToProps = dispatch => {
  return {
    removeFromCartView(product) {
      dispatch(removeFromCart(product))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartProductCard)
