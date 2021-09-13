import { Row } from 'antd'
import Head from 'next/head'
import ProductCard from '../../components/molecules/ProductCard'
import { camelCase } from '../../utils/index'
import Spinner from '../../components/Atoms/Spinner'
import { fetchGraphQlQuery } from '../../lib/fetchGraphql'

const ProductIndex = ({ data }) => {
  const slug = data?.product[0].typeProduct
  return (
    <>
      <Head>
        <title>{slug && `${camelCase(slug)} | ${process.env.SITE_NAME}`}</title>
      </Head>
      <Row justify="center" gutter={[16, 16]} style={{ margin: '1.5em 3em' }}>
        {data ? (
          data?.product.map((d, i) => (
            <ProductCard key={i} product={d} path={slug} />
          ))
        ) : (
          <Spinner />
        )}
      </Row>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const query = `
  query($typeProduct: String!) {
    product(typeProduct: $typeProduct) {
      _id
      brand
      model
      description
      price
      imgs {
        pubId
        pathImg
      }
      typeProduct
    }
  }
  
  `
  const variables = { typeProduct: context.params?.slug }

  const data = await fetchGraphQlQuery(query, variables)

  return { props: { data } }
}

export default ProductIndex
