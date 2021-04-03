import { Row, Col, Form, Input, Button, InputNumber, Select } from 'antd'
import { Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
// import UploadForm from './UploadForm'

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
      _id
      __typename
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
      _id
      __typename
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
      _id
      __typename
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
      _id
      __typename
    }
  }
`
const UPLOAD_FILE = gql`
  mutation($file: Upload!, $id: ID!, $type: String!) {
    singleUpload(file: $file, _id: $id, typeProduct: $type) {
      path
    }
  }
`

const AddProduct = ({ productType }) => {
  const [imgList, setImgList] = useState([])
  const [shoesCreate] = useMutation(CREATESHOES)
  const [pantsCreate] = useMutation(CREATEPANTS)
  const [tshirtCreate] = useMutation(CREATETSHIRT)
  const [hatsCreate] = useMutation(CREATEHATS)
  const [singleUpload] = useMutation(UPLOAD_FILE, {
    onCompleted: data => console.log(data),
  })

  let c = 0
  const props = {
    beforeUpload: async (file, fileList) => {
      if (c > 0) return
      let imgs = []
      fileList.map(f => {
        const fileRules = /jpeg|jpg|png/
        if (!fileRules.test(f.type)) return message.info('Eliga un imagen pls')
        if (!f) return
        imgs.push(f)
        // singleUpload({ variables: { file: f } })
      })
      c++
      setImgList(imgs)
    },
  }

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
      imgList.map(async f => {
        await singleUpload({
          variables: {
            file: f,
            id: result.data.shoesCreate._id,
            type: result.data.shoesCreate.__typename,
          },
        })
      })

      typeof window !== 'undefined' && location.reload()
    }
    if (Object.keys(values).includes('pants')) {
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
      imgList.map(async f => {
        await singleUpload({
          variables: {
            file: f,
            id: result.data.pantsCreate._id,
            type: result.data.pantsCreate.__typename,
          },
        })
      })
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
      imgList.map(async f => {
        await singleUpload({
          variables: {
            file: f,
            id: result.data.tshirtCreate._id,
            type: result.data.tshirtCreate.__typename,
          },
        })
      })
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
      imgList.map(async f => {
        await singleUpload({
          variables: {
            file: f,
            id: result.data.hatsCreate._id,
            type: result.data.hatsCreate.__typename,
          },
        })
      })

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
          <Row>
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
          <Row justify="center" style={{ margin: '0 0 1em' }}>
            <Form.Item name="img">
              <Upload
                {...props}
                multiple
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture"
                // defaultFileList={[...fileList]}
              >
                <Button icon={<UploadOutlined />}>
                  Agregar Imagenes al Producto
                </Button>
              </Upload>
            </Form.Item>
          </Row>
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
