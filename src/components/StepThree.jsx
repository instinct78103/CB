import '../styles/stepThree.css';
import { useEffect } from 'react';

export function StepThree({ formData }) {

  useEffect(() => {
    const paymentScript = document.createElement('script');
    paymentScript.src = 'https://sdk.embedded-payments.a.intuit.com/embedded-payment-ui-sdk.en.js';
    paymentScript.async = true;
    document.head.appendChild(paymentScript);
    paymentScript.onload = async () => {
      const { initIntuit } = await import('../helpers.js');
      initIntuit(formData.firstName, formData.lastName, formData.email);
    };

    return () => document.head.removeChild(paymentScript);
  }, []);

  return (
    <div>
      <h3>Payment</h3>
      <div>
        <div>
          <p>How would you like to pay?</p>
          <p>Choose your payment method from the options below.</p>
        </div>
        <div id="dropin-container"></div>
      </div>
    </div>
  );
}