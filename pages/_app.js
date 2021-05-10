import Navbar from '../components/organisms/Navbar'
import 'antd/dist/antd.css'
import '../styles/styles.css'
import Footer from '../components/organisms/Footer'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { Provider } from 'react-redux'
import { useEffect, useState } from 'react'

import store from '../redux/store'
import Spinner from '../components/Atoms/Spinner'

const client = new ApolloClient({
  uri: process.env.URI,
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
          <Provider store={store}>
            <Navbar />
            <Component {...pageProps} />
            <Footer />
          </Provider>
        </ApolloProvider>
      )}
    </>
  )
}

export default MyApp
