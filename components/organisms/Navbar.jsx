import Link from 'next/link'
import { Badge, Button, Avatar, Tooltip, Spin } from 'antd'
import { gql, useQuery } from '@apollo/client'
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
import { camelCase } from '../../utils/index'

const USER = gql`
  query ($id: ID!) {
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
        typeProduct
        productId
      }
    }
  }
`
const ADMIN = gql`
  query ($id: ID!) {
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
  query ($id: ID!) {
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
        typeProduct
        productId
      }
    }
  }
`
const QUERYTYPEPRODUCTS = gql`
  query {
    product {
      typeProduct
    }
  }
`

const Navbar = ({
  addUserInfoView,
  userInfos,
  navMobileState,
  navSeeView,
  navNotSeeView,
  loaderState,
  cartLength,
}) => {
  const { data: queryTypeProducts } = useQuery(QUERYTYPEPRODUCTS)

  if (typeof window !== 'undefined') {
    if (localStorage.getItem('typeUser') === 'USER') {
      const { data } = useQuery(USER, {
        variables: { id: localStorage.getItem('_id') },
      })
      addUserInfoView(data)
      const cartCounter = data?.user.cart.length
      localStorage.setItem('cart', cartCounter && cartCounter)
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
      const cartCounter = data?.thirdUser.cart.length
      localStorage.setItem('cart', cartCounter && cartCounter)
    }
  }
  const navVisible = () => {
    if (localStorage.getItem('navMobile') !== 'is-active') {
      localStorage.setItem('navMobile', 'is-active')
      navSeeView()
    } else {
      localStorage.setItem('navMobile', '')
      navNotSeeView()
    }
  }

  const typeProducts = [
    ...new Set(queryTypeProducts?.product.map(p => p.typeProduct)),
  ]

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="main navigation"
      style={{
        background: '#F0F0F0',
        position: '-webkit-sticky',
        position: 'sticky',
        top: '0',
      }}
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

          {typeProducts?.map((p, i) => (
            <Link href={`/productos/${p}`} key={i}>
              <a className="navbar-item">
                <LinkCustom text={camelCase(p)} />
              </a>
            </Link>
          ))}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {userInfos && userInfos.sales ? null : (
                <Tooltip title="Contáctate con Nosotros" placement="bottom">
                  <Button
                    style={{ margin: '0 .5em' }}
                    icon={<WhatsAppOutlined />}
                    type="primary"
                    shape="circle"
                    target="_blank"
                    href="https://wa.link/ukq28t"
                  />
                </Tooltip>
              )}
              {typeof window !== 'undefined' &&
              localStorage.getItem('typeUser') === 'ADMIN' ? (
                <Tooltip title="Administrador" placement="bottom">
                  <Avatar size={20} src="/admin.svg" />
                </Tooltip>
              ) : (
                <a href="/carrito">
                  <Badge dot={cartLength > 0 ? true : false}>
                    {/* <Badge count={Boolean(cartLength) ? cartLength : 0}> */}
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                    ></Button>
                  </Badge>
                </a>
              )}
              {typeof window !== 'undefined' &&
              localStorage.getItem('typeUser') ? (
                <Link href="/perfil">
                  <Tooltip title="Ver Perfil" placement="bottom">
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
                  <Link href="/registro">
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
  cartLength: state.cartReducer.cart,
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
