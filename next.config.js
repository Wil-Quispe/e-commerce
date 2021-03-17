const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = phase => {
  const isDevelopment = phase === PHASE_DEVELOPMENT_SERVER
  const env = {
    STRIPE:
      'pk_test_51IOpquKXTg6hXZjZIbyjoZNlRqSSaHNYwJKcS8Mocszzzfeg99KTLcJklXdjD4l3pCV1W5sIBTphJb3JotsjBtbR000wub94Dn',
    // URI: 'https://e-back.vercel.app',
    URI: 'http://localhost:5000',
  }
  return { env }
}
