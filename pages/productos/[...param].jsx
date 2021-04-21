import { Divider, Row } from 'antd'
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
      typeProduct
    }

    many: product(typeProduct: $typeProduct) {
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

  return (
    <main>
      {/* producto con sus especificasiones */}
      {data && <Pid product={data.one[0]} />}

      <Divider orientation="left">Las personas tambien buscan esto</Divider>

      {/* productos recomendados */}
      <Row justify="center" gutter={[16, 16]} style={{ margin: '1.5em 3em' }}>
        {data?.many?.map((d, i) => (
          <ProductCard key={i} product={d} path={param[0]} />
        ))}
      </Row>
    </main>
  )
}

export default ProductId
