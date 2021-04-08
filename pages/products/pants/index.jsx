import { gql, useQuery } from '@apollo/client'
import ProductCard from '../../../components/molecules/ProductCard'
import { connect } from 'react-redux'
import { navMobileNotSee } from '../../../redux/actionCreator'
import { useEffect } from 'react'

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

const index = ({ navNotSeeView }) => {
  const { data } = useQuery(PANTS)
  useEffect(() => {
    navNotSeeView()
  }, [])
  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="columns is-multiline">
            {data?.pants.map((d, i) => (
              <ProductCard key={i} product={d} path="pants" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const mapStateToProps = () => {}
const mapDispatchToProps = dispatch => {
  return {
    navNotSeeView() {
      dispatch(navMobileNotSee())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
