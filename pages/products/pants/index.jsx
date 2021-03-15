import { gql, useQuery } from '@apollo/client'
import ProductCard from '../../../components/molecules/ProductCard'

const PANTS = gql`
  query {
    pants {
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
  const { data } = useQuery(PANTS)
  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="columns is-multiline">
            {data?.pants.map((d, i) => (
              <ProductCard key={i} product={d} path="pants" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default index
