import { gql, useQuery } from '@apollo/client'
import { Divider } from 'antd'
import Pid from '../../../components/molecules/Pid'
import ProductCard from '../../../components/molecules/ProductCard'

// definicion que datos voy a recibir del servidor
const HAT = gql`
  query($sId: ID!) {
    hats(_id: $sId) {
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
  }
`
const HATS = gql`
  query {
    hats(limit: 4) {
      _id
      brand
      model
      description
      price
      imgs
    }
  }
`

const Product = ({ id }) => {
  // peticiones al servidor para renderisar en la pantalla
  const { data } = useQuery(HAT, { variables: { sId: id } })
  const { data: hatsData } = useQuery(HATS)

  return (
    <main>
      {/*producto con sus especificasiones */}
      {data && <Pid product={data.hats[0]} />}

      <Divider orientation="left">Las personas tambien buscan esto</Divider>

      {/* productos recomendados */}
      <section className="section">
        <div className="container">
          <div className="columns">
            {hatsData?.hats.map((d, i) => (
              <ProductCard key={i} product={d} path="hats" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

//obtengo el ID del producto elegido y le paso como props a Product para hacer la peticion al servidor
export async function getServerSideProps(context) {
  const { id } = context.query
  return { props: { id } }
}

export default Product
