import { Form, Input, Button, Row, Col, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useMutation, gql } from '@apollo/client'
import Link from 'next/link'
import { saveInLocalStrgAndRedirect } from '../utils/index'

import { GoogleLogin } from 'react-google-login'

const SIGNUP = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    signUpUser(data: { name: $name, email: $email, password: $password }) {
      user {
        _id
        name
        email
      }
      token
    }
  }
`

const SIGNUPTHIRDSERVICES = gql`
  mutation(
    $name: String!
    $lastName: String
    $nickName: String
    $email: String!
    $img: String!
  ) {
    loginThirdServices(
      data: {
        name: $name
        lastName: $lastName
        nickName: $nickName
        email: $email
        img: $img
      }
    ) {
      thirdServices {
        _id
        name
        email
      }
      token
    }
  }
`

const signup = () => {
  const [signUpUser] = useMutation(SIGNUP)
  const [loginThirdServices] = useMutation(SIGNUPTHIRDSERVICES)
  const responseGoogle = async response => {
    try {
      const {
        name,
        familyName,
        givenName,
        email,
        imageUrl,
      } = response.profileObj
      const data = await loginThirdServices({
        variables: {
          name,
          lastName: familyName,
          nickName: givenName,
          email,
          img: imageUrl,
        },
      })
      saveInLocalStrgAndRedirect(
        [
          { token: data.data.loginThirdServices.token },
          { typeUser: 'THIRDUSER' },
          { redux: 'thirdUser' },
          { _id: data.data.loginThirdServices.thirdServices._id },
        ],
        '/'
      )
    } catch (err) {
      message.error(`${err}`)
    }
  }

  const onFinish = async values => {
    const { email, password, confirm, name } = values
    if (password.length < 6 && password !== confirm)
      return message.error('contraseña incorrecta')

    try {
      const data = await signUpUser({ variables: { name, email, password } })
      saveInLocalStrgAndRedirect(
        [
          { token: data.data.signUpUser.token },
          { typeUser: 'USER' },
          { redux: 'user' },
          { _id: data.data.signUpUser.user._id },
        ],
        '/'
      )
    } catch (err) {
      message.error(`${err}`)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <Row justify="center">
          <Col style={{ width: '300px' }}>
            <Row justify="center" style={{ margin: '0 0 1em' }}>
              <GoogleLogin
                clientId="1086856703745-ng0rgthsjdc280e9tg3si0fqft05bkfa.apps.googleusercontent.com"
                buttonText="Registrate con Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
              />
            </Row>
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
