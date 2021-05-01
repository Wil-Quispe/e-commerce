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
import { loadingFalse } from '../../redux/actionCreator'
import Head from 'next/head'
import Paypal from '../Atoms/Paypal'

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
  mutation Stripe($id: ID!, $amount: Int!) {
    stripe(data: { id: $id, amount: $amount })
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
const MESSAGEWHATSAPP = gql`
  mutation($msgWhats: String!) {
    sendMsgWa(msg: $msgWhats)
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

const { Meta } = Card

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
  const [sendMsgWa] = useMutation(MESSAGEWHATSAPP)
  const stripeJS = useStripe()
  const elements = useElements()

  const handleBuy = async values => {
    const {
      phoneNumber,
      city,
      district,
      addressHome,
      reference,
      sendEmail,
    } = values

    // actualiza algunos datos del usuario
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

    // ejecutando el pago por stripe
    const { error, paymentMethod } = await stripeJS.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })

    //si es valido el metodo de pago del cliente
    if (paymentMethod) {
      const { id } = paymentMethod
      const data = await stripe({
        variables: {
          id,
          amount: Number(product.price * 100),
        },
      })

      // envia mensage a whatsapp del admin
      sendMsgWa({
        variables: {
          msgWhats: `
Felicitaciones ✨🙌 nueva venta!

        Cliente:
nombre: ${userInfo.name}
celular: ${phoneNumber}
email: ${userInfo.email}
ciudad: ${city}
distrito: ${district}
direccion: ${addressHome}
referencia: ${reference}

        Producto:
Tproducto: ${product.typeProduct}
marca: ${product.brand}
modelo: ${product.model}
precio: ${product.price}$
      `,
        },
      })

      // aumenta el contador de compras del usuario
      if (userInfo.__typename === 'User') {
        await userShoppingInc({
          variables: {
            id: userInfo._id,
            pId: product._id,
            prodType: product.typeProduct,
          },
        })
      } else {
        await thirdUserShoppingInc({
          variables: {
            id: userInfo._id,
            pId: product._id,
            prodType: product.typeProduct,
          },
        })
      }

      // aumenta el contador de ventas del admin
      await adminSalesInc({
        variables: { id: product._id, prodType: product.typeProduct },
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
    <>
      <Head>
        <title>
          {`${product.brand} - ${product.model}`} | {process.env.SITE_NAME}
        </title>
      </Head>
      <section className="section">
        <div className="container">
          <Row justify="center" gutter={[16, 16]}>
            <Row justify="center">
              <Col lg={12} md={24}>
                <Image.PreviewGroup>
                  <Row justify="center">
                    <Image width={200} src={`${product.imgs[0].pathImg}`} />
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
                          <Image width={50} src={`${pi.pathImg}`} />
                        </Col>
                      )
                    })}
                  </Row>
                </Image.PreviewGroup>
              </Col>

              <Col lg={12} md={24}>
                <Card
                  title={`Nombre: ${product.brand}- ${product.model}`}
                  bordered={false}
                  hoverable={true}
                >
                  <Meta
                    title="Descripcion del producto"
                    description={product.description}
                  />
                  <Descriptions title="Informarción extra">
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
                          message.info(
                            'Tienes que Iniciar Session o Registrarte'
                          )
                        }
                      }}
                    >
                      Comprar
                    </Button>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row justify="center" style={{ display: `${formBuy}` }}>
              <Col>
                <Card hoverable>
                  {userInfo && (
                    <Form
                      {...formItemLayout}
                      onFinish={handleBuy}
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
                          <Form.Item name="sendEmail" valuePropName="checked">
                            <Checkbox
                              style={{
                                textAlign: 'center',
                                width: '200px',
                              }}
                            >
                              recibire emails de nuevos productos
                            </Checkbox>
                          </Form.Item>
                        </Row>
                      )}
                      <Paypal />
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
              </Col>
            </Row>
          </Row>
        </div>
      </section>
    </>
  )
}

const mapStateToProps = state => ({
  userInfo: state.userReducer.user[0],
})

export default connect(mapStateToProps, {})(Pid)
