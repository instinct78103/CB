import '../styles/total.css';

export function Total(
  {
    products,
    selectedUpgrades,
    selectedDeliveryOptions,
    selectedMainCourseDelivery,
    totalPrice,
    step,
  }) {
  return (
    <div className="column-total grid-area--selected" style={{ overflow: step === 3 ? 'hidden' : '' }}>
      <div className="wrap" style={{ overflow: step === 3 ? 'hidden' : '' }}>
        <div className="title">YOUR SELECTION</div>
        <div className="total-wrap">

          {products?.length > 0 && (
            <ul className="selection">
              <li className="list-heading">Course</li>
              {products.map((item) => (
                <li key={item.ProductID}>
                  <span>{item.Name}</span>
                  <span>${item.Price}</span>
                </li>
              ))}
            </ul>
          )}

          {selectedUpgrades?.length > 0 && (
            <ul className="selection">
              <li className="list-heading">Upgrades:</li>
              {selectedUpgrades.map((upgrade) => (
                <li key={upgrade.ProductID}>
                  <span>{upgrade.Name}</span>
                  <span>${upgrade.PriceCart}</span>
                </li>
              ))}
            </ul>
          )}

          {selectedUpgrades
            .filter((upgrade) => selectedDeliveryOptions[upgrade.ProductID]) // Only show if it has delivery
            .map((upgrade) => {
              const delivery = selectedDeliveryOptions[upgrade.ProductID];
              return (
                <ul className="selection" key={`delivery-${upgrade.ProductID}`}>
                  <li className="list-heading">Delivery of {upgrade.Name}:</li>
                  <li>
                    <span>{delivery.Text}</span>
                    <span>{delivery.AdjustedPrice ? `$${delivery.AdjustedPrice}` : 'FREE'}</span>
                  </li>
                </ul>
              );
            })}

          {selectedMainCourseDelivery && (
            <ul className={'selection'}>
              <li className="list-heading">Shipping Options:</li>
              <li>
                <span>{selectedMainCourseDelivery.Text}</span>
                <span>{selectedMainCourseDelivery.AdjustedPrice ? `$${selectedMainCourseDelivery.AdjustedPrice}` : 'FREE'}</span>
              </li>
            </ul>
          )}

          {step === 3 && (
            <div className="selection discount-code">
              <input type="text" name="discount_code" placeholder="Discount code" />
              <button>Apply</button>
            </div>
          )}

          {totalPrice > 0 && (
            <p className="selection total">
              <span>TOTAL</span>
              <span>${totalPrice.toFixed(2)}</span>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}