import { Button, Col, Image, Popconfirm, Row } from 'antd'

const PayPeru = ({ amount, img, qr, color }) => {
  const confirmPay = () => {
    location.href = '/pago/exitoso'
  }
  return (
    <div>
      <Row justify="center">
        <Col
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Image src={img} alt={color} width={100} preview={false} />

          <p>Escanee el código QR y realice el pago con {color}</p>

          <Image preview={false} width={200} src={qr} alt={color} />

          <h3 className="name_color_pay">Paul Quiñones</h3>
          <h3 className="number_pay">923 383 923</h3>
          <h3>Total a pagar</h3>
          <h3>S/{amount}</h3>

          <h3>1. Ingrese el monto total del pedido y realice el pago.</h3>
          <h3>
            2. Envíenos la captura de pantalla de la constancia de {color} por{' '}
            <a href="#" target="_blank">
              WhatsApp
            </a>
          </h3>
          <h3>3. Verificaremos su pago y completaremos su pedido en breve.</h3>
          <Row>
            <Popconfirm
              title="Acepte si en verdad ya pagaste"
              onConfirm={confirmPay}
              okText="Si Ya pagué"
              cancelText="Todavía no pago"
            >
              <Button type="primary">Ya pagué siguiente paso</Button>
            </Popconfirm>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default PayPeru
