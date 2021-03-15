import { Carousel, Row, Col } from 'antd'

const Slider = () => {
  const contentStyle = {}
  return (
    <section className="section">
      <div className="container">
        <Carousel autoplay>
          <div>
            <img
              src="https://images.pexels.com/photos/2283757/pexels-photo-2283757.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
              style={contentStyle}
            />
          </div>
          <div>
            <img
              src="https://collokype.vteximg.com.br/arquivos/CyPe_FinalSale(19-02)__BannerPpal_1920x500_v2.jpg?v=637493442234670000"
              style={contentStyle}
            />
          </div>
        </Carousel>
      </div>
    </section>
    // _@stripe@19#_-
  )
}

export default Slider
