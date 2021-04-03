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
      _id
      __typename
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
      _id
      __typename
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
      _id
      __typename
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
      _id
      __typename
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
const UPLOAD_FILE = gql`
  mutation($file: Upload!, $id: ID!, $type: String!) {
    singleUpload(file: $file, _id: $id, typeProduct: $type) {
      path
    }
  }
`
const DELETEIMGUPLOADED = gql`
  mutation($path: String!, $prodId: ID!, $typeProd: String!) {
    deleteImgUploaded(
      pathImg: $path
      productId: $prodId
      typeProduct: $typeProd
    )
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
  const [imgList, setImgList] = useState([])
  const [shoesUpdate] = useMutation(SHOESUPDATE)
  const [pantsUpdate] = useMutation(PANTSUPDATE)
  const [tshirtUpdate] = useMutation(TSHIRTSUPDATE)
  const [hatsUpdate] = useMutation(HATSUPDATE)
  const [shoesDelete] = useMutation(SHOESDELETE)
  const [pantsDelete] = useMutation(PANTSDELETE)
  const [tshirtDelete] = useMutation(TSHIRTSDELETE)
  const [hatsDelete] = useMutation(HATSDELETE)
  const [deleteImgUploaded] = useMutation(DELETEIMGUPLOADED)
  const [singleUpload] = useMutation(UPLOAD_FILE, {
    onCompleted: data => console.log(data),
  })

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
      imgList.map(async f => {
        await singleUpload({
          variables: {
            file: f,
            id: result.data.shoesUpdate._id,
            type: result.data.shoesUpdate.__typename,
          },
        })
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
      imgList.map(async f => {
        await singleUpload({
          variables: {
            file: f,
            id: result.data.pantsUpdate._id,
            type: result.data.pantsUpdate.__typename,
          },
        })
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
      imgList.map(async f => {
        await singleUpload({
          variables: {
            file: f,
            id: result.data.tshirtUpdate._id,
            type: result.data.tshirtUpdate.__typename,
          },
        })
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
      imgList.map(async f => {
        await singleUpload({
          variables: {
            file: f,
            id: result.data.hatsUpdate._id,
            type: result.data.hatsUpdate.__typename,
          },
        })
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

  const imgs = []

  product.imgs.map((img, i) => {
    imgs.push({ uid: i, status: 'done', url: img })
  })

  let c = 0
  const props = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    defaultFileList: [...imgs],
    showUploadList: {
      removeIcon: (
        <Tooltip title="Eliminar imagen">
          <Button type="link" icon={<DeleteFilled />} />
        </Tooltip>
      ),
    },
    onRemove: async file => {
      try {
        await deleteImgUploaded({
          variables: {
            path: file.url,
            typeProd: product.__typename,
            prodId: product._id,
          },
        })
        message.info('Eliminado correctamente')
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
        header={`${product.brand} ${product.model}`}
        extra={
          <Popconfirm
            title="Seguro que quieres Eliminar?"
            okText="Si"
            cancelText="Cancelar"
            onConfirm={deleteProduct}
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
                <Form.Item name="img">
                  <Upload
                    {...props}
                    multiple
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                  >
                    {imgs.length >= 8 ? null : <UploadOutlined />}
                  </Upload>
                </Form.Item>
              </Row>
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
