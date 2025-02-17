import { useEffect } from 'react';

export function StepThree({ formData: {firstName, lastName, email}, isPaymentScriptLoaded, setFormData, apiUrl, websiteId, totalPrice }) {

  useEffect(() => {
    if (isPaymentScriptLoaded) {
      async function runPaymentScript() {
        if (isPaymentScriptLoaded) {
          const { initIntuit } = await import('../utils.js');
          initIntuit(firstName, lastName, email, setFormData, apiUrl, websiteId, totalPrice);
        }
      }

      runPaymentScript();
    }
  }, [isPaymentScriptLoaded]);

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