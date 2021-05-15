import {
  Row,
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  Upload,
  Tooltip,
  message,
} from 'antd'
import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { DeleteFilled, UploadOutlined } from '@ant-design/icons'
import { camelCase } from '../../utils/index'
import useFetchImg from '../../hooks/useFetchImg'

const UPLOAD_FILE = gql`
  mutation ($pubId: String!, $pathImg: String!, $id: ID!) {
    singleUpload(_id: $id, pubId: $pubId, pathImg: $pathImg)
  }
`
const DELETEIMGUPLOADED = gql`
  mutation ($path: String!, $prodId: ID!) {
    deleteImgUploaded(pathImg: $path, productId: $prodId)
  }
`
const PRODUCTUPDATE = gql`
  mutation (
    $id: ID!
    $brand: String
    $model: String
    $description: String
    $price: String
    $stock: Int
    $gender: String
    $type: String
    $material: String
    $size: [String]
  ) {
    updateProduct(
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
      _id
      typeProduct
    }
  }
`
const PRODUCTDELETE = gql`
  mutation ($id: ID!, $imgs: [String!]!) {
    deleteProduct(_id: $id, imgs: $imgs) {
      _id
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

const UpdateProducts = ({ product }) => {
  const [imgList, setImgList] = useState([])
  const [updateProduct] = useMutation(PRODUCTUPDATE)
  const [deleteProduct] = useMutation(PRODUCTDELETE)
  const [deleteImgUploaded] = useMutation(DELETEIMGUPLOADED)
  const [singleUpload] = useMutation(UPLOAD_FILE)
  const [doFetch] = useFetchImg()
  const [loading, setLoading] = useState(false)

  const updateProductFront = async values => {
    setLoading(true)
    const size = values.size.split(' ')
    const { brand, model, description, price, stock, gender, type, material } =
      values

    const result = await updateProduct({
      variables: {
        id: product._id,
        brand,
        model,
        description,
        price: String(price),
        stock,
        gender,
        type,
        material,
        size,
      },
    })
    if (imgList.length) {
      imgList.map(async (f, i) => {
        const file = await doFetch(f)
        await singleUpload({
          variables: {
            pubId: file.public_id,
            pathImg: file.secure_url,
            id: result.data.updateProduct._id,
          },
        })
        if (imgList.length - 1 === i) {
          setLoading(false)
          location.reload()
        }
      })
    } else location.reload()
  }

  const deleteProductFront = async e => {
    message.info('No puedes eliminar el producto son de Ejemplo')
    return
    e.stopPropagation()
    let imgsVar = []
    imgs.map(i => {
      imgsVar.push(i.url)
    })

    await deleteProduct({
      variables: { id: product._id, imgs: imgsVar },
    })
    setTimeout(() => {
      location.reload()
    }, 1000)
  }

  const size = product.size.join(' ')

  const imgs = []
  product.imgs.map((img, i) => {
    imgs.push({ uid: i, status: 'done', url: img.pathImg })
  })

  let c = 0
  const props = {
    defaultFileList: [...imgs],
    showUploadList: {
      removeIcon: (
        <Tooltip title="Eliminar imagen">
          <Button type="link" icon={<DeleteFilled />} />
        </Tooltip>
      ),
    },
    onRemove: async file => {
      setLoading(true)
      try {
        await deleteImgUploaded({
          variables: {
            path: file.url,
            prodId: product._id,
          },
        })
        message.info('Eliminado correctamente')
        setLoading(false)
      } catch (error) {
        message.error('fallo al eliminar la imagen')
      }
    },
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

  return (
    <Collapse>
      <Panel
        header={`${camelCase(product.typeProduct)} -- ${product.brand} ${
          product.model
        }`}
        extra={
          <Popconfirm
            title="Seguro que quieres Eliminar?"
            okText="Si"
            cancelText="Cancelar"
            onConfirm={deleteProductFront}
            onCancel={e => {
              e.stopPropagation()
            }}
          >
            <DeleteFilled
              onClick={e => {
                e.stopPropagation()
              }}
            />
          </Popconfirm>
        }
      >
        <Form
          {...formItemLayout}
          onFinish={updateProductFront}
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
          <Row justify="center">
            <Col>
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
                    <InputNumber min={1} />
                  </Form.Item>
                  <Form.Item label="Stock" name="stock">
                    <InputNumber min={1} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item label="Género" name="gender">
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
                <Form.Item name="img">
                  <Upload {...props} multiple listType="picture-card">
                    {imgs.length >= 8 ? null : <UploadOutlined />}
                  </Upload>
                </Form.Item>
              </Row>
            </Col>
          </Row>
          <Row justify="center">
            <Button type="primary" loading={loading} htmlType="submit">
              Guardar Cambios
            </Button>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  )
}

export default UpdateProducts
