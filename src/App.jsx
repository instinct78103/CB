import './style.scss';
import React, { useState, useEffect } from 'react';

import Loader from './components/Loader.jsx';
const CourseSelection = React.lazy(() => import( './components/CourseSelection.jsx'));
const StudentInformation = React.lazy(() => import( './components/StudentInformation.jsx'));
const Payment = React.lazy(() => import( './components/Payment.jsx'));
const Total = React.lazy(() => import( './components/Total.jsx'));
const Registration = React.lazy(() => import( './components/Registration.jsx'));
const SelectCountyAndCourt = React.lazy(() => import( './components/SelectCountyAndCourt.jsx'));

export default function App() {
  const apiUrl = document.querySelector('#root')?.getAttribute('data-apiUrl');
  const websiteId = document.querySelector('#root')?.getAttribute('data-websiteId');
  const paymentGateway = document.querySelector('#root')?.getAttribute('data-paymentGateway');
  const isCountyEnabled = document.querySelector('#root')?.getAttribute('data-countyEnabled') === 'yes';
  const edgeURL = document.querySelector('#root')?.getAttribute('data-edgeURL');

  if (!websiteId || !apiUrl || !paymentGateway) {
    return;
  }

  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);

  const [counties, setCounties] = useState([]);
  const [countyId, setCountyId] = useState('');
  const [courts, setCourts] = useState([]);
  const [courtId, setCourtId] = useState('');

  const [mainCourseId, setMainCourseId] = useState(null);
  const [mainCourseName, setMainCourseName] = useState('');
  const [mainCoursePrice, setMainCoursePrice] = useState(0);
  const [mainCourseDeliveryOptions, setMainCourseDeliveryOptions] = useState([]);
  const [selectedMainCourseDelivery, setSelectedMainCourseDelivery] = useState(null);
  const [mainCourseDesc, setMainCourseDesc] = useState('');

  const [upgrades, setUpgrades] = useState([]);
  const [selectedUpgrades, setSelectedUpgrades] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState([]);

  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationResponse, setRegistrationResponse] = useState(null);

  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    Password: '',
    ShipMethods: [],
    UpgradeProductIDs: [],
    PartnerPortalID: '',
    ProductID: '',
  });
  const [isPaymentScriptLoaded, setIsPaymentScriptLoaded] = useState(false);
  const [isPayLaterChecked, setIsPayLaterChecked] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [edgeTag, setEdgeTag] = useState(null);

  /**
   * Get region by search params
   */
  useEffect(() => {
    const currentState = new URL(window.location).searchParams.get('st')?.toLowerCase();
    if (!currentState) return;

    const fetchRegionBySearchParam = async () => {
      try {
        const json = await (await fetch(`${apiUrl}/api/region/states`)).json();
        const region = json.find(
          ({
             RegionCode,
             RegionName,
           }) => RegionCode.toLowerCase() === currentState || RegionName.toLowerCase() === currentState,
        );
        setRegion(region);
        setFormData(prevState => ({...prevState, RegionID: region.RegionID}))
      } catch (e) {
        console.warn('Can\'t find region for state: ' + currentState);
      }
    };

    fetchRegionBySearchParam();

  }, []);

  /**
   * Get state products
   */
  useEffect(() => {
    if (!region || isCountyEnabled) return;

    const fetchStateProducts = async () => {
      try {
        const json = await (await fetch(`${apiUrl}/api/package?websiteid=${websiteId}&regionid=${region.RegionID}`)).json();
        setProducts(json.Packages);

        setFormData(prevState => ({
          ...prevState,
          PartnerPortalID: json.Packages[0].PartnerPortalID !== 0 ? json.Packages[0].PartnerPortalID : null,
          ProductID: json.Packages[0].ProductID,
          ProductPackageID: json.Packages[0].ProductPackageID,
        }));

        setUpgrades(json.Packages[0].Upgrades.filter((item, key) => key > 0));

        setMainCoursePrice(json.Packages[0].Price);
        setMainCourseId(json.Packages[0].Upgrades[0].ProductID);
        setMainCourseName(json.Packages[0].Name);
        setMainCourseDeliveryOptions(json.Packages[0].Upgrades[0].ShipOptions);

        const parser = new DOMParser();
        const doc = parser.parseFromString(json.Packages[0].Description, 'text/html');
        setMainCourseDesc(doc.body.textContent.trim() || '');
        setLoading(false);
      } catch (e) {
        console.warn('Can\'t fetch products: ' + e);
      } finally {
        setLoading(false);
      }
    };

    fetchStateProducts();
  }, [region]);

  /**
   * Get counties
   */
  useEffect(() => {
    if (isCountyEnabled && region) {
      async function fetchCounties() {
        try {
          const json = await (await fetch(`${apiUrl}/api/region/counties/${websiteId}/${region.RegionID}`)).json();
          setCounties(json);
        } catch (e) {
          console.warn('Error: ' + e);
        } finally {
          setLoading(false);
        }
      }

      fetchCounties();
    }
  }, [region]);

  /**
   * Get courts by county
   */
  useEffect(() => {
    if (countyId) {
      async function fetchCourtsByCounty() {
        const courts = await (await fetch(`${apiUrl}/api/region/courts/${websiteId}/${countyId}`)).json();
        setCourts(courts);
        if (courts?.length === 1) {
          setCourtId(courts[0].RegionID);
        }
      }

      fetchCourtsByCounty();
    }

  }, [countyId]);

  /**
   * todo: remove duplicate code (see `fetchStateProducts`)
   */
  useEffect(() => {
    if (courtId) {
      async function fetchProductsByCourt() {
        try {
          const json = await (await fetch(`${apiUrl}/api/package?websiteid=${websiteId}&regionid=${courtId}`)).json();
          setProducts([json.Packages[0]]);

          setFormData(prevState => ({
            ...prevState,
            PartnerPortalID: json.Packages[0].PartnerPortalID !== 0 ? json.Packages[0].PartnerPortalID : null,
            ProductID: json.Packages[0].ProductID,
            ProductPackageID: json.Packages[0].ProductPackageID,
          }));

          setUpgrades(json.Packages[0].Upgrades.filter((item, key) => key > 0));

          setMainCoursePrice(json.Packages[0].Price);
          setMainCourseId(json.Packages[0].Upgrades[0].ProductID);
          setMainCourseName(json.Packages[0].Name);
          setMainCourseDeliveryOptions(json.Packages[0].Upgrades[0].ShipOptions);

          const parser = new DOMParser();
          const doc = parser.parseFromString(json.Packages[0].Description, 'text/html');
          setMainCourseDesc(doc.body.textContent.trim() || '');
          setLoading(false);
        } catch (e) {
          console.warn('Can\'t fetch courts products: ' + e);
        } finally {
          setLoading(false);
        }
      }

      fetchProductsByCourt();
    }

  }, [courtId]);

  /**
   * Set min delivery option automatically
   */
  useEffect(() => {
    if (mainCourseDeliveryOptions?.length) {
      const cheapestOption = mainCourseDeliveryOptions.reduce((min, option) =>
        option.AdjustedPrice < min.AdjustedPrice ? option : min,
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

  const totalPrice = (
    mainCoursePrice
    + selectedUpgrades.reduce((sum, upgrade) => sum + upgrade.PriceCart + (selectedDeliveryOptions[upgrade.ProductID]?.AdjustedPrice || 0), 0)
    + (selectedMainCourseDelivery?.AdjustedPrice || 0)
    + (discount || 0)
  ).toFixed(2);

  const handleNext = () => {
    if (step === 1) {
      if (!products.length) {
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!/^[A-Za-z]{2,30}$/.test(formData.FirstName) || !/^[A-Za-z]{2,30}$/.test(formData.LastName) || !/\S+@\S+\.\S+/.test(formData.Email) || !/^\d{10}$/.test(formData.Phone)) {
        alert('Please fill all fields correctly.');
        return;
      }
      setStep(3);
    }
  };

  useEffect(() => {
    if (step === 3) {
      const paymentScript = document.createElement('script');

      switch (paymentGateway) {
        case 'intuit':
          paymentScript.src = 'https://sdk.embedded-payments.a.intuit.com/embedded-payment-ui-sdk.en.js';
          break;
        case 'braintree':
        default:
          paymentScript.src = 'https://js.braintreegateway.com/web/dropin/1.22.1/js/dropin.min.js';
          break;
      }

      document.head.appendChild(paymentScript);
      paymentScript.onload = () => setIsPaymentScriptLoaded(true);

      return () => document.head.removeChild(paymentScript);
    }
  }, [step]);

  /**
   * edgeTag
   */
  useEffect(() => {
    if (step < 2) return;

    async function getSdkAndTag() {
      if (!edgeTag) {
        const { init, tag } = await import('@blotoutio/edgetag-sdk-js');
        init({
          edgeURL,
          disableConsentCheck: true,
        });
        setEdgeTag(() => tag);
        return tag;
      }
      return edgeTag;
    }

    getSdkAndTag().then((tag) => {
      if (!tag) return;

      switch (step) {
        case 2:
          tag('Registration_Selection', {
            product: mainCourseName,
            upgrades: selectedUpgrades.map(({ Name: name }) => name).join(', '),
            totalPrice,
          });
          break;
        case 3:
          tag('data', {
            firstName: formData.FirstName,
            lastName: formData.LastName,
            email: formData.Email,
            phone: formData.Phone,
          });
          tag('Registration_Student_Info', { totalPrice });
          break;
        case 4:
          tag('Registration_Payment', { totalPrice });
          if (isPayLaterChecked) {
            tag('Registration_Payment', { totalPrice }, null, { method: 'beacon' });
          }
          break;
        case 5:
          tag('Registration_Complete', { totalPrice });
          break;
        case 6:
          tag('Registration_Receipt', { totalPrice });
          /**
           * todo: figure out the click event below
           */
          // $('a[title="START COURSE"]').on('click', () => {
          //   total_price = parseFloat($('.totals').find('.price').text().trim().slice(1));
          //   edgetag('tag', 'Registration_Start_Course', { total_price }, {}, { method: 'beacon' });
          // });
          break;
      }
    });
  }, [step, isPayLaterChecked]);
  /**
   * edgeTag -- end
   */

  /**
   * Update formData
   */
  useEffect(() => {
    if (mainCourseId) {
      setFormData(prevState => ({
        ...prevState,
        ShipMethods: [
          { ProductID: mainCourseId, ShipMethodPriceId: selectedMainCourseDelivery?.ShipMethodPriceID },
          ...Object.entries(selectedDeliveryOptions)
            .map(([key, value]) => ({ ProductID: key, ShipMethodPriceID: value?.ShipMethodPriceID })),
        ],
        UpgradeProductIDs: [mainCourseId, ...selectedUpgrades.map(({ ProductID }) => ProductID)],
      }))
    }
  }, [selectedMainCourseDelivery, selectedUpgrades, selectedDeliveryOptions]);

  if (loading) {
    return (
      <div style={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        {<Loader />}
      </div>
    );
  }

  return (
    <div id="main">

      <div className={`grid ${step === 1 ? 'course-selection' : ''}${step === 2 ? 'student-information' : ''}${step === 3 ? 'payment' : ''}${step === 4 ? 'registration' : ''}`}>

        {step === 1 && isCountyEnabled && counties.length > 0 && (
          <SelectCountyAndCourt
            region={region}
            counties={counties}
            countyId={countyId}
            setCountyId={setCountyId}
            courts={courts}
            setCourtId={setCourtId}
            setProducts={setProducts}
            setCourts={setCourts}
            courtId={courtId}
            setSelectedUpgrades={setSelectedUpgrades}
          />
        )}

        {step === 1 && products.length > 0 && (
          <CourseSelection
            products={products}
            upgrades={upgrades}
            mainCourseDesc={mainCourseDesc}
            selectedUpgrades={selectedUpgrades}
            deliveryOptions={deliveryOptions}
            toggleUpgrades={toggleUpgrades}
            selectedDeliveryOptions={selectedDeliveryOptions}
            setSelectedDeliveryOptions={setSelectedDeliveryOptions}
            isCountyEnabled={isCountyEnabled}
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
            isPayLaterChecked={isPayLaterChecked}
            setIsPayLaterChecked={setIsPayLaterChecked}
            paymentGateway={paymentGateway}
            products={products}
            setStep={setStep}
          />
        )}

        {products.length > 0 && step < 5 && (
          <Total
            products={products}
            selectedUpgrades={selectedUpgrades}
            selectedDeliveryOptions={selectedDeliveryOptions}
            selectedMainCourseDelivery={selectedMainCourseDelivery}
            totalPrice={totalPrice}
            step={step}
            packageId={formData.ProductID}
            regionId={region.RegionID}
            apiUrl={apiUrl}
            discount={discount}
            setDiscount={setDiscount}
          />
        )}

        {step === 4 && (
          <Registration
            formData={formData}
            setFormData={setFormData}
            apiUrl={apiUrl}
            productPackageId={formData.ProductPackageID}
            selectedUpgrades={selectedUpgrades}
            setRegistrationLoading={setRegistrationLoading}
            setRegistrationSuccess={setRegistrationSuccess}
            setRegistrationResponse={setRegistrationResponse}
            setStep={setStep}
          />
        )}

        {
          step === 5 && registrationSuccess && (
            <>
              <p>Success</p>
              <p>{JSON.stringify(registrationResponse)}</p>
            </>
          )
        }

        {
          step === 5 && !registrationSuccess && (
            'Error'
          )
        }

      </div>

      <div>
        {step < 3 && <button className="next" onClick={handleNext}>Next</button>}
        {step === 3 && <button className="next">Complete Payment</button>}
        {isPayLaterChecked && step === 3 &&
          <button className="paylater_next" onClick={() => setStep(4)}>Complete Registration</button>}
        {step === 4 && (
          <button className="next" form="user-registration" disabled={registrationLoading}>
            {registrationLoading ? <Loader color={'#fff'} size={20}/> : 'Complete Registration'}
          </button>
        )}
      </div>

    </div>
  );
}