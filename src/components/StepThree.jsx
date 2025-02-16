import { useEffect } from 'react';

export function StepThree () {

  useEffect(() => {
    const paymentScript = document.createElement('script');
    paymentScript.src = 'https://sdk.embedded-payments.a.intuit.com/embedded-payment-ui-sdk.en.js';
    paymentScript.onload = () => {
      console.log('PaymentScript loaded successfully');
    };

    document.head.appendChild(paymentScript);

    return () => {
      document.head.removeChild(paymentScript);
    };
  }, [])

  return (
    <div>
      <h3>Payment</h3>
      <div></div>
    </div>
  )
}