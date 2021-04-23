import Navbar from '../components/organisms/Navbar'
import 'antd/dist/antd.css'
import Footer from '../components/organisms/Footer'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { Provider } from 'react-redux'
import { useEffect, useState } from 'react'

import store from '../redux/store'
import Spinner from '../components/Atoms/Spinner'

const promiseStripe = loadStripe(process.env.STRIPE)

const uploadLink = createUploadLink({
  uri: process.env.URI,
})

const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(false)
  }, [])
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <ApolloProvider client={client}>
          <Elements stripe={promiseStripe}>
            <Provider store={store}>
              <Navbar />
              <Component {...pageProps} />
              <Footer />
            </Provider>
          </Elements>
        </ApolloProvider>
      )}
    </>
  )
}

export default MyApp
