export function initIntuit(firstname, lastname, email, setFormData, apiUrl, websiteId, totalPrice) {
  const $form = document.querySelector('#payment-form')
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
        // jQuery('#payment_type').val(`TOKENIZED_${paymentMethod?.toUpperCase()}`)
      },
      onSubmitEnd: ({ paymentMethod }) => {
        console.log('Submission ended for payment method:', paymentMethod);
        submitButtonRef.disabled = false;
      },
      handleSubmitPayment: ({ tokenizedPaymentMethod: nonce, paymentMethodType, riskProfileToken: RiskProfileToken, }) => {
        console.log('Submitting payment... ', tokenizedPaymentMethod);

        setFormData(prevFormData => ({ ...prevFormData, RiskProfileToken, nonce }));
        $form.submit();

        // jQuery('#RiskProfileToken').val(riskProfileToken);
        // jQuery('#nonce').val(tokenizedPaymentMethod);
        // $form.submit();
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

          // jQuery('#nonce').val(Id);
          // jQuery('#payment_type').val('PAYPAL');
          setFormData(prevFormData => ({ ...prevFormData, nonce: Id, paymentType: 'PAYPAL' }));

          return OrderId;

        } catch (e) {
          console.warn(e);
        }

        // try {
        //   const {Id, OrderId} = await (await fetch(`${gtts_api_url}/api/payment/qbo/create-paypal-order`, {
        //     method: 'POST',
        //     headers: { "Content-Type": "application/json" },
        //     body:
        //       JSON.stringify({
        //         websiteId,
        //         payAmount: <?php echo $vars['subTotal']; ?>,
        // })
        // })).json();
        //
        //   if (!OrderId || !Id) {
        //     console.warn(`Something went wrong...`);
        //     return false;
        //   }
        //
        //   jQuery('#nonce').val(Id);
        //   jQuery('#payment_type').val('PAYPAL');
        //
        //   return OrderId;
        //
        // } catch (e) {
        //   console.warn(e)
        // }
      },
      handlePayPalApproveOrder: async () => {
        console.log('Approving PayPal order...');
        $form.submit();
      },
    });

    // isPaymentFormLoaded = true;
    submitButtonRef.style.display = 'inline-block'; // Show the proceed button
  } catch (e) {
    submitButtonRef.disabled = false;
    console.log(e);
  } finally {
    submitButtonRef.disabled = false;
  }

}