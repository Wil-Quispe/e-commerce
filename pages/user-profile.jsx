import {
  Card,
  Button,
  Avatar,
  Select,
  Row,
  Col,
  Tag,
  Tooltip,
  Input,
  Form,
  Checkbox,
  InputNumber,
  Divider,
  Collapse,
} from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { gql, useMutation, useQuery } from '@apollo/client'
import AddProduct from '../components/Atoms/AddProduct'
import UpdateProduct from '../components/Atoms/UpdateProduct'
import LastSells from '../components/Atoms/LastSells'
import { useEffect } from 'react'
import { navMobileNotSee } from '../redux/actionCreator'
import Head from 'next/head'
import Banner from '../components/Atoms/Banner'

const THIRDUSERUPDATE = gql`
  mutation(
    $id: ID!
    $name: String
    $nickName: String
    $lastName: String
    $age: Int
    $phoneNumber: String
    $gender: String
    $country: String
    $city: String
    $district: String
    $addressHome: String
    $reference: String
    $sendEmail: Boolean
  ) {
    thirdServicesUpdate(
      _id: $id
      data: {
        name: $name
        nickName: $nickName
        lastName: $lastName
        age: $age
        phoneNumber: $phoneNumber
        gender: $gender
        country: $country
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
const USERUPDATE = gql`
  mutation(
    $id: ID!
    $name: String
    $nickName: String
    $lastName: String
    $age: Int
    $phoneNumber: String
    $gender: String
    $country: String
    $city: String
    $district: String
    $addressHome: String
    $reference: String
    $sendEmail: Boolean
  ) {
    userUpdate(
      _id: $id
      data: {
        name: $name
        nickName: $nickName
        lastName: $lastName
        age: $age
        phoneNumber: $phoneNumber
        gender: $gender
        country: $country
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
const ADMINUPDATE = gql`
  mutation(
    $id: ID!
    $name: String
    $lastName: String
    $nickName: String
    $age: Int
    $gender: String
    $phoneNumber: String
  ) {
    adminUpdate(
      _id: $id
      data: {
        name: $name
        lastName: $lastName
        nickName: $nickName
        age: $age
        gender: $gender
        phoneNumber: $phoneNumber
      }
    ) {
      name
    }
  }
`
const fragment = gql`
  fragment dataQueryAdmin on Products {
    _id
    brand
    model
    description
    price
    stock
    gender
    type
    material
    size
    imgs {
      pubId
      pathImg
    }
    typeProduct
  }
`

const QUERYPRODUCTS = gql`
  ${fragment}
  query {
    product {
      ...dataQueryAdmin
    }
  }
`

const typeUser =
  typeof window !== 'undefined' && localStorage.getItem('typeUser')

const { Option } = Select
const { Meta } = Card
const { Panel } = Collapse

const logOut = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear()
    window.location = '/'
  }
}

const profile = ({ userInfos, lastSells, navNotSeeView }) => {
  const { data: queryProducts } = useQuery(QUERYPRODUCTS)
  useEffect(() => {
    navNotSeeView()
  }, [])

  if (typeof window !== 'undefined') {
    if (!localStorage.getItem('token')) {
      window.location.replace('/')
    }
  }

  const productsLength = queryProducts?.product.length

  let onFinish = null
  if (typeUser === 'THIRDUSER') {
    const [thirdServicesUpdate] = useMutation(THIRDUSERUPDATE)
    onFinish = async values => {
      console.log(values)
      const {
        name,
        lastName,
        nickName,
        age,
        gender,
        phoneNumber,
        country,
        city,
        district,
        addressHome,
        reference,
        sendEmail,
      } = values

      const result = await thirdServicesUpdate({
        variables: {
          id: userInfos._id,
          name,
          lastName,
          nickName,
          age: Number(age),
          gender,
          phoneNumber,
          country,
          city,
          district,
          addressHome,
          reference,
          sendEmail: Boolean(sendEmail),
        },
      })
      console.log(result)
      typeof window !== 'undefined' && location.reload()
    }
  }
  if (typeUser === 'USER') {
    const [userUpdate] = useMutation(USERUPDATE)
    onFinish = async values => {
      console.log(values)
      const {
        name,
        lastName,
        nickName,
        age,
        gender,
        phoneNumber,
        country,
        city,
        district,
        addressHome,
        reference,
        sendEmail,
      } = values

      const result = await userUpdate({
        variables: {
          id: userInfos._id,
          name,
          lastName,
          nickName,
          age: Number(age),
          gender,
          phoneNumber,
          country,
          city,
          district,
          addressHome,
          reference,
          sendEmail: Boolean(sendEmail),
        },
      })
      if (typeof window !== 'undefined') {
        console.log(result)
        location.reload()
      }
    }
  }
  if (typeUser === 'ADMIN') {
    const [adminUpdate] = useMutation(ADMINUPDATE)
    onFinish = async values => {
      console.log(values)
      const { name, lastName, nickName, age, phoneNumber, gender } = values
      const result = await adminUpdate({
        variables: {
          id: userInfos._id,
          name,
          lastName,
          nickName,
          age: Number(age),
          phoneNumber,
          gender,
        },
      })
      if (typeof window !== 'undefined') {
        console.log(result)
        location.reload()
      }
    }
  }

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

  return (
    <>
      <Head>
        <title>
          {userInfos?.admin ? '✨Administrador' : `Perfil: ${userInfos?.name}`}
        </title>
      </Head>
      <section className="section">
        <div className="container">
          {userInfos && (
            <>
              <Row justify="center">
                <Card style={{ width: '500px' }} hoverable>
                  <Row>
                    {userInfos.img ? (
                      <Meta
                        avatar={<Avatar src={userInfos.img} size="large" />}
                        title={`Hola ${userInfos.name}`}
                      />
                    ) : (
                      <Meta
                        avatar={<Avatar icon={<UserOutlined />} size="large" />}
                        title={`Hola ${userInfos.name}`}
                      />
                    )}
                  </Row>
                  <Row justify="space-between" style={{ margin: '1em 0 0' }}>
                    <Col>
                      {userInfos.admin ? (
                        <Row>
                          <Col>
                            <Tag color="#108ee9">
                              ventas: {userInfos.sales.length}
                            </Tag>
                          </Col>
                          <Col>
                            <Tag color="#108ee9">
                              productos: {productsLength}
                            </Tag>
                          </Col>
                        </Row>
                      ) : (
                        <Row>
                          <Col>
                            <Tag color="#108ee9">
                              Compras: {userInfos.shopping.length}
                            </Tag>
                          </Col>
                          <Col>
                            <Tag color="#108ee9">
                              Carrito: {userInfos.cart.length}
                            </Tag>
                          </Col>
                        </Row>
                      )}
                    </Col>
                    <Col>
                      <Tooltip title="Cerrar Sesion">
                        <Button
                          type="primary"
                          icon={<LogoutOutlined />}
                          onClick={logOut}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                </Card>
              </Row>

              <Row justify="center">
                {userInfos.admin ? (
                  <Card hoverable style={{ margin: '2em 0' }}>
                    <Form
                      {...formItemLayout}
                      onFinish={onFinish}
                      initialValues={{
                        name: `${userInfos.name}`,
                        lastName: `${userInfos.lastName || ''}`,
                        nickName: `${userInfos.nickName || ''}`,
                        age: `${userInfos.age || ''}`,
                        gender: `${userInfos.gender || ''}`,
                        email: `${userInfos.email || ''}`,
                        phoneNumber: `${userInfos.phoneNumber || ''}`,
                      }}
                    >
                      <Row>
                        <Col>
                          <Row>
                            <Col>
                              <Form.Item name="name" label="Nombre">
                                <Input />
                              </Form.Item>
                              <Form.Item name="lastName" label="Apellido">
                                <Input />
                              </Form.Item>
                              <Form.Item
                                name="nickName"
                                label="Nickname"
                                tooltip="Como quieres que otras personas te llamen"
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item name="phoneNumber" label="Celular">
                                <Input addonBefore="+51" />
                              </Form.Item>
                            </Col>
                            <Col>
                              <Form.Item name="age" label="Edad">
                                <InputNumber />
                              </Form.Item>

                              <Form.Item name="gender" label="Genero">
                                <Select allowClear>
                                  <Option value="male">Hombre</Option>
                                  <Option value="female">Mujer</Option>
                                  <Option value="other">otro</Option>
                                </Select>
                              </Form.Item>

                              <Form.Item name="email" label="E-mail">
                                <Input readOnly />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row justify="center">
                            <Button type="primary" htmlType="submit">
                              Guardar Cambios
                            </Button>
                          </Row>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                ) : (
                  <Card hoverable style={{ margin: '2em 0' }}>
                    <Form
                      {...formItemLayout}
                      name="register"
                      onFinish={onFinish}
                      initialValues={{
                        name: `${userInfos.name}`,
                        lastName: `${userInfos.lastName || ''}`,
                        nickName: `${userInfos.nickName || ''}`,
                        age: `${userInfos.age || ''}`,
                        gender: `${userInfos.gender || ''}`,
                        email: `${userInfos.email || ''}`,
                        country: `${userInfos.country || ''}`,
                        city: `${userInfos.city || ''}`,
                        district: `${userInfos.district || ''}`,
                        addressHome: `${userInfos.addressHome || ''}`,
                        reference: `${userInfos.reference || ''}`,
                        phoneNumber: `${userInfos.phoneNumber || ''}`,
                        sendEmail: `${userInfos.sendEmail || ''}`,
                      }}
                    >
                      <Row justify="center">
                        <Col>
                          <Row>
                            <Col>
                              <Form.Item name="name" label="Nombre">
                                <Input />
                              </Form.Item>
                              <Form.Item name="lastName" label="Apellido">
                                <Input />
                              </Form.Item>
                              <Form.Item
                                name="nickName"
                                label="Nickname"
                                tooltip="Como quieres que otras personas te llamen"
                              >
                                <Input />
                              </Form.Item>

                              <Form.Item name="age" label="Edad">
                                <InputNumber />
                              </Form.Item>

                              <Form.Item name="gender" label="Genero">
                                <Select allowClear>
                                  <Option value="male">Hombre</Option>
                                  <Option value="female">Mujer</Option>
                                  <Option value="other">otro</Option>
                                </Select>
                              </Form.Item>

                              <Form.Item name="email" label="E-mail">
                                <Input readOnly />
                              </Form.Item>
                            </Col>
                            <Col>
                              <Form.Item name="country" label="Pais">
                                <Input />
                              </Form.Item>
                              <Form.Item name="city" label="Cuidad">
                                <Input />
                              </Form.Item>
                              <Form.Item name="district" label="Distrito">
                                <Input />
                              </Form.Item>
                              <Form.Item name="addressHome" label="Dirección">
                                <Input />
                              </Form.Item>
                              <Form.Item name="reference" label="Referencia">
                                <Input />
                              </Form.Item>
                              <Form.Item name="phoneNumber" label="Celular">
                                <Input addonBefore="+51" />
                              </Form.Item>
                            </Col>
                          </Row>

                          <Row justify="center">
                            <Col>
                              <Row justify="center">
                                <Form.Item
                                  name="sendEmail"
                                  valuePropName="checked"
                                  style={{
                                    textAlign: 'center',
                                  }}
                                >
                                  <Checkbox>
                                    recibire emails de nuevos productos
                                  </Checkbox>
                                </Form.Item>
                              </Row>
                              <Row justify="center">
                                <Form.Item>
                                  <Button type="primary" htmlType="submit">
                                    Guardar Cambios
                                  </Button>
                                </Form.Item>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                )}
              </Row>

              {userInfos.admin && (
                <>
                  {lastSells.length > 0 && (
                    <>
                      <Divider>Ultimas Ventas</Divider>
                      <Row justify="center" gutter={[16, 16]}>
                        {lastSells?.map((s, i) => (
                          <LastSells sell={s.sells} key={i} />
                        ))}
                      </Row>
                    </>
                  )}
                  <Divider>Banner principal</Divider>
                  <Row justify="center">
                    <Collapse>
                      <Panel header="Primer Banner">
                        <Banner indice={0} />
                      </Panel>
                      <Panel header="Segundo Banner">
                        <Banner indice={1} />
                      </Panel>
                    </Collapse>
                  </Row>
                  <Divider>Crear Productos</Divider>
                  <Row justify="center">
                    <Collapse style={{ width: '592.5px' }}>
                      <Panel header="Agregar Producto">
                        <AddProduct />
                      </Panel>
                      <Panel header="Crear nuevo tipo de producto">
                        <AddProduct type="new type" />
                      </Panel>
                    </Collapse>
                  </Row>
                  {queryProducts?.product.length > 0 ? (
                    <>
                      <Divider>Actualizar Productos</Divider>
                      <Row justify="center">
                        <Collapse style={{ width: '592.5px' }}>
                          {queryProducts &&
                            queryProducts?.product.map((p, i) => (
                              <UpdateProduct product={p} key={i} />
                            ))}
                        </Collapse>
                      </Row>
                    </>
                  ) : (
                    <Divider>No hay Productos para Actualizar</Divider>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}

const mapStateToProps = state => ({
  userInfos: state.userReducer.user[0],
  lastSells: state.sellsReducer.sells,
})

const mapDispatchToProps = dispatch => {
  return {
    navNotSeeView() {
      dispatch(navMobileNotSee())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(profile)
