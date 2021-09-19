import { Form, Input, Button, Row, Col, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useMutation, gql } from '@apollo/client'
import Link from 'next/link'
import { saveInLocalStrgAndRedirect } from '../utils/index'
import FacebookLogin from 'react-facebook-login'
import { GoogleLogin } from 'react-google-login'
import { connect } from 'react-redux'
import { navMobileNotSee } from '../redux/actionCreator'
import { useEffect } from 'react'
import Head from 'next/head'

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

const signup = ({ navNotSeeView }) => {
  const [signUpUser] = useMutation(SIGNUP)
  const [loginThirdServices] = useMutation(SIGNUPTHIRDSERVICES)
  useEffect(() => {
    navNotSeeView()
  }, [])
  const responseFacebook = async (response) => {
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
        '/',
      )
    } catch (error) {
      message.error(`${error}`)
    }
  }
  const responseGoogle = async (response) => {
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
        '/',
      )
    } catch (err) {
      console.log('eroor bor')
      message.error(`${err}`)
    }
  }
  const failGoogle = async (response) => {
    response &&
      message.info('Las cookies no están habilitadas en el entorno actual')
  }

  const onFinish = async (values) => {
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
        '/',
      )
    } catch (err) {
      message.error(`${err}`)
    }
  }

  return (
    <>
      <Head>
        <title>Registrarse | {process.env.SITE_NAME}</title>
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
                      clientId={`${process.env.GOOGLE_ID}`}
                      buttonText="Google"
                      onSuccess={responseGoogle}
                      onFailure={failGoogle}
                      cookiePolicy={'single_host_origin'}
                    />
                  </Row>
                  <Row style={{ margin: '1em' }}>
                    <FacebookLogin
                      appId={`${process.env.FACEBOOK_ID}`}
                      fields="name,email,picture"
                      callback={responseFacebook}
                      textButton="Facebook"
                      cssClass="facebook_login"
                    />
                  </Row>
                </Col>
              </Row>
              <Form name="register" onFinish={onFinish}>
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
                      required: true,
                      message: 'ingrese su correo!',
                    },
                    { type: 'email', message: 'correo invalido' },
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
                          new Error('las contraseñas no coinciden!'),
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
    </>
  )
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch) => {
  return {
    navNotSeeView() {
      dispatch(navMobileNotSee())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(signup)
