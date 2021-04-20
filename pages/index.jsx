import { Avatar, Tooltip, Row, Col } from 'antd'
import Slider from '../components/organisms/Slider'
import Link from 'next/link'
import Head from 'next/head'
import { gql, useQuery } from '@apollo/client'
import ProductCard from '../components/molecules/ProductCard'
import { connect } from 'react-redux'
import { navMobileNotSee, loadingFalse } from '../redux/actionCreator'
import { useEffect } from 'react'
const fragmentQuery = gql`
  fragment data on Products {
    _id
    brand
    model
    description
    price
    imgs
    typeProduct
  }
`

const PRODUCTS = gql`
  ${fragmentQuery}
  query {
    shoes: product(typeProduct: "zapatos", limit: 4) {
      ...data
    }
    tshirt: product(typeProduct: "polos", limit: 4) {
      ...data
    }
    pants: product(typeProduct: "pantalones", limit: 4) {
      ...data
    }
    hats: product(typeProduct: "gorros", limit: 4) {
      ...data
    }
  }
`

const index = ({ navNotSeeView, loadingFalse }) => {
  const { data } = useQuery(PRODUCTS)
  useEffect(() => {
    navNotSeeView()
    loadingFalse()
  }, [])

  return (
    <main>
      <Head>
        <title>Inicio | {process.env.SITE_NAME}</title>
      </Head>
      <Slider />
      <section className="section">
        <div className="container">
          <div className="columns">
            {data?.shoes.map((d, i) => (
              <ProductCard key={i} product={d} path="zapatos" />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns">
            {data?.tshirt.map((d, i) => (
              <ProductCard key={i} product={d} path="polos" />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns">
            {data?.pants.map((d, i) => (
              <ProductCard key={i} product={d} path="pantalones" />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns">
            {data?.hats.map((d, i) => (
              <ProductCard key={i} product={d} path="gorras" />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column">
              <Row justify="center" gutter={[16, 16]}>
                <Col>
                  <Link href="/productos/zapatos">
                    <Tooltip title="Zapatos">
                      <Avatar
                        size={100}
                        src="/sneakers.svg"
                        style={{
                          background: 'rgba(0, 0, 0, 0.19)',
                          padding: '1em',
                        }}
                      />
                    </Tooltip>
                  </Link>
                </Col>
                <Col>
                  <Link href="/productos/polos">
                    <Tooltip title="Polos">
                      <Avatar
                        size={100}
                        src="/shirt.svg"
                        style={{
                          // border: '1px solid #1890ff',
                          background: 'rgba(0, 0, 0, 0.19)',
                          padding: '1em',
                        }}
                      />
                    </Tooltip>
                  </Link>
                </Col>
                <Col>
                  <Link href="/productos/pantalones">
                    <Tooltip title="Pantalones">
                      <Avatar
                        size={100}
                        src="/pants.svg"
                        style={{
                          // border: '1px solid #1890ff',
                          background: 'rgba(0, 0, 0, 0.19)',
                          padding: '1em',
                        }}
                      />
                    </Tooltip>
                  </Link>
                </Col>
                <Col>
                  <Link href="/productos/gorros">
                    <Tooltip title="Gorros">
                      <Avatar
                        size={100}
                        src="/cap.svg"
                        style={{
                          // border: '1px solid #1890ff',
                          background: 'rgba(0, 0, 0, 0.19)',
                          padding: '1em',
                        }}
                      />
                    </Tooltip>
                  </Link>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </section>
    </main>
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

export default connect(mapStateToProps, mapDispatchToProps)(index)
