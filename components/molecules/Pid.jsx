import { useEffect, useState } from 'react'
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
  Select,
  InputNumber,
  Checkbox,
  Divider,
  Collapse,
} from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import Head from 'next/head'
import usePaypal from '../Atoms/Paypal'
import PayPeru from '../Atoms/PayPeru'
import ProductToBuy from '../Atoms/ProductToBuy'

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
const SENDMSGTELEGRAM = gql`
  mutation($msg: String!) {
    sendMsgTelegram(message: $msg)
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
const { Panel } = Collapse
const { Option } = Select

const Pid = ({ product, userInfo }) => {
  //mostrar algun formulario
  const [buy, setBuy] = useState('')
  const [formBuy, setFormBuy] = useState('none')
  const [dataProduct, setDataProduct] = useState({ form: 'none', btn: '' })

  const [userInfoUpdate, setUserInfoUpdate] = useState(false)
  const [userUpdate] = useMutation(USERUPDATE)
  const [thirdServicesUpdate] = useMutation(THIRDUSERUPDATE)
  const [userShoppingInc] = useMutation(USERSHOPPINGINC)
  const [thirdUserShoppingInc] = useMutation(THIRDUSERSHOPPINGINC)
  const [adminSalesInc] = useMutation(ADMINSALESINC)
  const [sendMsgTelegram] = useMutation(SENDMSGTELEGRAM)
  const [dataUser, setDataUser] = useState({})
  const { PayPal, dataPay } = usePaypal({
    description: product.model,
    amount: Number(product.price) * dataUser.product?.units,
  })
  const [windowSize, setWindowSize] = useState(window.innerWidth)
  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowSize(innerWidth)
    })

    if (dataPay?.status === 'ok') {
      confirmPurchase()
    }
    if (dataPay?.status === 'error') {
      window.location = '/pago/error'
    }
  }, [dataPay])

  const collExtra = (imgUrl) => (
    <Image src={imgUrl} width={20} preview={false} />
  )

  const handleBuy = async (values) => {
    const {
      phoneNumber,
      city,
      district,
      addressHome,
      reference,
      sendEmail,
    } = values

    setDataUser({ ...dataUser, user: values })

    // actualiza algunos datos del usuario
    if (userInfo.__typename === 'User') {
      try {
        await userUpdate({
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
        setUserInfoUpdate(true)
      } catch (error) {
        message.error(error)
      }
    }
    if (userInfo.__typename === 'UserThirdServices') {
      try {
        await thirdServicesUpdate({
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
        setUserInfoUpdate(true)
      } catch (error) {
        message.error(error)
      }
    }
  }

  const confirmPurchase = async () => {
    // envia mensage a whatsapp del admin
    sendMsgTelegram({
      variables: {
        msg: `
      Felicitaciones ✨🙌 nueva venta!
              Cliente:
      nombre: ${userInfo.name}
      celular: ${dataUser.user.phoneNumber || userInfo.phoneNumber} 
      email: ${userInfo.email}
      ciudad: ${dataUser.user.city || userInfo.city}
      distrito: ${dataUser.user.district || userInfo.district}
      direccion: ${dataUser.user.addressHome || userInfo.addressHome}
      referencia: ${dataUser.user.reference || userInfo.reference}
              Producto:
      Tproducto: ${product.typeProduct}
      marca: ${product.brand}
      modelo: ${product.model}
      unidades: ${dataUser.product.units}
      talla: ${dataUser.product.size}
      precio unitario: ${product.price}$
      precio total: ${Number(product.price) * dataUser.product.units}$
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

    window.location = '/pago/exitoso'
  }

  const dataProductSend = async (values) => {
    setDataUser({ product: values })
    setDataProduct({ btn: 'none' })
    setFormBuy('block')
  }

  const productToBuyProps = {
    brand: product.brand,
    model: product.model,
    gender: product.gender,
    material: product.material,
    size: dataUser.product?.size,
    units: dataUser.product?.units,
    price: product.price,
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
                  title={`Modelo: ${product.brand} - ${product.model}`}
                  bordered={false}
                  hoverable={true}
                >
                  <Meta description={product.description} />
                  <Descriptions
                    title="Información del producto"
                    style={{ margin: '.3em 0 0' }}
                  >
                    <Descriptions.Item label="stock">
                      {product.stock}
                    </Descriptions.Item>
                    <Descriptions.Item label="marca">
                      {product.brand}
                    </Descriptions.Item>
                    <Descriptions.Item label="modelo">
                      {product.model}
                    </Descriptions.Item>
                    <Descriptions.Item label="precio">
                      {product.price}$
                    </Descriptions.Item>
                    <Descriptions.Item label="género">
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
                          setBuy('none'), setDataProduct({ form: 'block' })
                        } else {
                          message.info(
                            'Tienes que Iniciar Session o Registrarte',
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
            <Row
              justify="center"
              style={{ display: `${dataProduct.form}`, width: '60vw' }}
            >
              <Col>
                <Card hoverable>
                  <Form onFinish={dataProductSend} {...formItemLayout}>
                    <Divider>Datos del Producto</Divider>
                    <Row justify="center">
                      <Col style={{ width: '60%' }}>
                        <Form.Item
                          label="talla"
                          name="size"
                          rules={[
                            { required: true, message: 'Campo requerido' },
                          ]}
                        >
                          <Select allowClear>
                            {product?.size.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="unidades"
                          name="units"
                          rules={[
                            { required: true, message: 'Campo requerido' },
                          ]}
                        >
                          <InputNumber min={1} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row
                      justify="center"
                      style={{ display: `${dataProduct.btn}` }}
                    >
                      <Button type="primary" htmlType="submit">
                        Siguiente
                      </Button>
                    </Row>
                  </Form>
                </Card>
              </Col>
            </Row>
            <Row
              justify="center"
              style={{
                display: `${formBuy}`,
                width: '100%',
              }}
            >
              <Col>
                <Card hoverable>
                  {userInfo && (
                    <Form
                      id="form"
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
                      <Divider>Datos Correctos?</Divider>
                      {windowSize >= 992 ? (
                        <Row justify="space-around">
                          <Col style={{ width: '50%' }}>
                            <Form.Item
                              label="Celular"
                              name="phoneNumber"
                              className="center_item"
                              rules={[
                                { required: true, message: 'Campo requerido' },
                              ]}
                            >
                              <Input addonBefore="+51" />
                            </Form.Item>
                            <Form.Item
                              className="center_item"
                              label="Ciudad"
                              name="city"
                              rules={[
                                { required: true, message: 'Campo requerido' },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              label="Distrito"
                              name="district"
                              className="center_item"
                              rules={[
                                { required: true, message: 'Campo requerido' },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              label="Dirección"
                              name="addressHome"
                              className="center_item"
                              rules={[
                                { required: true, message: 'Campo requerido' },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              label="Referencia"
                              name="reference"
                              className="center_item"
                              rules={[
                                { required: true, message: 'Campo requerido' },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                            {userInfo.sendEmail ? null : (
                              <Row justify="center">
                                <Form.Item
                                  name="sendEmail"
                                  valuePropName="checked"
                                >
                                  <Checkbox
                                    style={{
                                      textAlign: 'center',
                                      width: '200px',
                                    }}
                                  >
                                    Recibiré emails de nuevos productos
                                  </Checkbox>
                                </Form.Item>
                              </Row>
                            )}
                            {userInfoUpdate === false && (
                              <Row justify="center">
                                <Button type="primary" htmlType="submit">
                                  Siguiente
                                </Button>
                              </Row>
                            )}
                          </Col>
                          {userInfoUpdate && (
                            <Col style={{ width: '50%' }}>
                              <ProductToBuy {...productToBuyProps} />
                              <Collapse accordion>
                                <Panel
                                  header="Pagar con Paypal"
                                  extra={collExtra('/paypal.jpg')}
                                >
                                  <Row justify="center">
                                    <Col>
                                      <PayPal />
                                    </Col>
                                  </Row>
                                </Panel>
                                <Panel
                                  header="Pagar con Yape solo perú"
                                  extra={collExtra('/yape.png')}
                                >
                                  <PayPeru
                                    amount={
                                      Number(product.price) *
                                      dataUser.product?.units
                                    }
                                    qr="https://cdn.onlinewebfonts.com/svg/img_101311.png"
                                    img="/yape.png"
                                    color="Yape"
                                  />
                                </Panel>
                                <Panel
                                  header="Pagar con Tunki solo perú"
                                  extra={collExtra('/tunki.png')}
                                >
                                  <PayPeru
                                    amount={
                                      Number(product.price) *
                                      dataUser.product?.units
                                    }
                                    qr="https://cdn.onlinewebfonts.com/svg/img_101311.png"
                                    img="/tunki.png"
                                    color="Tunki"
                                  />
                                </Panel>
                              </Collapse>
                            </Col>
                          )}
                        </Row>
                      ) : (
                        <Row justify="center">
                          <Col>
                            <Form.Item
                              label="Celular"
                              name="phoneNumber"
                              className="center_item"
                              rules={[
                                { required: true, message: 'Campo requerido' },
                              ]}
                            >
                              <Input addonBefore="+51" />
                            </Form.Item>
                            <Form.Item
                              className="center_item"
                              label="Ciudad"
                              name="city"
                              rules={[
                                { required: true, message: 'Campo requerido' },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              label="Distrito"
                              name="district"
                              className="center_item"
                              rules={[
                                { required: true, message: 'Campo requerido' },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              label="Dirección"
                              name="addressHome"
                              className="center_item"
                              rules={[
                                { required: true, message: 'Campo requerido' },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              label="Referencia"
                              name="reference"
                              className="center_item"
                              rules={[
                                { required: true, message: 'Campo requerido' },
                              ]}
                            >
                              <Input />
                            </Form.Item>
                            {userInfo.sendEmail ? null : (
                              <Row justify="center">
                                <Form.Item
                                  name="sendEmail"
                                  valuePropName="checked"
                                >
                                  <Checkbox
                                    style={{
                                      textAlign: 'center',
                                      width: '200px',
                                    }}
                                  >
                                    Recibiré emails de nuevos productos
                                  </Checkbox>
                                </Form.Item>
                              </Row>
                            )}
                            {userInfoUpdate === false && (
                              <Row justify="center">
                                <Button type="primary" htmlType="submit">
                                  Siguiente
                                </Button>
                              </Row>
                            )}
                          </Col>
                          {userInfoUpdate && (
                            <Col style={{ width: '100%' }}>
                              <ProductToBuy {...productToBuyProps} />
                              <Collapse accordion>
                                <Panel
                                  header="Pagar con PayPal"
                                  extra={collExtra('/paypal.jpg')}
                                >
                                  <Row justify="center">
                                    <Col>
                                      <PayPal />
                                    </Col>
                                  </Row>
                                </Panel>
                                <Panel
                                  header="Pagar con Yape solo perú"
                                  extra={collExtra('/yape.png')}
                                >
                                  <PayPeru
                                    amount={
                                      Number(product.price) *
                                      dataUser.product?.units
                                    }
                                    qr="https://cdn.onlinewebfonts.com/svg/img_101311.png"
                                    img="/yape.png"
                                    color="Yape"
                                  />
                                </Panel>
                                <Panel
                                  header="Pagar con Tunki solo perú"
                                  extra={collExtra('/tunki.png')}
                                >
                                  <PayPeru
                                    amount={
                                      Number(product.price) *
                                      dataUser.product?.units
                                    }
                                    qr="https://cdn.onlinewebfonts.com/svg/img_101311.png"
                                    img="/tunki.png"
                                    color="Tunki"
                                  />
                                </Panel>
                              </Collapse>
                            </Col>
                          )}
                        </Row>
                      )}
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

const mapStateToProps = (state) => ({
  userInfo: state.userReducer.user[0],
})

export default connect(mapStateToProps, {})(Pid)
