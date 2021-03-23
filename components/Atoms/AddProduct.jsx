import { Row, Col, Form, Input, Button, InputNumber, Select } from 'antd'
import { gql, useMutation } from '@apollo/client'

const { Option } = Select
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

const CREATESHOES = gql`
  mutation(
    $brand: String!
    $model: String!
    $description: String!
    $price: Int!
    $stock: Int!
    $gender: String!
    $type: String!
    $material: String!
    $size: [String!]!
    $product: String!
  ) {
    shoesCreate(
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
        product: $product
      }
    ) {
      brand
    }
  }
`
const CREATEPANTS = gql`
  mutation(
    $brand: String!
    $model: String!
    $description: String!
    $price: Int!
    $stock: Int!
    $gender: String!
    $type: String!
    $material: String!
    $size: [String!]!
    $product: String!
  ) {
    pantsCreate(
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
        product: $product
      }
    ) {
      brand
    }
  }
`
const CREATETSHIRT = gql`
  mutation(
    $brand: String!
    $model: String!
    $description: String!
    $price: Int!
    $stock: Int!
    $gender: String!
    $type: String!
    $material: String!
    $size: [String!]!
    $product: String!
  ) {
    tshirtCreate(
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
        product: $product
      }
    ) {
      brand
    }
  }
`
const CREATEHATS = gql`
  mutation(
    $brand: String!
    $model: String!
    $description: String!
    $price: Int!
    $stock: Int!
    $gender: String!
    $type: String!
    $material: String!
    $size: [String!]!
    $product: String!
  ) {
    hatsCreate(
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
        product: $product
      }
    ) {
      brand
    }
  }
`

const AddProduct = ({ productType }) => {
  const [shoesCreate] = useMutation(CREATESHOES)
  const [pantsCreate] = useMutation(CREATEPANTS)
  const [tshirtCreate] = useMutation(CREATETSHIRT)
  const [hatsCreate] = useMutation(CREATEHATS)

  const createProduct = async values => {
    const size = values.size.split(' ')
    const {
      brand,
      model,
      description,
      price,
      stock,
      gender,
      type,
      material,
      product,
    } = values

    if (Object.keys(values).includes('shoes')) {
      const result = await shoesCreate({
        variables: {
          brand,
          model,
          description,
          price,
          stock,
          gender,
          type,
          material,
          size,
          product,
        },
      })
      console.log(result)
      typeof window !== 'undefined' && location.reload()
    }
    if (Object.keys(values).includes('pants')) {
      console.log(values)
      const result = await pantsCreate({
        variables: {
          brand,
          model,
          description,
          price,
          stock,
          gender,
          type,
          material,
          size,
          product,
        },
      })
      console.log(result)
      typeof window !== 'undefined' && location.reload()
    }
    if (Object.keys(values).includes('tshirt')) {
      const result = await tshirtCreate({
        variables: {
          brand,
          model,
          description,
          price,
          stock,
          gender,
          type,
          material,
          size,
          product,
        },
      })
      console.log(result)
      typeof window !== 'undefined' && location.reload()
    }
    if (Object.keys(values).includes('hats')) {
      const result = await hatsCreate({
        variables: {
          brand,
          model,
          description,
          price,
          stock,
          gender,
          type,
          material,
          size,
          product,
        },
      })
      console.log(result)
      typeof window !== 'undefined' && location.reload()
    }
  }

  return (
    <Form
      {...formItemLayout}
      onFinish={createProduct}
      initialValues={{
        product: productType,
      }}
    >
      <Row justify="center">
        <Col>
          <Form.Item name={productType} style={{ display: 'none' }} />
          <Form.Item
            label="Marca"
            name="brand"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Modelo"
            name="model"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Precio"
            name="price"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <InputNumber />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="Quien usa?"
            name="gender"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Select allowClear>
              <Option value="male">Hombre</Option>
              <Option value="female">Mujer</Option>
              <Option value="other">Ambos</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Tipo"
            name="type"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Select allowClear>
              <Option value="male">Casuales</Option>
              <Option value="female">Urbanas</Option>
              <Option value="other">Escolares</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Material"
            name="material"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="size"
            label="Tallas"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="product"
            label="Producto"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center">
        <Button type="primary" htmlType="submit">
          Crear Producto
        </Button>
      </Row>
    </Form>
  )
}

export default AddProduct
