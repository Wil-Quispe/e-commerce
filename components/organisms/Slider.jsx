import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'
import { Carousel, Row } from 'antd'
const BANNER = gql`
  query ($id: ID!) {
    admin(_id: $id) {
      banner {
        path
        href
      }
    }
  }
`

const Slider = () => {
  const { data: banner } = useQuery(BANNER, {
    variables: { id: process.env.ADMIN_ID },
  })

  return (
    <section className='section'>
      <div className='container'>
        <Carousel autoplay>
          {banner?.admin.banner.map((img, i) => (
            <div key={i}>
              <Row justify='center'>
                <Link href={img.href}>
                  <a>
                    <img src={img.path} />
                  </a>
                </Link>
              </Row>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}

export default Slider
