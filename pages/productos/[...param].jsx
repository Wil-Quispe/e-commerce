import { useEffect } from 'react'
import { Divider, Row } from 'antd'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Pid from '../../components/molecules/Pid'
import ProductCard from '../../components/molecules/ProductCard'
import { connect } from 'react-redux'
import { loadingFalse } from '../../redux/actionCreator'

const PRODUCTID = gql`
  query ($sId: ID!, $typeProduct: String!) {
    one: product(_id: $sId) {
      _id
      brand
      description
      model
      price
      stock
      gender
      material
      imgs {
        pubId
        pathImg
      }
      size
      typeProduct
    }

    many: product(typeProduct: $typeProduct) {
      _id
      brand
      description
      model
      price
      imgs {
        pubId
        pathImg
      }
    }
  }
`

const ProductId = ({ loadingFalse }) => {
  const router = useRouter()
  const { param } = router.query
  const { data } = useQuery(PRODUCTID, {
    variables: { sId: param && param[1], typeProduct: param && param[0] },
  })
  useEffect(() => {
    loadingFalse()
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

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => {
  return {
    loadingFalse() {
      dispatch(loadingFalse())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductId)
