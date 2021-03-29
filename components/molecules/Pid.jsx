import { useState } from 'react'
import { connect } from 'react-redux'
import { gql, useMutation } from '@apollo/client'
import {
  message,
  Row,
  Tag,
  Button,
  Col,
  Image,
  Card,
  Descriptions,
  Form,
  Input,
  Checkbox,
  Divider,
} from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const USERUPDATE = gql`
  mutation(
    $id: ID!
    $phoneNumber: String!
    $city: String!
    $district: String!
    $addressHome: String!
    $reference: String!
    $sendEmail: Boolean
  ) {
    userUpdate(
      _id: $id
      data: {
        phoneNumber: $phoneNumber
        city: $city
        district: $district
        addressHome: $addressHome
        reference: $reference
        sendEmail: $sendEmail
      }
    ) {
      name
    }
  }
`
const THIRDUSERUPDATE = gql`
  mutation(
    $id: ID!
    $phoneNumber: String!
    $city: String!
    $district: String!
    $addressHome: String!
    $reference: String!
    $sendEmail: Boolean
  ) {
    thirdServicesUpdate(
      _id: $id
      data: {
        phoneNumber: $phoneNumber
        city: $city
        district: $district
        addressHome: $addressHome
        reference: $reference
        sendEmail: $sendEmail
      }
    ) {
      name
    }
  }
`
const STRIPE = gql`
  mutation Stripe(
    $id: ID!
    $amount: Int!
    $name: String
    $imgUser: String
    $phoneNumber: String
    $email: String
    $brand: String
    $model: String
    $price: Int
    $imgProduct: String
  ) {
    stripe(
      data: {
        id: $id
        amount: $amount
        name: $name
        imgUser: $imgUser
        phoneNumber: $phoneNumber
        email: $email
        brand: $brand
        model: $model
        price: $price
        imgProduct: $imgProduct
      }
    )
  }
`
const USERSHOPPINGINC = gql`
  mutation($id: ID!, $pId: ID!, $prodType: String!) {
    userShoppingInc(_id: $id, data: { _id: $pId, productType: $prodType }) {
      _id
    }
  }
`
const THIRDUSERSHOPPINGINC = gql`
  mutation($id: ID!, $pId: ID!, $prodType: String!) {
    thirdUserShoppingInc(
      _id: $id
      data: { _id: $pId, productType: $prodType }
    ) {
      _id
    }
  }
`
const ADMINSALESINC = gql`
  mutation($id: ID!, $prodType: String!) {
    adminSalesInc(data: { _id: $id, productType: $prodType })
  }
`

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
}

