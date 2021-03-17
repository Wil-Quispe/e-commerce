import { Form, Input, Button, Row, Col, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useMutation, gql } from '@apollo/client'
import Link from 'next/link'

const SIGNUP = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    signUpUser(data: { name: $name, email: $email, password: $password }) {
      user {
        name
        email
      }
      token
    }
  }
`

const signup = () => {
  const [signUpUser] = useMutation(SIGNUP)
  // const [form] = Form.useForm()

  const onFinish = async values => {
    const { email, password, confirm, name } = values
    if (password.length < 6 && password !== confirm)
      return message.error('contraseña incorrecta')

    try {
      const data = await signUpUser({ variables: { name, email, password } })
      console.log(data)
    } catch (err) {
      message.error(`${err}`)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <Row justify="center">
          <Col style={{ width: '300px' }}>
            <Form
              // form={form}
              name="register"
              onFinish={onFinish}
            >
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'campo requerido!',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Nombre de Usuario"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'Contraseña incorrecta!',
                  },
                  {
                    required: true,
                    message: 'ingrese su correo!',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="correo electronico"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'ingrese su contraseña!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="contraseña"
                />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'ingrese su contraseña!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }

                      return Promise.reject(
                        new Error('las contraseñas no coinciden!')
                      )
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="confirmar contraseña"
                />
              </Form.Item>

              <Row justify="center">
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Registrarse
                  </Button>
                  {'  '} O <Link href="/login">Iniciar Sesion</Link>
                </Form.Item>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </section>
  )
}

export default signup
