import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import ProductCard from '../../components/molecules/ProductCard'
import { camelCase } from '../../utils/index'
import { connect } from 'react-redux'
import { navMobileNotSee, loadingFalse } from '../../redux/actionCreator'
import { useEffect } from 'react'

const QUERYPRODUCTS = gql`
  query($typeProduct: String!) {
    product(typeProduct: $typeProduct) {
      _id
      brand
      model
      description
      price
      imgs
    }
  }
`

const ProductIndex = ({ navNotSeeView, loadingFalse }) => {
  const router = useRouter()
  const { slug } = router.query
  const { data } = useQuery(QUERYPRODUCTS, { variables: { typeProduct: slug } })
  useEffect(() => {
    // loadingFalse()
    navNotSeeView()
  }, [])
  loadingFalse()

  return (
    <>
      <Head>
        <title>{slug && `${camelCase(slug)} | ${process.env.SITE_NAME}`}</title>
      </Head>
      <section className="section">
        <div className="container">
          <div className="columns is-multiline">
            {data?.product.map((d, i) => (
              <ProductCard key={i} product={d} path={slug} />
            ))}
          </div>
        </div>
      </section>
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
