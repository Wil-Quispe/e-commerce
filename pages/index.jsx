import { Avatar, Tooltip, Row, Col } from 'antd'
import Slider from '../components/organisms/Slider'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import ProductCard from '../components/molecules/ProductCard'
import { connect } from 'react-redux'
import { navMobileNotSee } from '../redux/actionCreator'
import { useEffect } from 'react'

const PRODUCTS = gql`
  query {
    shoes(limit: 4) {
      _id
      brand
      model
      description
      price
      imgs
    }
    tshirt(limit: 4) {
      _id
      brand
      description
      model
      price
      imgs
    }
    pants(limit: 4) {
      _id
      brand
      description
      model
      price
      imgs
    }
    hats(limit: 4) {
      _id
      brand
      description
      model
      price
      imgs
    }
  }
`

const index = ({ navNotSeeView }) => {
  const { data } = useQuery(PRODUCTS)
  useEffect(() => {
    navNotSeeView()
  }, [])

  return (
    <main>
      <Slider />
      <section className="section">
        <div className="container">
          <div className="columns">
            {data?.shoes.map((d, i) => (
              <ProductCard key={i} product={d} path="shoes" />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns">
            {data?.tshirt.map((d, i) => (
              <ProductCard key={i} product={d} path="tshirt" />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns">
            {data?.pants.map((d, i) => (
              <ProductCard key={i} product={d} path="pants" />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns">
            {data?.hats.map((d, i) => (
              <ProductCard key={i} product={d} path="hats" />
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
                  <Link href="/products/shoes">
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
                  <Link href="/products/tshirt">
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
                  <Link href="/products/pants">
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
                  <Link href="/products/hats">
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

const mapStateToProps = () => {}
const mapDispatchToProps = dispatch => {
  return {
    navNotSeeView() {
      dispatch(navMobileNotSee())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
