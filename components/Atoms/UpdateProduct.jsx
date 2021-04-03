import { Row, Col, Collapse, Form, Input, InputNumber, Button } from 'antd'
import { gql, useMutation } from '@apollo/client'
import { DeleteFilled } from '@ant-design/icons'

const SHOESUPDATE = gql`
  mutation(
    $id: ID!
    $brand: String
    $model: String
    $description: String
    $price: Int
    $stock: Int
    $gender: String
    $type: String
    $material: String
    $size: [String]
  ) {
    shoesUpdate(
      _id: $id
      data: {
        brand: $brand
        model: $model
        description: $description
        price: $price
        stock: $stock
        gender: $gender
        type: $type
        material: $material
        size: $size
      }
    ) {
      brand
    }
  }
`
const PANTSUPDATE = gql`
  mutation(
    $id: ID!
    $brand: String
    $model: String
    $description: String
    $price: Int
    $stock: Int
    $gender: String
    $type: String
    $material: String
    $size: [String]
  ) {
    pantsUpdate(
      _id: $id
      data: {
        brand: $brand
        model: $model
        description: $description
        price: $price
        stock: $stock
        gender: $gender
        type: $type
        material: $material
        size: $size
      }
    ) {
      brand
    }
  }
`
const TSHIRTSUPDATE = gql`
  mutation(
    $id: ID!
    $brand: String
    $model: String
    $description: String
    $price: Int
    $stock: Int
    $gender: String
    $type: String
    $material: String
    $size: [String]
  ) {
    tshirtUpdate(
      _id: $id
      data: {
        brand: $brand
        model: $model
        description: $description
        price: $price
        stock: $stock
        gender: $gender
        type: $type
        material: $material
        size: $size
      }
    ) {
      brand
    }
  }
`
const HATSUPDATE = gql`
  mutation(
    $id: ID!
    $brand: String
    $model: String
    $description: String
    $price: Int
    $stock: Int
    $gender: String
    $type: String
    $material: String
    $size: [String]
  ) {
    hatsUpdate(
      _id: $id
      data: {
        brand: $brand
        model: $model
        description: $description
        price: $price
        stock: $stock
        gender: $gender
        type: $type
        material: $material
        size: $size
      }
    ) {
      brand
    }
  }
`
const SHOESDELETE = gql`
  mutation($id: ID!) {
    shoesDelete(_id: $id) {
      brand
    }
  }
`
const PANTSDELETE = gql`
  mutation($id: ID!) {
    pantsDelete(_id: $id) {
      brand
    }
  }
`
const TSHIRTSDELETE = gql`
  mutation($id: ID!) {
    tshirtDelete(_id: $id) {
      brand
    }
  }
`
const HATSDELETE = gql`
  mutation($id: ID!) {
    hatsDelete(_id: $id) {
      brand
    }
  }
`

const { Panel } = Collapse
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
}

const UpdateProduct = ({ product }) => {
  const [shoesUpdate] = useMutation(SHOESUPDATE)
  const [pantsUpdate] = useMutation(PANTSUPDATE)
  const [tshirtUpdate] = useMutation(TSHIRTSUPDATE)
  const [hatsUpdate] = useMutation(HATSUPDATE)
  const [shoesDelete] = useMutation(SHOESDELETE)
  const [pantsDelete] = useMutation(PANTSDELETE)
  const [tshirtDelete] = useMutation(TSHIRTSDELETE)
  const [hatsDelete] = useMutation(HATSDELETE)

  const updateProduct = async values => {
    const size = values.size.split()
    const {
      brand,
      model,
      description,
      price,
      stock,
      gender,
      type,
      material,
    } = values
    if (product.product === 'shoes') {
      const result = await shoesUpdate({
        variables: {
          id: product._id,
          brand,
          model,
          description,
          price,
          stock,
          gender,
          type,
          material,
          size,
        },
      })
      typeof window !== 'undefined' && location.reload()
    }
    if (product.product === 'pants') {
      const result = await pantsUpdate({
        variables: {
          id: product._id,
          brand,
          model,
          description,
          price,
          stock,
          gender,
          type,
          material,
          size,
        },
      })
      typeof window !== 'undefined' && location.reload()
    }
    if (product.product === 'tshirt') {
      const result = await tshirtUpdate({
        variables: {
          id: product._id,
          brand,
          model,
          description,
          price,
          stock,
          gender,
          type,
          material,
          size,
        },
      })
      typeof window !== 'undefined' && location.reload()
    }
    if (product.product === 'hats') {
      const result = await hatsUpdate({
        variables: {
          id: product._id,
          brand,
          model,
          description,
          price,
          stock,
          gender,
          type,
          material,
          size,
        },
      })
      typeof window !== 'undefined' && location.reload()
    }
  }

  const deleteProduct = async e => {
    e.stopPropagation()
    if (product.product === 'shoes') {
      await shoesDelete({ variables: { id: product._id } })
      console.log('deleted')
      typeof window !== 'undefined' && location.reload()
    }
    if (product.product === 'pants') {
      await pantsDelete({ variables: { id: product._id } })
      console.log('deleted')
      typeof window !== 'undefined' && location.reload()
    }
    if (product.product === 'tshirt') {
      await tshirtDelete({ variables: { id: product._id } })
      console.log('deleted')
      typeof window !== 'undefined' && location.reload()
    }
    if (product.product === 'hats') {
      await hatsDelete({ variables: { id: product._id } })
      console.log('deleted')
      typeof window !== 'undefined' && location.reload()
    }
  }

  const size = product.size.join(' ')
  // console.log(product)
  return (
    <Collapse>
      <Panel
        header={`${product.brand} ${product.model}`}
        extra={<DeleteFilled onClick={deleteProduct} />}
      >
        <Form
          {...formItemLayout}
          onFinish={updateProduct}
          initialValues={{
            brand: product.brand || ' ',
            model: product.model || ' ',
            description: product.description || ' ',
            price: product.price || ' ',
            stock: product.stock || ' ',
            gender: product.gender || ' ',
            type: product.type || ' ',
            material: product.material || ' ',
            size: size || ' ',
          }}
        >
          <Row>
            <Col>
              <Form.Item label="Marca" name="brand">
                <Input />
              </Form.Item>
              <Form.Item label="Modelo" name="model">
                <Input />
              </Form.Item>
              <Form.Item label="Descripcion" name="description">
                <Input />
              </Form.Item>
              <Form.Item label="Precio" name="price">
                <InputNumber />
              </Form.Item>
              <Form.Item label="Stock" name="stock">
                <InputNumber />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="Genero" name="gender">
                <Input />
              </Form.Item>
              <Form.Item label="Tipo" name="type">
                <Input />
              </Form.Item>
              <Form.Item label="Material" name="material">
                <Input />
              </Form.Item>
              <Form.Item label="Tallas" name="size">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center">
            <Button type="primary " htmlType="submit">
              Guardar Cambios
            </Button>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  )
}

export default UpdateProduct
