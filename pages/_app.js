import Navbar from '../components/organisms/Navbar'
import 'antd/dist/antd.css'
import Footer from '../components/organisms/Footer'
import Comments from '../components/organisms/Comments'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CartProvider from '../components/molecules/cart/CartProvider'

const promiseStripe = loadStripe(process.env.STRIPE)

const client = new ApolloClient({
  uri: process.env.URI,
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Elements stripe={promiseStripe}>
        <CartProvider>
          <Navbar />
          <Component {...pageProps} />
          <Comments />
          <Footer />
        </CartProvider>
      </Elements>
    </ApolloProvider>
  )
}

export default MyApp
