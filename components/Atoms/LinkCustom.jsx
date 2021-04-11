import { connect } from 'react-redux'
import { loadingTrue } from '../../redux/actionCreator'

const LinkCustom = ({ text, loadingTrue }) => {
  const loading = () => {
    loadingTrue()
  }
  return <span onClick={loading}>{text}</span>
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => {
  return {
    loadingTrue() {
      dispatch(loadingTrue())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkCustom)
