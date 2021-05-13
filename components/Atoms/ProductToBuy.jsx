import { Card, Descriptions } from 'antd'

const ProductToBuy = ({
  brand,
  model,
  gender,
  material,
  size,
  units,
  price,
}) => {
  return (
    <Card hoverable>
      <Descriptions title="Detalles del producto" size="small">
        <Descriptions.Item label="marca">{brand}</Descriptions.Item>
        <Descriptions.Item label="modelo">{model}</Descriptions.Item>
        <Descriptions.Item label="gènero">{gender}</Descriptions.Item>
        <Descriptions.Item label="material">{material}</Descriptions.Item>
        <Descriptions.Item label="talla">{size}</Descriptions.Item>
        <Descriptions.Item label="unidades">{units}</Descriptions.Item>
        <Descriptions.Item label="precio Unitario">{price}$</Descriptions.Item>
        <Descriptions.Item label="precio final">
          {Math.round(price * units)}$
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

export default ProductToBuy
