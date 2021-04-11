import { Form, Input, Button, Row, Col, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useMutation, gql } from '@apollo/client'
import { saveInLocalStrgAndRedirect } from '../utils/index'
import { connect } from 'react-redux'
import { navMobileNotSee, loadingFalse } from '../redux/actionCreator'
import { useEffect } from 'react'
import Head from 'next/head'

const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      admin {
        _id
        name
      }
      token
    }
  }
`

const login = ({ navNotSeeView, loadingFalse }) => {
  const [loginAdmin] = useMutation(LOGIN)
  useEffect(() => {
    navNotSeeView()
    loadingFalse()
  }, [])
  const onFinish = async values => {
    if (values.password.length < 6)
      return message.error('contraseña incorrecta')
    const { email, password } = values
    try {
      const data = await loginAdmin({
        variables: { email, password },
      })
      saveInLocalStrgAndRedirect(
        [
          { token: data.data.loginAdmin.token },
          { typeUser: 'ADMIN' },
          { redux: 'admin' },
          { _id: data.data.loginAdmin.admin._id },
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
        <title>✨Inicio Session Admin |{process.env.SITE_NAME}</title>
      </Head>
      <section className="section">
        <div className="container">
          <Row justify="center">
            <Col style={{ width: '300px' }}>
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

const mapDispatchToProps = dispatch => {
  return {
    loadingFalse() {
      dispatch(loadingFalse())
    },
    navNotSeeView() {
      dispatch(navMobileNotSee())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(login)
