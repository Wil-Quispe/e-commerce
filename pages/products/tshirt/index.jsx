import { gql, useQuery } from '@apollo/client'
import ProductCard from '../../../components/molecules/ProductCard'
import { connect } from 'react-redux'
import { loadingFalse, navMobileNotSee } from '../../../redux/actionCreator'
import { useEffect } from 'react'

const TSHIRT = gql`
  query {
    tshirt {
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
  const { data } = useQuery(TSHIRT)
  useEffect(() => {
    navNotSeeView()
    loadingFalse()
  }, [])
  return (
    <section className="section">
      <div className="container">
        <div className="columns is-multiline">
          {data?.tshirt.map((d, i) => (
            <ProductCard key={i} product={d} path="tshirt" />
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
