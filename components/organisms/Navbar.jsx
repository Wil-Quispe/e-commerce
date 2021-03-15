import Link from 'next/link'
import { useContext } from 'react'
import { Badge, Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import CartContext from '../molecules/cart/cartContext'

const Navbar = () => {
  const [state] = useContext(CartContext)

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
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <Link href="/cart">
                <a>
                  <Badge count={state.cart.length}>
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                    ></Button>
                  </Badge>
                </a>
              </Link>
              <Button type="primary" style={{ margin: '0 .5em 0 1em' }}>
                Registrarse
              </Button>
              <Button type="primary">Iniciar Sesion</Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
