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
const QUERYSHOES = gql`
  query {
    shoes {
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
      product
    }
  }
`
const QUERYPANTS = gql`
  query {
    pants {
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
      product
    }
  }
`
const QUERYTSHIRTS = gql`
  query {
    tshirt {
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
      product
    }
  }
`
const QUERYHATS = gql`
  query {
    hats {
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
      product
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

const profile = ({ userInfos }) => {
  const { data: queryShoes } = useQuery(QUERYSHOES)
  const { data: queryPants } = useQuery(QUERYPANTS)
  const { data: queryTshirts } = useQuery(QUERYTSHIRTS)
  const { data: queryHats } = useQuery(QUERYHATS)

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

  // console.log({ queryShoes })
  // console.log({ userInfos })
  return (
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
                          <Tag color="#108ee9">ventas: 23</Tag>
                        </Col>
                        <Col>
                          <Tag color="#108ee9">productos: 23</Tag>
                        </Col>
                      </Row>
                    ) : (
                      <Row>
                        <Col>
                          <Tag color="#108ee9">Compras: 23</Tag>
                        </Col>
                        <Col>
                          <Tag color="#108ee9">Carrito: 23</Tag>
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
                <Divider>Crear Productos</Divider>
                <Row justify="center">
                  <Collapse
                    defaultActiveKey={['0']}
                    style={{ width: '592.5px' }}
                  >
                    <Panel header="Agregar Zapatos">
                      <AddProduct productType="shoes" />
                    </Panel>
                    <Panel header="Agregar Pantalones">
                      <AddProduct productType="pants" />
                    </Panel>
                    <Panel header="Agregar Polos">
                      <AddProduct productType="tshirt" />
                    </Panel>
                    <Panel header="Agregar Gorros">
                      <AddProduct productType="hats" />
                    </Panel>
                  </Collapse>
                </Row>
                <Divider>Actualizar Productos</Divider>
                <Row justify="center">
                  <Collapse
                    // defaultActiveKey={['0']}
                    style={{ width: '592.5px' }}
                  >
                    <Panel header="Zapatos">
                      {queryShoes &&
                        queryShoes?.shoes.map((s, i) => {
                          return <UpdateProduct product={s} key={i} />
                        })}
                    </Panel>
                    <Panel header="Pantalones">
                      {queryPants &&
                        queryPants?.pants.map((p, i) => {
                          return <UpdateProduct product={p} key={i} />
                        })}
                    </Panel>
                    <Panel header="Polos">
                      {queryTshirts &&
                        queryTshirts?.tshirt.map((t, i) => {
                          return <UpdateProduct product={t} key={i} />
                        })}
                    </Panel>
                    <Panel header="Gorros">
                      {queryHats &&
                        queryHats?.hats.map((h, i) => {
                          return <UpdateProduct product={h} key={i} />
                        })}
                    </Panel>
                  </Collapse>
                </Row>
              </>
            )}
          </>
        )}
      </div>
    </section>
  )
}

const mapStateToProps = state => ({
  userInfos: state.userReducer.user[0],
})

export default connect(mapStateToProps, {})(profile)
