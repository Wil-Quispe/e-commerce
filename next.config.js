const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = phase => {
  const env = {
    URI: '',
    SITE_NAME: 'Goshop',
    ADMIN_ID: '607f51a529a0b668d8f0d0e9',
  }
  if (PHASE_DEVELOPMENT_SERVER === phase) {
    env.URI = 'http://localhost:5000'
    return { env }
  }
  env.URI = 'https://e-back.vercel.app'

  return { env }
}
