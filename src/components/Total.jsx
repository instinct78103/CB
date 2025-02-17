import '../styles/total.css';

export function Total(
  {
    products,
    selectedUpgrades,
    selectedDeliveryOption,
    deliveryOptions,
    totalPrice,
    step,
  }) {
  return (
    <div className={'column-total'}>
      <h3>YOUR SELECTION</h3>
      <div className="total-wrap">

        {products?.length > 0 && (
          <ul className={'selection'}>
            <li className={'list-heading'}>Course</li>
            {products.map((item) => <li key={item.ProductID}><span>{item.Name}</span><span>${item.Price}</span>
            </li>)}
          </ul>
        )}

        {selectedUpgrades?.length > 0 && (
          <ul className={'selection'}>
            <li className={'list-heading'}>Upgrades:</li>
            {selectedUpgrades.map((item) => (
              <li key={item.Name}><span>{item.Name}</span><span>${item.PriceCart}</span></li>
            ))}
          </ul>
        )}

        {selectedDeliveryOption && deliveryOptions?.length > 0 && (
          <ul className={'selection'}>
            <li className="list-heading">Certification Delivery:</li>
            <li>
              <span>{selectedDeliveryOption.Text}</span><span>{selectedDeliveryOption.AdjustedPrice ? `$${selectedDeliveryOption.AdjustedPrice}` : 'FREE'}</span>
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
          <p className={'selection total'}>
            <span>TOTAL</span><span>${totalPrice.toFixed(2)}</span>
          </p>
        )}

      </div>
    </div>
  );
}