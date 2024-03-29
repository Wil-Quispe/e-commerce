import { useState } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'

const Paypal = ({ description, amount }) => {
  const PayPalButton = paypal.Buttons.driver('react', { React, ReactDOM })
  const [dataPay, setDataPay] = useState()

  const createOrder = (data, actions, err) => {
    return actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description,
          amount: {
            currency_code: 'USD',
            value: amount,
          },
        },
      ],
    })
  }
  const onApprove = async (data, actions) => {
    const order = await actions.order.capture()
    setDataPay({ status: 'ok', order })
  }
  const onError = err => {
    setDataPay({ status: 'error' })
  }

  const PayPal = () => (
    <PayPalButton
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
      onError={err => onError(err)}
    />
  )

  return {
    PayPal,
    dataPay,
  }
}

export default Paypal
