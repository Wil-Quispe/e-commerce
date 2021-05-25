import { useRouter } from 'next/router'
import { Row } from 'antd'
import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import ProductCard from '../../components/molecules/ProductCard'
import { camelCase } from '../../utils/index'
import { connect } from 'react-redux'
import { navMobileNotSee, loadingFalse } from '../../redux/actionCreator'
import { useEffect } from 'react'
import Spinner from '../../components/Atoms/Spinner'

const QUERYPRODUCTS = gql`
  query ($typeProduct: String!) {
    product(typeProduct: $typeProduct) {
      _id
      brand
      model
      description
      price
      imgs {
        pubId
        pathImg
      }
    }
  }
`

const ProductIndex = ({ navNotSeeView, loadingFalse }) => {
  const router = useRouter()
  const { slug } = router.query
  const { data } = useQuery(QUERYPRODUCTS, { variables: { typeProduct: slug } })
  useEffect(() => {
    navNotSeeView()
  }, [])
  loadingFalse()

  return (
    <>
      <Head>
        <title>{slug && `${camelCase(slug)} | ${process.env.SITE_NAME}`}</title>
      </Head>
      <Row justify='center' gutter={[16, 16]} style={{ margin: '1.5em 3em' }}>
        {data ? (
          data?.product.map((d, i) => (
            <ProductCard key={i} product={d} path={slug} />
          ))
        ) : (
          <Spinner />
        )}
      </Row>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductIndex)
