import Navbar from '../components/organisms/Navbar'
import 'antd/dist/antd.css'
import Footer from '../components/organisms/Footer'
import Comments from '../components/organisms/Comments'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { createUploadLink } from 'apollo-upload-client'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { Provider } from 'react-redux'

import store from '../redux/store'

const promiseStripe = loadStripe(process.env.STRIPE)

const uploadLink = createUploadLink({
  uri: 'http://localhost:5000',
})
const httpLink = new HttpLink({
  uri: 'http://localhost:5000',
})

const wsLink = process.browser
  ? new WebSocketLink({
      uri: 'ws://localhost:5000/subs',
      options: { reconnect: true },
    })
  : null

const link = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      httpLink
    )
  : httpLink

const client = new ApolloClient({
  link: uploadLink || link,
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Elements stripe={promiseStripe}>
        <Provider store={store}>
          <Navbar />
          <Component {...pageProps} />
          <Comments />
          <Footer />
        </Provider>
      </Elements>
    </ApolloProvider>
  )
}

export default MyApp
