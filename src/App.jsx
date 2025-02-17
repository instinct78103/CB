import './style.css';
import { useState, useEffect } from 'react';
import { StepOne } from './components/StepOne.jsx';
import { StepTwo } from './components/StepTwo.jsx';
import { StepThree } from './components/StepThree.jsx';
import { Total } from './components/Total.jsx';

export default function App() {
  const apiUrl = document.querySelector('#root')?.getAttribute('data-apiUrl');
  const websiteId = document.querySelector('#root')?.getAttribute('data-websiteId');

  if (!websiteId || !apiUrl) {
    return;
  }

  const [loading, setLoading] = useState(true);
  const [regionId, setRegionId] = useState(null);
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [desc, setDesc] = useState('');
  const [minSum, setMinSum] = useState(0);

  const [upgrades, setUpgrades] = useState([]);
  const [selectedUpgrades, setSelectedUpgrades] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [isPaymentScriptLoaded, setIsPaymentScriptLoaded] = useState(false);

  useEffect(() => {
    const currentState = new URL(window.location).searchParams.get('st');
    if (!currentState) return;

    const fetchRegionId = async () => {
      try {
        const json = await (await fetch(`${apiUrl}/api/region/states`)).json();
        const region = json.find(item => item.RegionCode === currentState).RegionID;
        setRegionId(region);
      } catch (e) {
        console.warn('Error');
      }
    };

    fetchRegionId();

  }, []);

  useEffect(() => {
    if (!regionId) return;
    const fetchProducts = async () => {
      try {
        const json = await (await fetch(`${apiUrl}/api/package?websiteid=${websiteId}&regionid=${regionId}`)).json();
        console.log(json.Packages);
        setProducts(json.Packages);
        setUpgrades(json.Packages[0].Upgrades.filter((item, key) => key > 0));
        setMinSum(json.Packages[0].Price);

        const parser = new DOMParser();
        const doc = parser.parseFromString(json.Packages[0].Description, 'text/html');
        setDesc(doc.body.textContent.trim() || '');
        setLoading(false);
      } catch (e) {
        console.warn('Error: ' + e);
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

  const toggleDelivery = item => {
    setSelectedDeliveryOption(deliveryOptions?.length ? item : null);
  };

  useEffect(() => {
    const availableDeliveryOptions = selectedUpgrades
      .filter(s => s.ShipOptions)
      .map(e => e.ShipOptions)
      .flat(1);

    setDeliveryOptions(availableDeliveryOptions);

    if (!availableDeliveryOptions?.length) {
      setSelectedDeliveryOption(null);
    }
  }, [selectedUpgrades]);

  const totalPrice = selectedUpgrades.reduce((sum, item) => sum + item.PriceCart, minSum) + (selectedDeliveryOption?.AdjustedPrice || 0);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!formData.firstName || !formData.lastName || !/\S+@\S+\.\S+/.test(formData.email) || !/^\d{10}$/.test(formData.phone)) {
        alert('Please fill all fields correctly.');
        return;
      }
      setStep(3);
    }
  };

  useEffect(() => {
    if (step === 3) {
      const paymentScript = document.createElement('script');
      paymentScript.src = 'https://sdk.embedded-payments.a.intuit.com/embedded-payment-ui-sdk.en.js';
      document.head.appendChild(paymentScript);
      paymentScript.onload = () => setIsPaymentScriptLoaded(true);

      return () => document.head.removeChild(paymentScript);
    }
  }, [step]);

  if (loading) {
    return (
      <p style={{ display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50" aria-label="Loading...">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#014785" strokeWidth="4" strokeDasharray="31.4 31.4" strokeLinecap="round" transform="rotate(-90, 25, 25)">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </p>
    );
  }

  function onSubmit(e) {
    e.preventDefault();
    handleNext();
  }

  return (
    <form onSubmit={onSubmit} id="payment-form">
      <div className={'grid'}>
        <div className={'column-showcase'}>

          {step === 1 && (
            <StepOne
              products={products}
              upgrades={upgrades}
              desc={desc}
              selectedUpgrades={selectedUpgrades}
              deliveryOptions={deliveryOptions}
              toggleUpgrades={toggleUpgrades}
              toggleDelivery={toggleDelivery}
            />
          )}

          {step === 2 && (
            <StepTwo
              formData={formData}
              setFormData={setFormData}
              deliveryOptions={deliveryOptions}
              selectedDeliveryOption={selectedDeliveryOption}
              toggleDelivery={toggleDelivery}
            />
          )}

          {step === 3 && (
            <StepThree
              formData={formData}
              isPaymentScriptLoaded={isPaymentScriptLoaded}
              setFormData={setFormData}
              apiUrl={apiUrl}
              websiteId={websiteId}
              totalPrice={totalPrice}
            />
          )}

        </div>

        <Total
          products={products}
          selectedUpgrades={selectedUpgrades}
          selectedDeliveryOption={selectedDeliveryOption}
          deliveryOptions={deliveryOptions}
          totalPrice={totalPrice}
          step={step}
        />
      </div>
      <div className="grid">
        <div className="column-showcase"></div>
        <div className="column-total">
          {step < 4 && <button className="next">Next</button>}
        </div>
      </div>
    </form>
  );
}