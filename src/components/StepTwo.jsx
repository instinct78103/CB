import '../styles/stepTwo.css';

export function StepTwo({ formData, setFormData, deliveryOptions, selectedDeliveryOption, toggleDelivery }) {
  return (
    <>
      <div>
        <h3>STUDENT INFORMATION</h3>
        <div>
          <input
          type="text" placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        </div>
        <div>
          <input
          type="text" placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        </div>
        <div>
          <input
          type="email" placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        </div>
        <div>
          <input
          type="tel" placeholder="Phone" maxLength={10}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        </div>
      </div>
      <div>
        <h3>CERTIFICATE DELIVERY</h3>
        <select
          onChange={(e) => toggleDelivery(deliveryOptions.find(o => o.ShipMethodPriceID === +e.target.value))}
          defaultValue={selectedDeliveryOption.ShipMethodPriceID}
        >
          {deliveryOptions.map(o => <option key={o.ShipMethodPriceID} value={o.ShipMethodPriceID}>{o.Text}</option>)}
        </select>
        <p>{selectedDeliveryOption.Description}</p>
      </div>
    </>
  );
}