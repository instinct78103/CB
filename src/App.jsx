import { useState, useEffect } from 'react';
import './style.css';

export default function App() {

  const [loading, setLoading] = useState(true);
  const [regionId, setRegionId] = useState(null);
  const [products, setProducts] = useState([]);
  const [desc, setDesc] = useState('');
  const [upgrades, setUpgrades] = useState([]);
  const [selectedUpgrades, setSelectedUpgrades] = useState([]);
  const [minSum, setMinSum] = useState(0);
  const [deliveryOptions, setDeliveryOptions] = useState([]);

  useEffect(() => {
    const currentState = new URL(window.location).searchParams.get('st');
    if (!currentState) return;

    const fetchRegionId = async () => {
      try {
        const json = await (await fetch('https://api.ci.gttsdev5.com/api/region/states')).json();
        const region = json.find(item => item.RegionCode === currentState).RegionID;
        setRegionId(region);
      } catch (e) {
        console.warn('Error');
      } finally {
        setLoading(false);
      }
    };

    fetchRegionId();

  }, []);

  useEffect(() => {
    if (!regionId) return;
    const fetchProducts = async () => {
      try {
        const json = await (await fetch(`https://api.ci.gttsdev5.com/api/package?websiteid=101&regionid=${regionId}`)).json();
        console.log(json.Packages);
        setProducts(json.Packages);
        setUpgrades(json.Packages[0].Upgrades.filter((item, key) => key > 0));
        setMinSum(json.Packages[0].Price);

        const parser = new DOMParser();
        const doc = parser.parseFromString(json.Packages[0].Description, 'text/html');
        setDesc(doc.body.textContent.trim() || '');

      } catch (e) {
        console.warn('Error 2');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, [regionId]);

  const toggleUpgrades = (item) => {
    setSelectedUpgrades((prev) =>
      prev.some((i) => i.ProductID === item.ProductID)
        ? prev.filter((i) => i.ProductID !== item.ProductID)
        : [...prev, item],
    );
  };

  useEffect(() => {
    setDeliveryOptions(selectedUpgrades.filter(s => s.ShipOptions));
  }, [selectedUpgrades]);

  const totalPrice = selectedUpgrades.reduce((sum, item) => sum + item.PriceCart, minSum);

  if (loading) return (<p>Loading...</p>);

  return (
    <div className={'grid'}>
      <div className={'column-showcase'}>

        {products?.length > 0 && (
          <div>
            <h3>Courses Selection</h3>
            <ul>
              <li>
                {products.map((product) => (
                  <label key={product.ProductID}>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
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
            <ul className={'upgrades'} style={{borderTop: '1px solid #c3c3c3'}}>
              {upgrades.map(item => (
                <li key={item.ProductID}>

                  <label>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-start' }}>
                      <input style={{ display: 'none' }}
                             type="checkbox"
                             onChange={() => toggleUpgrades(item)}
                             checked={selectedUpgrades.some((i) => i.ProductID === item.ProductID)}
                      />
                      <p className={'product-name'}>{item.Name}</p>
                      <p className={'product-price'} style={{ marginLeft: 'auto' }}>${item.PriceCart}</p>
                    </div>
                  </label>
                  <p className={'product-desc'}>{item.Description}</p>

                </li>
              ))}
            </ul>
          </div>
        )}

        {deliveryOptions?.length > 0 && <>{deliveryOptions.length}</>}
      </div>
      <div className={'column-total'}>
        <h3>YOUR SELECTION</h3>

        {products?.length > 0 && (
          <>
            <ul className={'selection'}>
              <li className={'list-heading'}>Course</li>
              {products.map((item) => (
                <li key={item.ProductID}><span>{item.Name}</span><span>${item.Price}</span></li>
              ))}
            </ul>
          </>
        )}

        {selectedUpgrades?.length > 0 && (
          <>
            <ul className={'selection'}>
              <li className={'list-heading'}>Upgrades</li>
              {selectedUpgrades.map((item) => (
                <li key={item.Name}><span>{item.Name}</span><span>${item.PriceCart}</span></li>
              ))}
            </ul>
          </>
        )}

        <p className={'selection total'}>{totalPrice > 0 && <>
          <span>TOTAL</span><span>${totalPrice.toFixed(2)}</span></>}</p>
      </div>
    </div>
  );
}