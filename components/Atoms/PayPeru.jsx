import { Button, Col, Image, Row } from 'antd'

const PayPeru = ({ amount, img, qr, color }) => {
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

          <p>Escanee el codigo QR y realice el pago con {color}</p>

          <Image preview={false} width={200} src={qr} alt={color} />

          <h3 className="name_color_pay">Wil Quispe</h3>
          <h3 className="number_pay">923 383 923</h3>
          <h3>total a pagar</h3>
          <h3>S/{amount}.00</h3>

          <h3>1. Ingrese el monto total del pedido y realice el pago.</h3>
          <h3>
            2. Envienos la captura de pantalla de la constancia de {color} por{' '}
            <a href="#" target="_blank">
              WhatsApp
            </a>
          </h3>
          <h3>3. Verificaremos su pago y completaremos su pedido en breve.</h3>
          <Row>
            <Button type="primary">Ya pague sigiente paso</Button>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default PayPeru
