import '../styles/total.scss';
import { useState } from 'react';
import Loader from './Loader.jsx';

export default function Total(
  {
    products,
    selectedUpgrades,
    selectedDeliveryOptions,
    selectedMainCourseDelivery,
    totalPrice,
    step,
    mainCourseId,
    regionId,
    apiUrl,
    discount,
    setDiscount,
  }) {

  const [coupon, setCoupon] = useState('');
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  async function fetchDiscount(coupon) {

    if (!coupon) {
      return;
    }

    const url = new URL(`${apiUrl}/api/customer/verifyOfferCode`);
    url.searchParams.set('OfferCode', coupon);
    url.searchParams.set('ProductID', mainCourseId);
    url.searchParams.set('RegionID', regionId);

    setIsCouponLoading(true);

    try {
      const json = await (await fetch(url.toString())).json();
      setDiscount(json?.Discount || 0);
    } catch (e) {
      console.warn('Error: failed to fetch discount');
      setIsCouponLoading(false);
    } finally {
      setIsCouponLoading(false);
    }
  }

  return (
    <div className="column-total grid-area--selected" style={{'--content-size': `${step === 4 ? '1fr' : ''}`, position: `${step === 4 ? 'static' : 'sticky'}`}}>

      {step < 3 && <div className="total-label">
        <label className="total-text">
          TOTAL <span className="total_price">${totalPrice}</span>
          <input type="checkbox" className="expand" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 8.7L5.3 15.4c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l7-7c.4-.4 1-.4 1.4 0l7 7c.4.4.4 1 0 1.4s-1 .4-1.4 0L12 8.7z"></path>
          </svg>
        </label>
      </div>}

      <div className="wrap">
        <div className="title">{step === 4 ? 'Order Summary' : 'Your Selection'}</div>
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

          {discount < 0 &&
            <div className="selection">
              <span><strong>Discount:</strong></span>
              <span>-${-1 * discount}</span>
            </div>
          }

          {step === 3 && (
            <form className="selection discount-code" onSubmit={(e) => {
              e.preventDefault();
              fetchDiscount(coupon);
            }}>
              <input type="text" name="discount_code" placeholder="Discount code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <button className="apply-coupon" disabled={isCouponLoading}>
                {isCouponLoading ? <Loader color={'#fff'} /> : 'Apply'}
              </button>
            </form>
          )}

          {totalPrice > 0 && (
            <p className="selection total">
              <span><strong>TOTAL</strong></span>
              <span>${totalPrice}</span>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}