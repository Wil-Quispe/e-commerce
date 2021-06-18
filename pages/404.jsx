import { Row, Col, Button } from 'antd'
import React from 'react'

const Custom404 = () => {
  return (
    <Row justify='center' align='middle' className='container_404'>
      <Col>
        <h1>Esta página no se encontró</h1>
        <Row justify='center'>
          <Button type='primary' link href='/'>
            Volver al inicio
          </Button>
        </Row>
      </Col>
    </Row>
  )
}

export default Custom404
