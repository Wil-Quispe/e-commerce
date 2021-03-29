import { Card, Row, Image, Avatar, Descriptions, Col } from 'antd'

const { Meta } = Card

const LastSells = ({ sell }) => {
  return (
    <Col>
      <Card
        type="inner"
        style={{ width: 260 }}
        cover={
          <Row justify="center">
            <Image
              alt={sell.name}
              height={200}
              width={180}
              preview={false}
              src={
                sell.imgProduct ||
                'https://avatars.githubusercontent.com/u/8358236?v=4'
              }
            />
          </Row>
        }
      >
        <Meta
          avatar={
            <Avatar
              src={
                sell.imgUser ||
                'https://avatars.githubusercontent.com/u/8358236?v=4'
              }
            />
          }
          title={`cliente: ${sell.name}`}
        />
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="Celular">
            {sell.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{sell.email}</Descriptions.Item>
          <Descriptions.Item label="Modelo del Producto">
            {sell.model}
          </Descriptions.Item>
          <Descriptions.Item label="Marca del Producto">
            {sell.brand}
          </Descriptions.Item>
          <Descriptions.Item label="Precio del Producto">
            {sell.price}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Col>
  )
}

export default LastSells
