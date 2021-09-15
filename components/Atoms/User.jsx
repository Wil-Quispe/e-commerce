import { Avatar, Badge, Col, Card, Descriptions, Row } from 'antd'
import { camelCase } from '../../utils/index'
import { ShoppingCartOutlined, BarChartOutlined } from '@ant-design/icons'

const User = ({ user }) => {
  return (
    <div
      style={{
        margin: '2em 2em 3em',
        border: '1px solid #ccc',
        borderRadius: '10px',
      }}
    >
      <Row
        justify="space-around"
        align="middle"
        style={{ background: '#1890ff' }}
      >
        <Col>
          <Row>
            <Avatar
              size="large"
              src={
                user.img ||
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp7SCGMcJ-Ez3tIV7eIew4s_4oCfczsPJyPCW-oZe86fBC92qisfVUPgy34jdQVJLMoVM&usqp=CAU'
              }
            />
          </Row>
        </Col>
        <Col>
          <Row>
            <div style={{ marginRight: '1em' }}>
              <Badge count={user.shopping.length}>
                <BarChartOutlined
                  style={{
                    fontSize: '30px',
                    color: '#012a4a',
                  }}
                />
              </Badge>
            </div>
            <div>
              <Badge count={user.cart.length}>
                <ShoppingCartOutlined
                  style={{ fontSize: '30px', color: 'white' }}
                />
              </Badge>
            </div>
          </Row>
        </Col>
      </Row>
      <Row>
        <Card title={`Nombre: ${camelCase(user.name)}`} bordered={false}>
          <Descriptions>
            <Descriptions.Item label="Apellido">
              {user.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="NickName">
              {user.nickName}
            </Descriptions.Item>
            <Descriptions.Item label="Edad">{user.age}</Descriptions.Item>
            <Descriptions.Item label="Celular">
              {user.phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Enviar Correo">
              {user.sendEmail === true ? 'si' : 'no'}
            </Descriptions.Item>
            <Descriptions.Item label="Pais">{user.country}</Descriptions.Item>
            <Descriptions.Item label="Ciudad">{user.city}</Descriptions.Item>
            <Descriptions.Item label="Distrito">
              {user.district}
            </Descriptions.Item>
            <Descriptions.Item label="Dirreccion">
              {user.addressHome}
            </Descriptions.Item>
            <Descriptions.Item label="Referencia">
              {user.reference}
            </Descriptions.Item>
            <Descriptions.Item label="Correo">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Genero">{user.gender}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Row>
    </div>
  )
}

export default User
