import { Form, Input, Button, Row, Col, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { saveInLocalStrgAndRedirect } from '../utils/index'
import { useMutation, gql } from '@apollo/client'
import { GoogleLogin } from 'react-google-login'
import FacebookLogin from 'react-facebook-login'
import { connect } from 'react-redux'
import { navMobileNotSee } from '../redux/actionCreator'
import { useEffect } from 'react'
import Head from 'next/head'

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

const login = ({ navNotSeeView }) => {
  const [loginUser] = useMutation(LOGIN)
  const [loginThirdServices] = useMutation(SIGNUPTHIRDSERVICES)
  useEffect(() => {
    navNotSeeView()
  }, [])

  const responseFacebook = async response => {
    try {
      const { email, name } = response
      const data = await loginThirdServices({
        variables: {
          email,
          name,
          img: response.picture.data.url,
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
    } catch (error) {
      message.error(`${error}`)
    }
  }
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
  const failGoogle = response => {
    response &&
      message.info('Las cookies no están habilitadas en el entorno actual')
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
    <>
      <Head>
        <title>Inicio Session | {process.env.SITE_NAME}</title>
      </Head>
      <section className="section">
        <div className="container">
          <Row justify="center">
            <Col style={{ width: '300px' }}>
              <Row justify="center">
                <h3>Inicia Sesion con</h3>
              </Row>
              <Row justify="center" style={{ margin: '0 0 1em' }}>
                <Col>
                  <Row style={{ margin: '1em' }} justify="center">
                    <GoogleLogin
                      clientId="1086856703745-ng0rgthsjdc280e9tg3si0fqft05bkfa.apps.googleusercontent.com"
                      buttonText="Google"
                      onSuccess={responseGoogle}
                      onFailure={failGoogle}
                      cookiePolicy={'single_host_origin'}
                    />
                  </Row>
                  <Row style={{ margin: '1em' }}>
                    <FacebookLogin
                      appId="151368343545938"
                      fields="name,email,picture"
                      callback={responseFacebook}
                      textButton="Facebook"
                    />
                  </Row>
                </Col>
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
                    {
                      required: true,
                      message: 'Ingrese su correo electronico!',
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
                    { required: true, message: 'Ingrese su contraseña!' },
                  ]}
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
    </>
  )
}

const mapStateToProps = () => {}

const mapDispatchToProps = dispatch => {
  return {
    navNotSeeView() {
      dispatch(navMobileNotSee())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(login)
