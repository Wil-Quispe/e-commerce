const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = phase => {
  const env = {
    URI: '',
    SITE_NAME: 'Goshop',
    ADMIN_ID: '607f51a529a0b668d8f0d0e9',
    PAYPAL_ID:
      'AY9oyV-Rfw2HZgVzfx8N5OyHSqGyiee2hcUC6l5QwsYLqMXR3HVT6zRLpzXFJmnN32WT9hFoHnzFfTQ9',
    PAYPAL_CURRENCY: 'USD',
    FACEBOOK_ID: '151368343545938',
    GOOGLE_ID:
      '1086856703745-ng0rgthsjdc280e9tg3si0fqft05bkfa.apps.googleusercontent.com',
  }
  if (PHASE_DEVELOPMENT_SERVER === phase) {
    env.URI = 'http://localhost:5000'
    return { env }
  }
  env.URI = 'https://e-back.vercel.app'

  return { env }
}
