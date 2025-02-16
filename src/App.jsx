import { useState, useEffect } from 'react';
import './style.css';
import { StepOne } from './components/StepOne.jsx';
import { StepTwo } from './components/StepTwo.jsx';
import { StepThree } from './components/StepThree.jsx';
import { Total } from './components/Total.jsx';

export default function App() {
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

  if (loading) return (<p>Loading...</p>);

  return (
    <>
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
            <StepThree />
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
          {step < 4 && <button className="next" onClick={handleNext}>Next</button>}
        </div>
      </div>
    </>
  );
}