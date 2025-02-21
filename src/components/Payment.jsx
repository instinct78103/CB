import '../styles/payment.scss';
import { useEffect } from 'react';

export default function Payment(
  {
    formData: { firstName, lastName, email },
    isPaymentScriptLoaded,
    setFormData,
    apiUrl,
    websiteId,
    totalPrice,
    handleNext,
    isPayLaterChecked,
    setIsPayLaterChecked,
    paymentGateway,
    products,
    setStep,
  }) {

  useEffect(() => {
    if (isPaymentScriptLoaded) {
      async function runPaymentScript() {
        if (paymentGateway === 'intuit') {
          const { initIntuit } = await import('../utils/paymentGateway.js');
          initIntuit(firstName, lastName, email, setFormData, apiUrl, websiteId, totalPrice, setStep);
        } else if (paymentGateway === 'braintree') {
          const { initBraintree } = await import('../utils/paymentGateway.js');
          await initBraintree(apiUrl, websiteId, totalPrice, setFormData, handleNext, products, setStep);
        }
      }

      runPaymentScript();

    }
  }, [isPaymentScriptLoaded]);

  const checkHandler = () => {
    setIsPayLaterChecked(!isPayLaterChecked);
  };

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
        <label className="paylater--label">
          <input type="checkbox" id="pay-later" name="paylater" onChange={checkHandler} />
          <span>I’d like to pay later</span>
        </label>
      </div>
      <div className="grid-area--details">
        <label className="total-text">
          TOTAL <span className="total_price">${totalPrice}</span>
          <span className="is-closed" style={{ textDecoration: 'underline' }}>(View your selection)</span>
          <span className="is-open" style={{ textDecoration: 'underline' }}>(Hide your selection)</span>
          <input type="checkbox" className="expand" />
        </label>
      </div>
      <div className="grid-area--gateway">
        <div id="dropin-container"></div>
        <div className="later-description">
          <p>We offer a 30-day free-trial for those who need to enroll in traffic school, but aren't ready to pay. You will not be able to take the final exam until after payment is received. If you do not pay within 30 days, your account will be disabled until you make your payment in full. You have the option to pay online or over the phone. Our traffic ticket specialists can assist you with any questions you may have.</p>
        </div>
      </div>
    </>
  );
}