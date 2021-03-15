import { Result, Button } from 'antd'
import Link from 'next/link'

const success = () => {
  return (
    <div>
      <Result
        status="success"
        title="Pago exitoso!"
        extra={[
          <Button type="primary">
            <Link href="/">ir a Inicio</Link>
          </Button>,
        ]}
      />
    </div>
  )
}

export default success
