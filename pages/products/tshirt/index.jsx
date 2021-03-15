import { gql, useQuery } from '@apollo/client'
import ProductCard from '../../../components/molecules/ProductCard'

const TSHIRT = gql`
  query {
    tshirt {
      _id
      brand
      model
      description
      price
      imgs
    }
  }
`

const index = () => {
  const { data } = useQuery(TSHIRT)
  return (
    <>
      <div>
        <section className="section">
          <div className="container">
            <div className="columns is-multiline">
              {data?.tshirt.map((d, i) => (
                <ProductCard key={i} product={d} path="tshirt" />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default index
