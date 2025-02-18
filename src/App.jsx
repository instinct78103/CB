import './style.css';
import { useState, useEffect } from 'react';
import { CourseSelection } from './components/CourseSelection.jsx';
import { StudentInformation } from './components/StudentInformation.jsx';
import { Payment } from './components/Payment.jsx';
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

  const [mainCoursePrice, setMainCoursePrice] = useState(0);
  const [mainCourseDeliveryOptions, setMainCourseDeliveryOptions] = useState([])
  const [selectedMainCourseDelivery, setSelectedMainCourseDelivery] = useState(null);
  const [desc, setDesc] = useState('');

  const [upgrades, setUpgrades] = useState([]);
  const [selectedUpgrades, setSelectedUpgrades] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState([]);

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
        setMainCoursePrice(json.Packages[0].Price);
        setMainCourseDeliveryOptions(json.Packages[0].Upgrades[0].ShipOptions)

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

  useEffect(() => {
    if (mainCourseDeliveryOptions?.length) {
      const cheapestOption = mainCourseDeliveryOptions.reduce((min, option) =>
        option.AdjustedPrice < min.AdjustedPrice ? option : min
      );
      setSelectedMainCourseDelivery(cheapestOption);
    }
  }, [mainCourseDeliveryOptions]);

  const toggleUpgrades = (item) => {

    setSelectedUpgrades((prev) => {
      const alreadySelected = prev.some((i) => i.ProductID === item.ProductID);

      let updatedSelection;
      let updatedDeliveryOptions = { ...deliveryOptions };
      let updatedSelectedDeliveryOptions = { ...selectedDeliveryOptions };

      if (alreadySelected) {
        // Remove upgrade
        updatedSelection = prev.filter((i) => i.ProductID !== item.ProductID);
        delete updatedDeliveryOptions[item.ProductID];
        delete updatedSelectedDeliveryOptions[item.ProductID];
      } else {
        // Add upgrade
        updatedSelection = [...prev, item];

        if (item.ShipOptions?.length > 0) {
          // Store delivery options for this upgrade
          updatedDeliveryOptions[item.ProductID] = item.ShipOptions;

          // Auto-select the cheapest option
          updatedSelectedDeliveryOptions[item.ProductID] = item.ShipOptions.reduce((min, option) =>
            option.Price < min.Price ? option : min,
          );
        }
      }

      setDeliveryOptions(updatedDeliveryOptions);
      setSelectedDeliveryOptions(updatedSelectedDeliveryOptions);

      return updatedSelection;
    });

  };

  const totalPrice = mainCoursePrice +
    selectedUpgrades.reduce((sum, upgrade) => sum + upgrade.PriceCart + (selectedDeliveryOptions[upgrade.ProductID]?.AdjustedPrice || 0), 0) +
    (selectedMainCourseDelivery?.AdjustedPrice || 0);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!formData.firstName || !formData.lastName || !/\S+@\S+\.\S+/.test(formData.email) || !/^\d{10}$/.test(formData.phone)) {
        alert('Please fill all fields correctly.');
        return;
      }
      setStep(3);
    } else {
      console.log({ step });
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
            <CourseSelection
              products={products}
              upgrades={upgrades}
              desc={desc}
              selectedUpgrades={selectedUpgrades}
              deliveryOptions={deliveryOptions}
              toggleUpgrades={toggleUpgrades}
              selectedDeliveryOptions={selectedDeliveryOptions}
              setSelectedDeliveryOptions={setSelectedDeliveryOptions}
            />
          )}

          {step === 2 && (
            <StudentInformation
              formData={formData}
              setFormData={setFormData}
              mainCourseDeliveryOptions={mainCourseDeliveryOptions}
              selectedMainCourseDelivery={selectedMainCourseDelivery}
              setSelectedMainCourseDelivery={setSelectedMainCourseDelivery}
            />
          )}

          {step === 3 && (
            <Payment
              formData={formData}
              isPaymentScriptLoaded={isPaymentScriptLoaded}
              setFormData={setFormData}
              apiUrl={apiUrl}
              websiteId={websiteId}
              totalPrice={totalPrice}
              handleNext={handleNext}
            />
          )}

        </div>

        <Total
          products={products}
          selectedUpgrades={selectedUpgrades}
          selectedDeliveryOptions={selectedDeliveryOptions}
          selectedMainCourseDelivery={selectedMainCourseDelivery}
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