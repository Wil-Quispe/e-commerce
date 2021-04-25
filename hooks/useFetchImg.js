const useFetchImg = () => {
  const doFetch = async img => {
    try {
      const data = new FormData()
      data.append('file', img)
      data.append('upload_preset', 'dphhkpiyp')

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dphhkpiyp/image/upload',
        { method: 'POST', body: data }
      )

      const file = await res.json()
      return file
    } catch (err) {
      throw new Error(error)
    }
  }

  return [doFetch]
}

export default useFetchImg
