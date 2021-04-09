import { gql, useQuery } from '@apollo/client'
import ProductCard from '../../../components/molecules/ProductCard'
import { connect } from 'react-redux'
import { navMobileNotSee, loadingFalse } from '../../../redux/actionCreator'
import { useEffect } from 'react'
import Head from 'next/head'

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

const index = ({ navNotSeeView, loadingFalse }) => {
  const { data } = useQuery(PANTS)
  useEffect(() => {
    navNotSeeView()
    loadingFalse()
  }, [])
  return (
    <>
      <Head>
        <title>Pantalones | {process.env.SITE_NAME}</title>
      </Head>
      <section className="section">
        <div className="container">
          <div className="columns is-multiline">
            {data?.pants.map((d, i) => (
              <ProductCard key={i} product={d} path="pants" />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

const mapStateToProps = () => {}
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

export default connect(mapStateToProps, mapDispatchToProps)(index)
