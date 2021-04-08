import Link from 'next/link'
import { Badge, Button, Avatar, Tooltip, Spin } from 'antd'
import { gql, useQuery, useSubscription } from '@apollo/client'
import {
  ShoppingCartOutlined,
  UserOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'
import {
  addtUserInfo,
  addSells,
  navMobileSee,
  navMobileNotSee,
} from '../../redux/actionCreator'
import LinkCustom from '../Atoms/LinkCustom'

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
      shopping {
        _id
        productType
      }
      cart {
        img1
        img2
        brand
        model
        description
        productType
        productId
      }
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
      sales {
        _id
        productType
      }
      products
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
      shopping {
        _id
        productType
      }
      cart {
        img1
        img2
        brand
        model
        description
        productType
        productId
      }
    }
  }
`
const SELLS = gql`
  subscription {
    sells {
      name
      imgUser
      phoneNumber
      email
      brand
      model
      price
      imgProduct
    }
  }
`

const Navbar = ({
  addUserInfoView,
  userInfos,
  addSellsView,
  navMobileState,
  navSeeView,
  navNotSeeView,
  loaderState,
}) => {
  const { data: subscriptionData } = useSubscription(SELLS)
  if (subscriptionData) {
    addSellsView(subscriptionData)
  }
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

  const cartCounter = userInfos && userInfos.cart.length

  const navVisible = () => {
    if (localStorage.getItem('navMobile') !== 'is-active') {
      localStorage.setItem('navMobile', 'is-active')
      navSeeView()
    } else {
      localStorage.setItem('navMobile', '')
      navNotSeeView()
    }
  }

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
          onClick={navVisible}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div className={`navbar-menu ${navMobileState.nav}`} id="navbar-menu">
        <div className="navbar-start">
          <Link href="/">
            <a className="navbar-item">
              <LinkCustom text="Inicio" />
            </a>
          </Link>
          <Link href="/products/shoes">
            <a class="navbar-item">
              <LinkCustom text="Zapatos" />
            </a>
          </Link>
          <Link href="/products/pants">
            <a className="navbar-item">
              <LinkCustom text="Pantalones" />
            </a>
          </Link>
          <Link href="/products/tshirt">
            <a className="navbar-item">
              <LinkCustom text="Polos" />
            </a>
          </Link>
          <Link href="/products/hats">
            <a className="navbar-item">
              <LinkCustom text="Gorros" />
            </a>
          </Link>
          <Link href="/login_admin_super">
            <a className="navbar-item">
              <LinkCustom text="Admin" />
            </a>
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {userInfos && userInfos.sales ? null : (
                <Tooltip title="Contactate con Nosotros">
                  <Button
                    style={{ margin: '0 .5em' }}
                    icon={<WhatsAppOutlined />}
                    type="primary"
                    shape="circle"
                    target="_blank"
                    href="https://wa.link/9p5nyn"
                  />
                </Tooltip>
              )}
              {typeof window !== 'undefined' &&
              localStorage.getItem('typeUser') === 'ADMIN' ? (
                <Tooltip title="Administrador">
                  <Avatar size={20} src="/estrella.svg" />
                </Tooltip>
              ) : (
                <Link href="/cart">
                  <a>
                    {/* <Badge dot> */}
                    <Badge count={cartCounter}>
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
              {loaderState && <Spin style={{ margin: '0 .5em' }} />}
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
  navMobileState: state.navMobileReducer,
  loaderState: state.stateReducer.loading,
})

const mapDispatchToProps = dispatch => {
  return {
    navSeeView() {
      dispatch(navMobileSee())
    },
    navNotSeeView() {
      dispatch(navMobileNotSee())
    },
    addUserInfoView(userInfo) {
      dispatch(addtUserInfo(userInfo))
    },
    addSellsView(sells) {
      dispatch(addSells(sells))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
