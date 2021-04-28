import { Row, Button, Upload, Form, Input } from 'antd'
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
        pubId
      }
    }
  }
`
const UPLOADBANNER = gql`
  mutation($pubId: String!, $path: String!, $href: String!, $id: ID!) {
    uploadBanner(pubId: $pubId, path: $path, href: $href, _id: $id)
  }
`
const UPDATEBANNER = gql`
  mutation(
    $id: ID!
    $path: String
    $pubId: String
    $newPubId: String
    $href: String
  ) {
    updateBanner(
      _id: $id
      path: $path
      pubId: $pubId
      newPubId: $newPubId
      href: $href
    )
  }
`

const Banner = ({ indice }) => {
  const { data: banner } = useQuery(BANNER, {
    variables: { id: localStorage.getItem('_id') },
  })
  const [doFetch] = useFetchImg()
  const [uploadBanner] = useMutation(UPLOADBANNER)
  const [updateBanner] = useMutation(UPDATEBANNER)
  const [loading, setLoading] = useState(false)
  const [imgUpload, setImgUpload] = useState()
  const [changeBanner, setChangeBanner] = useState(false) //stado del banner si cambia o no
  const [cc, setCc] = useState(`${banner?.admin.banner[indice]?.href}`)
  const [hrState, setHrState] = useState(false) //stado del href si cambia o no

  const qwe = {
    pubId: banner?.admin.banner[indice]?.pubId,
    path: banner?.admin.banner[indice]?.path,
    href: banner?.admin.banner[indice]?.href,
  }

  const props = {
    defaultFileList: [
      { uid: 1, status: 'done', url: banner?.admin.banner[indice]?.path },
    ],
    data: async file => {
      setImgUpload(file)
    },
    onRemove: async file => {
      setChangeBanner(true)
    },
  }

  const onFinishBanner = async values => {
    setLoading(true)
    if (hrState && changeBanner) {
      //cambian ambos o nuevo banner
      const result = await doFetch(imgUpload)
      await uploadBanner({
        variables: {
          pubId: result.public_id,
          path: result.secure_url,
          href: values.href,
          id: localStorage.getItem('_id'),
        },
      })
    } else if (changeBanner && !hrState) {
      //solo cambia banner
      const result = await doFetch(imgUpload)
      await updateBanner({
        variables: {
          pubId: qwe.pubId,
          newPubId: result.public_id,
          path: result.secure_url,
          id: localStorage.getItem('_id'),
        },
      })
    } else if (hrState && !changeBanner) {
      //solo cambia href
      await updateBanner({
        variables: {
          pubId: qwe.pubId,
          href: values.href,
          id: localStorage.getItem('_id'),
        },
      })
    }
    location.reload()
  }

  return (
    <>
      {banner?.admin.banner ? (
        <Form
          onFinish={onFinishBanner}
          initialValues={{
            href: banner.admin.banner[indice]?.href,
          }}
        >
          <Form.Item
            onChange={e => {
              setHrState(true)
              setCc(e.target.value)
            }}
            name="href"
            label="href"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Upload {...props} listType="picture-card">
              <UploadOutlined />
            </Upload>
          </Form.Item>
          <Row justify="center">
            <Button htmlType="submit" type="primary" loading={loading}>
              Guardar cambios
            </Button>
          </Row>
        </Form>
      ) : (
        <h3>Cargando...</h3>
      )}
    </>
  )
}
export default Banner
