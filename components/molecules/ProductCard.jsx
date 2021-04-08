import Link from 'next/link'
import { Button, message } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { addToCart } from '../../redux/actionCreator'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { addtUserInfo } from '../../redux/actionCreator'
import LinkCustom from '../Atoms/LinkCustom'

const USERCARTINC = gql`
  mutation(
    $id: ID!
    $img1: String!
    $img2: String!
    $brand: String!
    $model: String!
    $description: String!
    $productType: String!
    $productId: ID!
  ) {
    userCartInc(
      _id: $id
      data: {
        img1: $img1
        img2: $img2
        brand: $brand
        model: $model
        description: $description
        productType: $productType
        productId: $productId
      }
    )
  }
`
const THIRDUSERCARTINC = gql`
  mutation(
    $id: ID!
    $img1: String!
    $img2: String!
    $brand: String!
    $model: String!
    $description: String!
    $productType: String!
    $productId: ID!
  ) {
    thirdUserCartInc(
      _id: $id
      data: {
        img1: $img1
        img2: $img2
        brand: $brand
        model: $model
        description: $description
        productType: $productType
        productId: $productId
      }
    )
  }
`
const THIRDUSER = gql`
  query($id: ID!) {
    thirdUser(_id: $id) {
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

const ProductCard = ({
  product,
  path,
  cols,
  addToCartView,
  addUserInfoView,
}) => {
  const [thirdUser, { data }] = useLazyQuery(THIRDUSER)
  const [userCartInc] = useMutation(USERCARTINC)
  const [thirdUserCartInc] = useMutation(THIRDUSERCARTINC)
  const [Counter, setCounter] = useState(0)
  useEffect(async () => {
    thirdUser({
      variables: { id: localStorage.getItem('_id') },
    })
    addUserInfoView(data)
  }, [Counter])

  const addToCartBtn = async product => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('token')) {
        if (localStorage.getItem('typeUser') === 'USER') {
          await userCartInc({
            variables: {
              id: localStorage.getItem('_id'),
              img1: product.imgs[0],
              img2: product.imgs[1],
              brand: product.brand,
              model: product.model,
              description: product.description,
              productType: product.__typename,
              productId: product._id,
            },
          })
        }
        if (localStorage.getItem('typeUser') === 'THIRDUSER') {
          await thirdUserCartInc({
            variables: {
              id: localStorage.getItem('_id'),
              img1: product.imgs[0],
              img2: product.imgs[1],
              brand: product.brand,
              model: product.model,
              description: product.description,
              productType: product.__typename,
              productId: product._id,
            },
          })
        }
        setCounter(Counter + 1)
        addToCartView(product)
        message.info('Agregado al Carrito')
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
                  src={`${product.imgs[0] || product.img1}`}
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
                  <img
                    src={`${product.imgs[1] || product.img2}`}
                    alt="Placeholder image"
                  />
                </figure>
              </div>
              <div className="media-content">
                <p className="title is-4">{product.brand}</p>
                <p className="subtitle is-6">{product.model}</p>
              </div>
              <Button
                onClick={() => addToCartBtn(product)}
                type="primary"
                icon={<ShoppingCartOutlined />}
              />
            </div>
            <div className="content">
              {product.description}{' '}
              <Link href={`/products/${path}/${product._id}`}>
                <a>
                  <LinkCustom text="mas detalles" />
                </a>
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
    addUserInfoView(userInfo) {
      dispatch(addtUserInfo(userInfo))
    },
    addToCartView(product) {
      dispatch(addToCart(product))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard)
