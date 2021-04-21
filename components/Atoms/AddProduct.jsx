import { Row, Col, Form, Input, Button, InputNumber, Select } from 'antd'
import { Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { camelCase } from '../../utils'

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

const QUERYTYPEPRODUCTS = gql`
  query {
    product {
      typeProduct
    }
  }
`
const UPLOAD_FILE = gql`
  mutation($file: Upload!, $id: ID!) {
    singleUpload(file: $file, _id: $id) {
      path
    }
  }
`
const CREATEPRODUCT = gql`
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
    $typeProduct: String!
  ) {
    createProduct(
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
        typeProduct: $typeProduct
      }
    ) {
      _id
      typeProduct
    }
  }
`

const AddProduct = ({ type }) => {
  const [imgList, setImgList] = useState([])
  const { data: queryTypeProducts } = useQuery(QUERYTYPEPRODUCTS)
  const [createProduct] = useMutation(CREATEPRODUCT)
  const [singleUpload] = useMutation(UPLOAD_FILE)

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

  const createProductFront = async values => {
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
      typeProduct,
    } = values
    try {
      const result = await createProduct({
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
          typeProduct,
        },
      })
      imgList.map(async f => {
        await singleUpload({
          variables: {
            file: f,
            id: result.data.createProduct._id,
          },
        })
      })
      typeof window !== 'undefined' && location.reload()
    } catch (error) {
      message.error('ocurrio un error')
    }
  }

  const typeProducts = [
    ...new Set(queryTypeProducts?.product.map(p => p.typeProduct)),
  ]

  return (
    <Form {...formItemLayout} onFinish={createProductFront}>
      <Row justify="center">
        <Col>
          <Row>
            <Col>
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
                name="typeProduct"
                label="Producto"
                rules={[{ required: true, message: 'Campo requerido' }]}
              >
                {type ? (
                  <Input />
                ) : (
                  <Select allowClear>
                    {typeProducts?.map((p, i) => (
                      <Option value={p}>{camelCase(p)}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center" style={{ margin: '0 0 1em' }}>
            <Form.Item name="img">
              <Upload {...props} multiple listType="picture">
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
