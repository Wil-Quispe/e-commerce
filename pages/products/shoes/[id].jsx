import { gql, useQuery } from '@apollo/client'
import { Divider } from 'antd'
import Pid from '../../../components/molecules/Pid'
import ProductCard from '../../../components/molecules/ProductCard'

// definicion que datos voy a recibir del servidor
const SHOE = gql`
  query($sId: ID!) {
    shoes(_id: $sId) {
      _id
      brand
      description
      model
      price
      stock
      gender
      type
      material
      imgs
      size
    }
  }
`
const SHOES = gql`
  query {
    shoes(limit: 4) {
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
  const { data } = useQuery(SHOE, { variables: { sId: id } })
  const { data: shoesData } = useQuery(SHOES)

  return (
    <main>
      {/*producto con sus especificasiones */}
      {data && <Pid product={data.shoes[0]} />}

      <Divider orientation="left">Las personas tambien buscan esto</Divider>

      {/* productos recomendados */}
      <section className="section">
        <div className="container">
          <div className="columns">
            {shoesData?.shoes.map((d, i) => (
              <ProductCard key={i} product={d} path="shoes" />
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
