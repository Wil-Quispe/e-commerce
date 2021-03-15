import { gql, useQuery } from '@apollo/client'
import { Divider } from 'antd'
import Pid from '../../../components/molecules/Pid'
import ProductCard from '../../../components/molecules/ProductCard'

// definicion que datos voy a recibir del servidor
const TSHIRT = gql`
  query($sId: ID!) {
    tshirt(_id: $sId) {
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
const TSHIRTS = gql`
  query {
    tshirt(limit: 4) {
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
  const { data } = useQuery(TSHIRT, { variables: { sId: id } })
  const { data: tshirtData } = useQuery(TSHIRTS)

  return (
    <main>
      {/*producto con sus especificasiones */}
      {data && <Pid product={data.tshirt[0]} />}

      <Divider orientation="left">Las personas tambien buscan esto</Divider>

      {/* productos recomendados */}
      <section className="section">
        <div className="container">
          <div className="columns">
            {tshirtData?.tshirt.map((d, i) => (
              <ProductCard key={i} product={d} path="tshirt" />
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
