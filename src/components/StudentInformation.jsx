import '../styles/studentInformation.scss';

export default function StudentInformation(
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
              type="text" placeholder="First Name" name="firstname" maxLength={30}
              value={formData.FirstName}
              onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
            />
          </div>
          <div>
            <input
              type="text" placeholder="Last Name" name="lastname" maxLength={30}
              value={formData.LastName}
              onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
            />
          </div>
          <div>
            <input
              type="email" placeholder="Email" name="email" maxLength={30}
              value={formData.Email}
              onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
            />
          </div>
          <div>
            <input
              type="tel" placeholder="Phone" name="phone" maxLength={10}
              value={formData.Phone}
              onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
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