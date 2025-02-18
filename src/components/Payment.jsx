import '../styles/payment.css';
import { useEffect } from 'react';

export function Payment(
  {
    formData: { firstName, lastName, email },
    isPaymentScriptLoaded,
    setFormData,
    apiUrl,
    websiteId,
    totalPrice,
    handleNext,
  }) {

  useEffect(() => {
    if (isPaymentScriptLoaded) {
      async function runPaymentScript() {
        if (isPaymentScriptLoaded) {
          const { initIntuit } = await import('../utils/intuitPayment.js');
          initIntuit(firstName, lastName, email, setFormData, apiUrl, websiteId, totalPrice, handleNext);
        }
      }

      runPaymentScript();
    }
  }, [isPaymentScriptLoaded]);

  return (
    <>
      <div className="title grid-area--title">Payment</div>
      <div className="payment-option--heading grid-area--heading">
        <p className="payment-option--title">How would you like to pay?</p>
        <p className="payment-option--subtitle">Choose your payment method from the options below.</p>
      </div>
      <div className="grid-area--pay_later">
        <div className="or">
          <div className="line line--left"></div>
          <p>or</p>
          <div className="line line--right"></div>
        </div>
        <label className="paylater--label"><input type="checkbox" id="pay-later" name="paylater" /><span>I’d like to pay later</span></label>
      </div>
      <div className="grid-area--details">
        <label className="total-text">
          TOTAL <span className="total_price">${totalPrice}</span>
          <span className="is-closed" style={{textDecoration: 'underline'}}>(View your selection)</span>
          <span className="is-open" style={{textDecoration: 'underline'}}>(Hide your selection)</span>
          <input type="checkbox" className="expand" />
        </label>
      </div>
      <div id="dropin-container" className="grid-area--gateway"></div>
    </>
  );
}