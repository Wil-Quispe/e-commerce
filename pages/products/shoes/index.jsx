import { gql, useQuery } from '@apollo/client'
import ProductCard from '../../../components/molecules/ProductCard'

const SHOES = gql`
  query {
    shoes {
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
  const { data } = useQuery(SHOES)
  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="columns is-multiline">
            {data?.shoes.map((d, i) => (
              <ProductCard key={i} product={d} path="shoes" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default index
