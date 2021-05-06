const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = phase => {
  if (PHASE_DEVELOPMENT_SERVER === phase) {
    const env = {
      STRIPE:
        'pk_test_51IOpquKXTg6hXZjZIbyjoZNlRqSSaHNYwJKcS8Mocszzzfeg99KTLcJklXdjD4l3pCV1W5sIBTphJb3JotsjBtbR000wub94Dn',
      URI: 'http://localhost:5000',
      SITE_NAME: 'Goshop',
      ADMIN_ID: '607f51a529a0b668d8f0d0e9',
    }
    return { env }
  }
  const env = {
    STRIPE:
      'pk_test_51IOpquKXTg6hXZjZIbyjoZNlRqSSaHNYwJKcS8Mocszzzfeg99KTLcJklXdjD4l3pCV1W5sIBTphJb3JotsjBtbR000wub94Dn',
    URI: 'https://e-back.vercel.app',
    SITE_NAME: 'Goshop',
    ADMIN_ID: '607f51a529a0b668d8f0d0e9',
  }

  return { env }
}
