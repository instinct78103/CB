import { dependencySetupStates } from 'braintree-web-drop-in/constants.js';

export function initIntuit(firstname, lastname, email, setFormData, apiUrl, websiteId, totalPrice, handleNext) {
  const containerRef = document.querySelector('#dropin-container');
  const submitButtonRef = document.querySelector('.next');

  try {
    window.EmbeddedPayment.render({
      containerRef,
      submitButtonRef,
      payorEmail: email,
      companyId: '9341453766890561',
      payorName: `${firstname} ${lastname}`,
      enabledPaymentMethods: [
        'card',
        'bank',
        'payPal',
        'venmo',
        'applePay',
        'amazonPay',
      ],
      env: 'prod',
      sdkToken: '74c37e96-5ed2-4633-8973-68c44591b768',
      onApprove: ({ transactionId }) => {
        console.log(
          'Payment completed successfully. Transaction ID:',
          transactionId,
        );
      },
      onError: (error) => {
        console.error('An error occurred:', error);
        submitButtonRef.disabled = false;
      },
      onSubmitStart: ({ paymentMethod }) => {
        console.log('Submission started for payment method:', paymentMethod);
        submitButtonRef.disabled = true;
        setFormData(prevFormData => ({ ...prevFormData, paymentType: `TOKENIZED_${paymentMethod?.toUpperCase()}` }));
      },
      onSubmitEnd: ({ paymentMethod }) => {
        console.log('Submission ended for payment method:', paymentMethod);
        submitButtonRef.disabled = false;
      },
      handleSubmitPayment: ({ tokenizedPaymentMethod: nonce, paymentMethodType, riskProfileToken: RiskProfileToken, }) => {
        console.log('Submitting payment... ', nonce);

        setFormData(prevFormData => ({ ...prevFormData, RiskProfileToken, nonce }));
        handleNext()
      },
      handlePayPalCreateOrder: async () => {
        console.log('Creating PayPal order...');

        submitButtonRef.disabled = false;

        try {
          const { Id, OrderId } = await (await fetch(`${apiUrl}/api/payment/qbo/create-paypal-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:
              JSON.stringify({
                websiteId,
                payAmount: totalPrice,
              }),
          })).json();

          if (!OrderId || !Id) {
            console.warn(`Something went wrong...`);
            return;
          }

          setFormData(prevFormData => ({ ...prevFormData, nonce: Id, paymentType: 'PAYPAL' }));

          return OrderId;

        } catch (e) {
          console.warn(e);
        }
      },
      handlePayPalApproveOrder: async () => {
        console.log('Approving PayPal order...');
        handleNext();
      },
    });

    submitButtonRef.style.display = 'inline-block'; // Show the proceed button
  } catch (e) {
    submitButtonRef.disabled = false;
    console.log(e);
  } finally {
    submitButtonRef.disabled = false;
  }
}

export async function initBraintree(apiUrl, websiteId, totalPrice, setFormData, handleNext, [product], setStep) {
  const responses = [
    fetch(`${apiUrl}/api/payment/braintree/generate-token/${websiteId}`, {method: 'POST'}).then(res => res.json()),
    fetch(`${apiUrl}/api/payment/venmo/profile-id/${websiteId}`).then(res => res.json()),
  ]

  const [{ Token: authorization}, { venmoId: profileId }] = await Promise.all(responses);

  braintree.dropin.create({
    authorization,
    container: '#dropin-container',
    paypal: {
      flow: 'vault',
    },
    venmo: {
      allowNewBrowserTab: false,
      profileId
    },
    applePay: {
      displayName: 'Cyberactive Inc.',
      paymentRequest: {
        total: {
          label: product.Name,
          amount: totalPrice,
        },
        requiredBillingContactFields: ['postalAddress'],
      },
    },
    googlePay: {
      googlePayVersion: 2,
      merchantId: document.querySelector('#root').getAttribute('data-merchantId'),
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice,
        currencyCode: 'USD',
      },
    },
  }, function (createErr, instance) {
    document.querySelector('#payment-form').addEventListener('submit', function (e) {
      e.preventDefault();

      if (document.querySelector('input#pay-later').checked) {
        setStep(4)
      }

      if (totalPrice > 0) {
        instance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
          if (requestPaymentMethodErr) {
            instance.clearSelectedPaymentMethod();
          } else {
            instance.teardown(teardownErr =>
              teardownErr
                ? console.error('Could not tear down Drop-in UI!')
                : console.info('Drop-in UI has been torn down!'),
            );

            const { nonce, details } = payload;
            console.log(nonce, payload)

            setFormData(prevFormData => ({
              ...prevFormData,
              nonce,
              lastfour: details.lastfour,
            }));

            setStep(4)
          }
        });
      }
    });
  });
}