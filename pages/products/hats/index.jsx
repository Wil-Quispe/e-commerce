import { gql, useQuery } from '@apollo/client'
import ProductCard from '../../../components/molecules/ProductCard'

const HATS = gql`
  query {
    hats {
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
  const { data } = useQuery(HATS)
  return (
    <>
      <div>
        <section className="section">
          <div className="container">
            <div className="columns is-multiline">
              {data?.hats.map((d, i) => (
                <ProductCard key={i} product={d} path="hats" />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default index
