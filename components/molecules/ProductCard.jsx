import Link from 'next/link'
import { Button, message } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { addToCart, removeFromCart } from '../../redux/actionCreator'
import { gql, useMutation } from '@apollo/client'

const USERCARTINC = gql`
  mutation($id: ID!, $pId: ID!, $productType: String!) {
    userCartInc(_id: $id, data: { _id: $pId, productType: $productType })
  }
`
const THIRDUSERCARTINC = gql`
  mutation($id: ID!, $pId: ID!, $productType: String!) {
    thirdUserCartInc(_id: $id, data: { _id: $pId, productType: $productType })
  }
`
const USERCARTDEC = gql`
  mutation($id: ID!, $pId: ID!) {
    userCartDec(_id: $id, productId: $pId)
  }
`
const THIRDUSERCARTDEC = gql`
  mutation($id: ID!, $pId: ID!) {
    thirdUserCartDec(_id: $id, productId: $pId)
  }
`

const ProductCard = ({
  product,
  path,
  cols,
  cartList,
  removeFromCartView,
  addToCartView,
}) => {
  const [userCartInc] = useMutation(USERCARTINC)
  const [thirdUserCartInc] = useMutation(THIRDUSERCARTINC)
  const [userCartDec] = useMutation(USERCARTDEC)
  const [thirdUserCartDec] = useMutation(THIRDUSERCARTDEC)
  const addToCartBtn = async product => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('token')) {
        if (localStorage.getItem('typeUser') === 'USER') {
          await userCartInc({
            variables: {
              id: localStorage.getItem('_id'),
              pId: product._id,
              productType: product.__typename,
            },
          })
        }
        if (localStorage.getItem('typeUser') === 'THIRDUSER') {
          await thirdUserCartInc({
            variables: {
              id: localStorage.getItem('_id'),
              pId: product._id,
              productType: product.__typename,
            },
          })
        }
        addToCartView(product)
      } else {
        message.info('tienes que registrarte')
      }
    }
  }
  const removeFromCartViewBtn = async product => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('typeUser') === 'USER') {
        await userCartDec({
          variables: {
            id: localStorage.getItem('_id'),
            pId: product._id,
          },
        })
      }
      if (localStorage.getItem('typeUser') === 'THIRDUSER') {
        console.log('deleted thirdudser')
        await thirdUserCartDec({
          variables: {
            id: localStorage.getItem('_id'),
            pId: product._id,
          },
        })
      }
    }
    removeFromCartView(product)
  }
  // console.log(cartList)
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
              {cartList && cartList.cart?.find(c => c._id === product._id) ? (
                <Button
                  onClick={() => removeFromCartViewBtn(product)}
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
  cartList: state.userReducer.user[0],
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
