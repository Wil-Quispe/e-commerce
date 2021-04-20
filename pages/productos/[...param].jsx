import { Divider } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Pid from '../../components/molecules/Pid'
import ProductCard from '../../components/molecules/ProductCard'

const PRODUCTID = gql`
  query($sId: ID!, $typeProduct: String!) {
    one: product(_id: $sId) {
      _id
      brand
      description
      model
      price
      stock
      gender
      material
      imgs
      size
    }

    many: product(typeProduct: $typeProduct, limit: 4) {
      _id
      brand
      description
      model
      price
      imgs
    }
  }
`

const ProductId = () => {
  const router = useRouter()
  const { param } = router.query
  const { data } = useQuery(PRODUCTID, {
    variables: { sId: param && param[1], typeProduct: param && param[0] },
  })
  console.log(param && param[1])
  console.log(data)
  return (
    <main>
      {/* producto con sus especificasiones */}
      {data && <Pid product={data.one[0]} />}

      <Divider orientation="left">Las personas tambien buscan esto</Divider>

      {/* productos recomendados */}
      <section className="section">
        <div className="container">
          <div className="columns">
            {data?.many?.map((d, i) => (
              <ProductCard key={i} product={d} path={param[0]} />
            ))}
          </div>
        </div>
      </section>
    </main>
    // <h1>hola</h1>
  )
}

export default ProductId
