import { Spin } from 'antd'
const Spinner = () => {
  return (
    <Spin
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  )
}

export default Spinner
