import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'
import { Carousel } from 'antd'
const BANNER = gql`
  query($id: ID!) {
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

  console.log(banner && banner)
  return (
    <section className="section" style={{ margin: '-2.5em 0' }}>
      <div className="container">
        <Carousel autoplay>
          {banner?.admin.banner.map((img, i) => (
            <div key={i}>
              <Link href={img.href}>
                <a>
                  <img src={img.path} />
                </a>
              </Link>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}

export default Slider
