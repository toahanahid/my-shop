import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

const PayPalPaymentButtons = ({ handlePlaceOrder, amount }) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount, // Use the total amount from cart
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      // This function shows a transaction success message to your user.
      alert(`Transaction completed by ${details.payer.name.given_name}!`);
      handlePlaceOrder(null, data.orderID); // Pass PayPal order ID to handlePlaceOrder
    });
  };

  return (
    <>
      {isPending ? <p>Loading PayPal...</p> : null}
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error("PayPal Checkout onError", err);
          alert("PayPal Checkout Error");
        }}
        onCancel={() => {
          console.log("PayPal Checkout onCancel");
          alert("PayPal Checkout Cancelled");
        }}
      />
    </>
  );
};

export default PayPalPaymentButtons;
