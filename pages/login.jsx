import { Form, Input, Button, Row, Col, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { saveInLocalStrgAndRedirect } from '../utils/index'
import { useMutation, gql } from '@apollo/client'
import { GoogleLogin } from 'react-google-login'

const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
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

const login = () => {
  const [loginUser] = useMutation(LOGIN)
  const [loginThirdService] = useMutation(SIGNUPTHIRDSERVICES)

  const responseGoogle = async response => {
    try {
      const {
        name,
        familyName,
        givenName,
        email,
        imageUrl,
      } = response.profileObj
      const data = await loginThirdService({
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
    if (values.password.length < 6)
      return message.error('contraseña incorrecta')
    const { email, password } = values
    try {
      const data = await loginUser({
        variables: { email, password },
      })
      saveInLocalStrgAndRedirect(
        [
          { token: data.data.loginUser.token },
          { typeUser: 'USER' },
          { redux: 'user' },
          { _id: data.data.loginUser.user._id },
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
                buttonText="Inicia Sesion con Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
              />
            </Row>
            <Form
              name="normal_login"
              className="login-form"
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { type: 'email', message: 'correo invalido' },
                  { required: true, message: 'Ingrese su correo electronico!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="correo electronico"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Ingrese su contraseña!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="contraseña"
                />
              </Form.Item>

              <Row justify="center">
                <Form.Item>
                  <a className="login-form-forgot" href="">
                    olvidaste tu contraseña?
                  </a>
                </Form.Item>
              </Row>
              <Row justify="center">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Iniciar sesion
                  </Button>
                  {'  '}O <Link href="/signup">Registrate!</Link>
                </Form.Item>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </section>
  )
}

export default login
