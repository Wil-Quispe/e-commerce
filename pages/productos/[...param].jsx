import { Divider, Row } from 'antd'
import Pid from '../../components/molecules/Pid'
import ProductCard from '../../components/molecules/ProductCard'
import { fetchGraphQlQuery } from '../../lib/fetchGraphql'
import Spinner from '../../components/Atoms/Spinner'

const ProductId = ({ data }) => {
  const param = data.one[0].typeProduct

  return (
    <main>
      {data ? (
        <>
          {/* producto con sus especificasiones */}
          {data && <Pid product={data.one[0]} />}

          <Divider orientation="left">Las personas también buscan esto</Divider>

          {/* productos recomendados */}
          <Row
            justify="center"
            gutter={[16, 16]}
            style={{ margin: '1.5em 3em' }}
          >
            {data?.many?.map((d, i) => (
              <ProductCard key={i} product={d} path={param} />
            ))}
          </Row>
        </>
      ) : (
        <Spinner />
      )}
    </main>
  )
}

export const getServerSideProps = async ({ params }) => {
  const query = `
  query($sId: ID!, $typeProduct: String!) {
    one: product(_id: $sId) {
      _id
      brand
      description
      model
      price
      stock
      gender
      material
      imgs {
        pubId
        pathImg
      }
      size
      typeProduct
    }


   many: product(typeProduct: $typeProduct) {
    _id
    brand
    description
    model
    price
    imgs {
      pubId
      pathImg
    }
  }

  }
  `
  const variables = { sId: params.param[1], typeProduct: params.param[0] }

  const data = await fetchGraphQlQuery(query, variables)

  return { props: { data } }
}

export default ProductId
