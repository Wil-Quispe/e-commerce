import { Result, Button } from 'antd'
import { useRouter } from 'next/router'

const error = () => {
  const router = useRouter()
  const goBack = () => {
    router.back()
  }
  return (
    <div>
      <Result
        status="error"
        title="Se produjo algunos problemas con tu operacion"
        extra={[
          <Button type="primary" key="buy" onClick={goBack}>
            Intentar otra vez
          </Button>,
        ]}
      />
      ,
    </div>
  )
}

export default error
