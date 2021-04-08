import { gql, useQuery } from '@apollo/client'
import ProductCard from '../../../components/molecules/ProductCard'
import { connect } from 'react-redux'
import { navMobileNotSee, loadingFalse } from '../../../redux/actionCreator'
import { useEffect } from 'react'

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

const index = ({ navNotSeeView, loadingFalse }) => {
  const { data } = useQuery(HATS)
  useEffect(() => {
    loadingFalse()
    navNotSeeView()
  }, [])
  return (
    <section className="section">
      <div className="container">
        <div className="columns is-multiline">
          {data?.hats.map((d, i) => (
            <ProductCard key={i} product={d} path="hats" />
          ))}
        </div>
      </div>
    </section>
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
