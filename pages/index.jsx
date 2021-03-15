import { Avatar, Row, Col } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import Slider from '../components/organisms/Slider'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import ProductCard from '../components/molecules/ProductCard'

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

const index = () => {
  const { data } = useQuery(PRODUCTS)
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
                  <Link href="#">
                    <Avatar size={100} icon={<UserOutlined />} />
                  </Link>
                </Col>
                <Col>
                  <Link href="#">
                    <Avatar size={100} icon={<UserOutlined />} />
                  </Link>
                </Col>
                <Col>
                  <Link href="#">
                    <Avatar size={100} icon={<UserOutlined />} />
                  </Link>
                </Col>
                <Col>
                  <Link href="#">
                    <Avatar size={100} icon={<UserOutlined />} />
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

export default index
