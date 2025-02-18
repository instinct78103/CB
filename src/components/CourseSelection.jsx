export function CourseSelection(
  {
    products,
    upgrades,
    desc,
    selectedUpgrades,
    selectedDeliveryOptions,
    setSelectedDeliveryOptions,
    deliveryOptions,
    toggleUpgrades,
  }) {

  return (
    <>
      {products?.length > 0 && (
        <div>
          <h3>Courses Selection</h3>
          <ul className={'products-list'}>
            <li className={'item'}>
              {products.map((product) => (
                <label key={product.ProductID}>
                  <div>
                    <input style={{ display: 'none' }} type="radio" checked />
                    <p className={'product-name'}>{product.Name}</p>
                    <p className={'product-price'}>${product.Price}</p>
                  </div>
                </label>
              ))}
              <p className={'product-desc'}>{desc}</p>
            </li>
          </ul>
        </div>
      )}

      {upgrades?.length > 0 && (
        <div>
          <h3>Upgrades Selection</h3>
          <ul className={'products-list'}>
            {upgrades.map(item => (
              <li key={item.ProductID} className={'item'}>
                <label>
                  <div>
                    <input
                      style={{ display: 'none' }}
                      type="checkbox"
                      onChange={() => toggleUpgrades(item)}
                      checked={selectedUpgrades.some(i => i.ProductID === item.ProductID)}
                    />
                    <p className={'product-name'}>{item.Name}</p>
                    <p className={'product-price'}>${item.PriceCart}</p>
                  </div>
                </label>
                <p className={'product-desc'}>{item.Description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedUpgrades
        .filter((upgrade) => deliveryOptions[upgrade.ProductID])
        .map((upgrade) => (
          <div key={`delivery-${upgrade.ProductID}`}>
            <h3>Certificate delivery for {upgrade.Name}</h3>
            {deliveryOptions[upgrade.ProductID].map((option) => (
              <li key={option.ShipMethodPriceID} className="item">
                <label>
                  <div>
                    <input
                      style={{ display: 'none' }}
                      type="radio"
                      name={`delivery-${upgrade.ProductID}`}
                      checked={selectedDeliveryOptions[upgrade.ProductID]?.ShipMethodPriceID === option.ShipMethodPriceID}
                      onChange={() => setSelectedDeliveryOptions((prev) => ({
                        ...prev,
                        [upgrade.ProductID]: option,
                      }))
                      }
                    />
                    <p className="product-name">{option.Text}</p>
                    <p className="product-price">{option.AdjustedPrice ? `$${option.AdjustedPrice}` : 'FREE'}</p>
                  </div>
                </label>
                <p className="product-desc">{option.Description}</p>
              </li>
            ))}
          </div>
        ))
      }
    </>
  );
}