import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from 'react-bootstrap';

const StripePaymentForm = ({ handlePlaceOrder, address }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: address.name,
        address: {
          line1: address.street,
          city: address.city,
          postal_code: address.zip,
        },
      },
    });

    if (error) {
      console.error('[Stripe error]', error);
      alert(error.message);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      handlePlaceOrder(paymentMethod.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="form-group mb-3">
        <label htmlFor="card-element">Credit or debit card</label>
        <div id="card-element" className="form-control">
          <CardElement />
        </div>
      </div>
      <Button type="submit" disabled={!stripe}>
        Pay with Card
      </Button>
    </form>
  );
};

export default StripePaymentForm;
