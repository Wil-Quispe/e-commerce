import { Row, Col, Form, Input, Button, InputNumber, Select } from 'antd'
import { Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { camelCase } from '../../utils'
import useFetchImg from '../../hooks/useFetchImg'

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
  mutation ($pubId: String!, $pathImg: String!, $id: ID!) {
    singleUpload(_id: $id, pubId: $pubId, pathImg: $pathImg)
  }
`
const CREATEPRODUCT = gql`
  mutation (
    $brand: String!
    $model: String!
    $description: String!
    $price: String!
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
  const [doFetch] = useFetchImg()
  const [loading, setLoading] = useState(false)

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
    if (!Boolean(imgList.length)) {
      return message.error('no ingresaste ninguna imagen para el producto')
    }
    setLoading(true)
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
          price: String(price),
          stock,
          gender,
          type,
          material,
          size,
          typeProduct,
        },
      })
      imgList.map(async (f, i) => {
        const file = await doFetch(f)
        await singleUpload({
          variables: {
            pubId: file.public_id,
            pathImg: file.secure_url,
            id: result.data.createProduct._id,
          },
        })

        if (imgList.length - 1 === i) {
          location.reload()
        }
      })
    } catch (error) {
      message.error(error)
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
                      <Option key={i} value={p}>
                        {camelCase(p)}
                      </Option>
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
        <Button type="primary" htmlType="submit" loading={loading}>
          Crear Producto
        </Button>
      </Row>
    </Form>
  )
}

export default AddProduct
