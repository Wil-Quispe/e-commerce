import { useMutation, gql } from '@apollo/client'
import { UploadOutlined } from '@ant-design/icons'
import { Upload, Button, message } from 'antd'

const UPLOAD_FILE = gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      path
    }
  }
`

const UploadForm = () => {
  const [singleUpload] = useMutation(UPLOAD_FILE, {
    onCompleted: data => console.log(data),
  })

  const props = {
    beforeUpload: async (file, fileList) => {
      let c = 0
      fileList.map(f => {
        if (c > 0) return
        const fileRules = /jpeg|jpg|png/
        if (!fileRules.test(f.type)) return message.info('Eliga un imagen pls')
        if (!f) return
        singleUpload({ variables: { file: f } })
        c++
      })
    },
  }

  return (
    <>
      {/* <input type="file" onChange={handleFileChange} /> */}
      <Upload
        {...props}
        multiple
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture"
        // defaultFileList={[...fileList]}
      >
        <Button icon={<UploadOutlined />}>Agregar Imagenes al Producto</Button>
      </Upload>
    </>
  )
}

export default UploadForm
