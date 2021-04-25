import {
  Popover,
  Row,
  Col,
  Button,
  Upload,
  message,
  Form,
  Input,
  Image,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import useFetchImg from '../../hooks/useFetchImg'

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
const UPLOADBANNER = gql`
  mutation($pubId: String!, $path: String!, $href: String!, $id: ID!) {
    uploadBanner(pubId: $pubId, path: $path, href: $href, _id: $id)
  }
`
const DELETEBANNER = gql`
  mutation($pathImg: String!, $id: ID!) {
    deleteBanner(path: $pathImg, _id: $id)
  }
`
const localUri = 'https://goshop.vercel.app/'

const ChangeBanner = () => {
  const [imgUpload, setImgUpload] = useState()
  const { data: banner } = useQuery(BANNER, {
    variables: { id: localStorage.getItem('_id') },
  })
  const [uploadBanner] = useMutation(UPLOADBANNER)
  const [deleteBanner] = useMutation(DELETEBANNER)
  const [doFetch] = useFetchImg()

  const imgs = []
  banner?.admin.banner.map((img, i) => {
    imgs.push({ uid: i, status: 'done', url: img.path, href: img.href })
  })

  let c = 0
  const props = {
    beforeUpload: (file, fileList) => {
      if (c > 0) return
      let imgs = []
      fileList.map(f => {
        const fileRules = /jpeg|jpg|png/
        if (!fileRules.test(f.type)) return message.info('Eliga un imagen pls')
        if (!f) return
        imgs.push(f)
      })
      c++
      setImgUpload(imgs)
    },
  }

  const formSubmit = async value => {
    try {
      const valueArray = Object.values(value)
      imgUpload.map(async (img, i) => {
        const file = await doFetch(img)

        await uploadBanner({
          variables: {
            pubId: file.public_id,
            path: file.secure_url,
            href: valueArray[i],
            id: localStorage.getItem('_id'),
          },
        })

        // espero que todas las imagense se suban al servidor
        if (imgUpload.length - 1 === i) {
          location.reload()
        }
      })
    } catch (error) {
      message.error(error)
    }
  }
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

  return (
    <>
      {banner?.admin.banner ? (
        <Row>
          <Col>
            <Form
              {...formItemLayout}
              onFinish={formSubmit}
              initialValues={{
                href1: imgs[0]?.href || '',
                href2: imgs[1]?.href || '',
                href3: imgs[2]?.href || '',
                href4: imgs[3]?.href || '',
              }}
            >
              <Form.Item
                label="Link 1"
                name="href1"
                rules={[{ required: true, message: 'Campo requerido' }]}
              >
                <Input addonBefore={localUri} />
              </Form.Item>
              <Form.Item
                label="Link 2"
                name="href2"
                rules={[{ required: true, message: 'Campo requerido' }]}
              >
                <Input addonBefore={localUri} />
              </Form.Item>
              <Form.Item label="Link 3" name="href3">
                <Input addonBefore={localUri} />
              </Form.Item>
              <Form.Item label="Link 4" name="href4">
                <Input addonBefore={localUri} />
              </Form.Item>

              {imgs.length > 3 ? null : (
                <>
                  <Row justify="center">
                    <Form.Item>
                      <Upload {...props} multiple listType="picture-card">
                        <UploadOutlined />
                      </Upload>
                    </Form.Item>
                  </Row>
                </>
              )}
              <Row justify="center">
                <Button htmlType="submit" type="primary">
                  Guardar Cambios
                </Button>
              </Row>
            </Form>

            <Row style={{ margin: '1em 0 0 ' }} justify="center">
              {imgs.map((img, i) => (
                <Col
                  key={i}
                  id={i}
                  style={{
                    border: '.5px solid #ececec',
                    margin: '0 .5em 0 0',
                    padding: '.5em',
                  }}
                >
                  <Popover
                    content={() => (
                      <Button
                        size="small"
                        type="primary"
                        onClick={async () => {
                          await deleteBanner({
                            variables: {
                              pathImg: img.url,
                              id: localStorage.getItem('_id'),
                            },
                          })
                          document.getElementById(i).remove()
                          message.info('imagen eliminado')
                        }}
                      >
                        Eliminar
                      </Button>
                    )}
                  >
                    <Image
                      src={img.url}
                      key={i}
                      height={100}
                      width={100}
                      style={{
                        objectFit: 'contain',
                      }}
                    />
                  </Popover>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      ) : (
        <h1>cargando...</h1>
      )}
    </>
  )
}

export default ChangeBanner
