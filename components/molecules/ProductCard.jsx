import Link from 'next/link'
import { Button, message, Col, Typography } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { addToCart } from '../../redux/actionCreator'
import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import LinkCustom from '../Atoms/LinkCustom'

const USERCARTINC = gql`
  mutation (
    $id: ID!
    $img1: String!
    $img2: String!
    $brand: String!
    $model: String!
    $description: String!
    $typeProduct: String!
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
        typeProduct: $typeProduct
        productId: $productId
      }
    )
  }
`
const THIRDUSERCARTINC = gql`
  mutation (
    $id: ID!
    $img1: String!
    $img2: String!
    $brand: String!
    $model: String!
    $description: String!
    $typeProduct: String!
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
        typeProduct: $typeProduct
        productId: $productId
      }
    )
  }
`
const { Paragraph } = Typography

const ProductCard = ({ product, path, addToCartView }) => {
  const [userCartInc] = useMutation(USERCARTINC)
  const [thirdUserCartInc] = useMutation(THIRDUSERCARTINC)
  const [Counter, setCounter] = useState(0)

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
              typeProduct: product.typeProduct,
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
              typeProduct: product.typeProduct,
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
    <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={3}>
      <div className="card">
        <div className="card-image">
          <Link href={`/productos/${path}/${product._id}`}>
            <figure className="image is-4by3">
              <img
                src={`${product.imgs[0].pathImg || product.img[1].pathImg}`}
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
                  src={`${product.imgs[1].pathImg || product.img[2].pathImg}`}
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
            <Paragraph style={{ margin: '0' }} ellipsis={{ rows: 2 }}>
              {product.description}
            </Paragraph>
            <Link href={`/productos/${path}/${product._id}`}>
              <a>
                <LinkCustom text="mas detalles" />
              </a>
            </Link>
            <br />
          </div>
        </div>
      </div>
    </Col>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard)