const Pid = ({ product, userInfo }) => {
  const [buy, setBuy] = useState('')
  const [empty, setEmpty] = useState(true)
  const [formBuy, setFormBuy] = useState('none')
  const [stripe] = useMutation(STRIPE)
  const [userUpdate] = useMutation(USERUPDATE)
  const [thirdServicesUpdate] = useMutation(THIRDUSERUPDATE)
  const [userShoppingInc] = useMutation(USERSHOPPINGINC)
  const [thirdUserShoppingInc] = useMutation(THIRDUSERSHOPPINGINC)
  const [adminSalesInc] = useMutation(ADMINSALESINC)
  const stripeJS = useStripe()
  const elements = useElements()

  const handleSubmit = async values => {
    const {
      phoneNumber,
      city,
      district,
      addressHome,
      reference,
      sendEmail,
    } = values
    if (userInfo.__typename === 'User') {
      try {
        const result = await userUpdate({
          variables: {
            id: userInfo._id,
            phoneNumber,
            city,
            district,
            addressHome,
            reference,
            sendEmail,
          },
        })
      } catch (error) {
        message.error(error)
      }
    }
    if (userInfo.__typename === 'UserThirdServices') {
      try {
        const result = await thirdServicesUpdate({
          variables: {
            id: userInfo._id,
            phoneNumber,
            city,
            district,
            addressHome,
            reference,
            sendEmail,
          },
        })
      } catch (error) {
        message.error(error)
      }
    }
    if (empty) return message.info('Ingrese su Numero de tarjeta')

    const { error, paymentMethod } = await stripeJS.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })
    if (paymentMethod) {
      const { id } = paymentMethod
      const data = await stripe({
        variables: {
          id,
          amount: Number(product.price * 100),
          name: userInfo.name,
          imgUser: userInfo.img,
          phoneNumber: userInfo.phoneNumber,
          email: userInfo.email,
          brand: product.brand,
          model: product.model,
          price: product.price,
          imgProduct: product.imgs[0],
        },
      })
      if (userInfo.__typename === 'User') {
        await userShoppingInc({
          variables: {
            id: userInfo._id,
            pId: product._id,
            prodType: product.__typename,
          },
        })
      } else {
        await thirdUserShoppingInc({
          variables: {
            id: userInfo._id,
            pId: product._id,
            prodType: product.__typename,
          },
        })
      }
      await adminSalesInc({
        variables: { id: product._id, prodType: product.__typename },
      })

      if (data) {
        if (typeof window !== 'undefined') {
          window.location = '/payment/success'
        }
      }
    }
    if (error) {
      if (typeof window !== 'undefined') {
        window.location = '/payment/error'
      }
    }
  }
  return (
    <section className="section">
      <div className="container">
        <Row justify="center" gutter={[16, 16]}>
          <Col span={8}>
            <Image.PreviewGroup>
              <Row justify="center">
                <Image width={200} src={`${product.imgs[0]}`} />
              </Row>
              <Row justify="center">
                {product.imgs.map((pi, i) => {
                  if (i === 0) return null
                  return (
                    <Col
                      key={i}
                      style={{
                        margin: '.5em .5em 0 0',
                      }}
                    >
                      <Image width={50} src={`${pi}`} />
                    </Col>
                  )
                })}
              </Row>
            </Image.PreviewGroup>
          </Col>

          <Col>
            <Card
              title={`Product name ${product.brand}- ${product.model}`}
              bordered={false}
              hoverable={true}
              style={{ width: 600 }}
            >
              <Card type="inner" title="Descrición del producto">
                <p>{product.description}</p>
              </Card>
              <Descriptions title="Informarción del producto">
                <Descriptions.Item label="stock">
                  {product.stock}
                </Descriptions.Item>
                <Descriptions.Item label="marka">
                  {product.brand}
                </Descriptions.Item>
                <Descriptions.Item label="modelo">
                  {product.model}
                </Descriptions.Item>
                <Descriptions.Item label="precio">
                  {product.price}$
                </Descriptions.Item>
                <Descriptions.Item label="genero">
                  {product.gender}
                </Descriptions.Item>
                <Descriptions.Item label="material">
                  {product.material}
                </Descriptions.Item>
                {product.size && (
                  <Descriptions.Item label="tallas">
                    {product.size.map((p, i) => (
                      <Tag color="#108ee9" key={i}>
                        {p}
                      </Tag>
                    ))}
                  </Descriptions.Item>
                )}
              </Descriptions>

              <Row justify="center" style={{ display: `${buy}` }}>
                <Button
                  type="primary"
                  shape="round"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => {
                    if (
                      typeof window !== 'undefined' &&
                      localStorage.getItem('token')
                    ) {
                      setBuy('none'), setFormBuy('block')
                    } else {
                      message.info('Tienes que Iniciar Session o Registrarte')
                    }
                  }}
                >
                  Comprar
                </Button>
              </Row>
            </Card>
          </Col>
          <Row>
            <Card hoverable>
              {userInfo && (
                <Form
                  {...formItemLayout}
                  style={{ width: '400px', display: `${formBuy}` }}
                  onFinish={handleSubmit}
                  initialValues={{
                    phoneNumber: userInfo.phoneNumber || '',
                    city: userInfo.city || '',
                    district: userInfo.district || '',
                    addressHome: userInfo.addressHome || '',
                    reference: userInfo.reference || '',
                    sendEmail: userInfo.sendEmail,
                  }}
                >
                  <CardElement
                    onChange={e => {
                      if (!e.empty) {
                        setEmpty(false)
                      } else {
                        setEmpty(true)
                      }
                    }}
                  />
                  <Divider>Datos Correctos?</Divider>
                  <Form.Item
                    label="Celular"
                    name="phoneNumber"
                    rules={[{ required: true, message: 'Campo requerido' }]}
                  >
                    <Input addonBefore="+51" />
                  </Form.Item>
                  <Form.Item
                    label="Ciudad"
                    name="city"
                    rules={[{ required: true, message: 'Campo requerido' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Distrito"
                    name="district"
                    rules={[{ required: true, message: 'Campo requerido' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Direccion"
                    name="addressHome"
                    rules={[{ required: true, message: 'Campo requerido' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Referencia"
                    name="reference"
                    rules={[{ required: true, message: 'Campo requerido' }]}
                  >
                    <Input />
                  </Form.Item>

                  {userInfo.sendEmail ? null : (
                    <Row justify="center">
                      <Form.Item
                        name="sendEmail"
                        valuePropName="checked"
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <Checkbox>recibire emails de nuevos productos</Checkbox>
                      </Form.Item>
                    </Row>
                  )}
                  <Row justify="center">
                    <Button
                      type="primary"
                      shape="round"
                      htmlType="submit"
                      icon={<ShoppingCartOutlined />}
                    >
                      Comprar
                    </Button>
                  </Row>
                </Form>
              )}
            </Card>
          </Row>
        </Row>
      </div>
    </section>
  )
}

const mapStateToProps = state => ({
  userInfo: state.userReducer.user[0],
})

export default connect(mapStateToProps, {})(Pid)
