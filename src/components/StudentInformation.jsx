import '../styles/studentInformation.css';

export function StudentInformation(
  {
    formData,
    setFormData,
    mainCourseDeliveryOptions,
    selectedMainCourseDelivery,
    setSelectedMainCourseDelivery,
  }) {
  return (
    <>
      <div className="student-info grid-area--student-info">
        <div className="title">STUDENT INFORMATION</div>
        <div className="wrap">
          <div>
            <input
              type="text" placeholder="First Name" name="firstname" maxLength={64}
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div>
            <input
              type="text" placeholder="Last Name" name="lastname" maxLength={64}
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <div>
            <input
              type="email" placeholder="Email" name="email" maxLength={64}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <input
              type="tel" placeholder="Phone" name="phone" maxLength={10}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>
      </div>

      {mainCourseDeliveryOptions.length > 0 && (
        <div className="delivery grid-area--delivery">
          <div className="title">CERTIFICATE DELIVERY</div>
          <select
            onChange={(e) => setSelectedMainCourseDelivery(
              mainCourseDeliveryOptions.find(o => o.ShipMethodPriceID === +e.target.value),
            )}
            value={selectedMainCourseDelivery?.ShipMethodPriceID || ''}
          >
            {mainCourseDeliveryOptions.map(o => (
              <option key={o.ShipMethodPriceID} value={o.ShipMethodPriceID}>
                {o.Text} - {o.AdjustedPrice ? `$${o.AdjustedPrice}` : 'FREE'}
              </option>
            ))}
          </select>
          <p>{selectedMainCourseDelivery?.Description}</p>
        </div>
      )}
    </>
  );
}