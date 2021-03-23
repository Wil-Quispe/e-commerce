import Link from 'next/link'
import { Badge, Button, Avatar, Tooltip } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { addtUserInfo } from '../../redux/actionCreator'

const USER = gql`
  query($id: ID!) {
    user(_id: $id) {
      _id
      name
      nickName
      lastName
      age
      phoneNumber
      img
      email
      gender
      country
      city
      district
      addressHome
      reference
      sendEmail
    }
  }
`
const ADMIN = gql`
  query($id: ID!) {
    admin(_id: $id) {
      _id
      name
      img
      name
      nickName
      lastName
      admin
      img
      age
      phoneNumber
      email
      gender
      # sales: [String]
    }
  }
`
const THIRDUSER = gql`
  query($id: ID!) {
    thirdUser(_id: $id) {
      _id
      name
      nickName
      lastName
      age
      phoneNumber
      img
      email
      gender
      country
      city
      district
      addressHome
      reference
      sendEmail
    }
  }
`

const Navbar = ({ cartLength, addUserInfoView, userInfos }) => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('typeUser') === 'USER') {
      const { data } = useQuery(USER, {
        variables: { id: localStorage.getItem('_id') },
      })
      addUserInfoView(data)
    }
    if (localStorage.getItem('typeUser') === 'ADMIN') {
      const { data } = useQuery(ADMIN, {
        variables: { id: localStorage.getItem('_id') },
      })
      addUserInfoView(data)
    }
    if (localStorage.getItem('typeUser') === 'THIRDUSER') {
      const { data } = useQuery(THIRDUSER, {
        variables: { id: localStorage.getItem('_id') },
      })
      addUserInfoView(data)
    }
  }

  // console.log(userInfos)

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="main navigation"
      style={{ background: '#F0F0F0' }}
    >
      <div className="navbar-brand">
        <Link href="/">
          <a className="navbar-item">
            <img
              width={112}
              height={28}
              src="https://coolboxpe.vtexassets.com/arquivos/completeIconCoolbox.png"
              alt="main logo"
            />
          </a>
        </Link>

        {/* barra hamburgesa responsive */}
        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="true"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">
          <Link href="/">
            <a className="navbar-item">Inicio</a>
          </Link>
          <Link href="/products/shoes">
            <a className="navbar-item">Zapatos</a>
          </Link>
          <Link href="/products/pants">
            <a className="navbar-item">Pantalones</a>
          </Link>
          <Link href="/products/tshirt">
            <a className="navbar-item">Polos</a>
          </Link>
          <Link href="/products/hats">
            <a className="navbar-item">Gorros</a>
          </Link>
          <Link href="/login_admin_super">
            <a className="navbar-item">Admin</a>
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {typeof window !== 'undefined' &&
              localStorage.getItem('typeUser') === 'ADMIN' ? (
                <Tooltip title="Administrador">
                  <Avatar size={20} src="/estrella.svg" />
                </Tooltip>
              ) : (
                <Link href="/cart">
                  <a>
                    <Badge count={cartLength ? cartLength : null}>
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                      ></Button>
                    </Badge>
                  </a>
                </Link>
              )}
              {typeof window !== 'undefined' &&
              localStorage.getItem('typeUser') ? (
                <Link href="/user-profile">
                  <Tooltip title="Ver Perfil">
                    {userInfos && userInfos.img ? (
                      <Avatar
                        src={userInfos.img}
                        shape="circle"
                        style={{ height: 'auto', margin: '.5em' }}
                      />
                    ) : (
                      <Avatar
                        icon={<UserOutlined />}
                        style={{ margin: '0 .5em' }}
                      />
                    )}
                  </Tooltip>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button type="primary" style={{ margin: '0 .5em' }}>
                      Registrarse
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button type="primary">Iniciar Sesion</Button>
                  </Link>
                </>
              )}
              {}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

const mapStateToProps = state => ({
  userInfos: state.userReducer.user[0],
  cartLength: state.cartReducer.cart.length,
})

const mapDispatchToProps = dispatch => {
  return {
    addUserInfoView(userInfo) {
      dispatch(addtUserInfo(userInfo))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
// export default Navbar
