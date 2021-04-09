import { Col, Button, message } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { connect } from 'react-redux'
import { removeFromCart } from '../../redux/actionCreator'
import { gql, useMutation } from '@apollo/client'

const USERCARTDEC = gql`
  mutation($id: ID!, $pId: ID!) {
    userCartDec(_id: $id, productId: $pId)
  }
`
const THIRDUSERCARTDEC = gql`
  mutation($id: ID!, $pId: ID!) {
    thirdUserCartDec(_id: $id, productId: $pId) {
      _id
      name
      nickName
      lastName
      age
      phoneNumber
      img
      email
      gender
      country
      city
      district
      addressHome
      reference
      sendEmail
      shopping {
        _id
        productType
      }
      cart {
        img1
        img2
        brand
        model
        description
        productType
        productId
      }
    }
  }
`

const CartProductCard = ({ p, removeFromCartView }) => {
  const [userCartDec] = useMutation(USERCARTDEC)
  const [thirdUserCartDec] = useMutation(THIRDUSERCARTDEC)
  const removeFromCartViewBtn = async product => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('typeUser') === 'USER') {
        await userCartDec({
          variables: {
            id: localStorage.getItem('_id'),
            pId: product.productId,
          },
        })
      }
      if (localStorage.getItem('typeUser') === 'THIRDUSER') {
        await thirdUserCartDec({
          variables: {
            id: localStorage.getItem('_id'),
            pId: product.productId,
          },
        })
      }
    }
    removeFromCartView(product)
    message.info('Eliminacion Correcta')
  }

  return (
    <Col sm={24} md={12} lg={8} xl={6} xxl={3}>
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
              href={`/products/${p.productType.toLowerCase()}/${p.productId}`}
            >
              <a>mas detalles</a>
            </Link>
            .
            <br />
          </div>
        </div>
      </div>
    </Col>
  )
}

const mapStateToProps = () => {}

const mapDispatchToProps = dispatch => {
  return {
    removeFromCartView(product) {
      dispatch(removeFromCart(product))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartProductCard)