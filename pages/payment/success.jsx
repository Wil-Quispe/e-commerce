import { Result, Button } from 'antd'
import Link from 'next/link'
import Head from 'next/head'

const success = () => {
  return (
    <>
      <Head>
        <title>Pago exitoso ❤ | {process.env.SITE_NAME}</title>
      </Head>
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
    </>
  )
}

export default success
