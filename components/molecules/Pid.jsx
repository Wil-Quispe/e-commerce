import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Row, Tag, Button, Col, Image, Card, Descriptions, Form } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const STRIPE = gql`
  mutation Stripe($id: ID!, $amount: Int!) {
    stripe(data: { id: $id, amount: $amount })
  }
`

const Pid = ({ product }) => {
  const [buy, setBuy] = useState('')
  const [formBuy, setFormBuy] = useState('none')
  const [stripe] = useMutation(STRIPE)
  const stripeJS = useStripe()
  const elements = useElements()

  const handleSubmit = async () => {
    const { error, paymentMethod } = await stripeJS.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })
    if (paymentMethod) {
      const { id } = paymentMethod
      const data = await stripe({
        variables: { id, amount: Number(product.price * 100) },
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
              <Row>
                <Image width={200} src={`${product.imgs[0]}`} />
              </Row>
              <Row>
                {product.imgs.map((pi, i) => {
                  if (i === 0) return null
                  return (
                    <Col key={i}>
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
                      <Tag key={i}>{p}</Tag>
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
                    setBuy('none'), setFormBuy('block')
                  }}
                >
                  Comprar
                </Button>
              </Row>
            </Card>
          </Col>
          <Row>
            <Form
              style={{ width: '400px', display: `${formBuy}` }}
              onFinish={handleSubmit}
            >
              <CardElement />
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
          </Row>
        </Row>
      </div>
    </section>
  )
}

export default Pid
