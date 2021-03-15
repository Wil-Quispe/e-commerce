import { gql, useQuery } from '@apollo/client'
import { Divider } from 'antd'
import Pid from '../../../components/molecules/Pid'
import ProductCard from '../../../components/molecules/ProductCard'

// definicion que datos voy a recibir del servidor
const PANT = gql`
  query($sId: ID!) {
    pants(_id: $sId) {
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
const PANTS = gql`
  query {
    pants(limit: 4) {
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
  const { data } = useQuery(PANT, { variables: { sId: id } })
  const { data: pantsData } = useQuery(PANTS)

  return (
    <main>
      {/*producto con sus especificasiones */}
      {data && <Pid product={data.pants[0]} />}

      <Divider orientation="left">Las personas tambien buscan esto</Divider>

      {/* productos recomendados */}
      <section className="section">
        <div className="container">
          <div className="columns">
            {pantsData?.pants.map((d, i) => (
              <ProductCard key={i} product={d} path="pants" />
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
