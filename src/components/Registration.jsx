import '../styles/registration.scss';
// import Turnstile from 'react-turnstile';
import { useState } from 'react';

export default function Registration(
  {
    formData,
    setFormData,
    apiUrl,
    setRegistrationLoading,
    setRegistrationSuccess,
    setRegistrationResponse,
    setStep,
  }) {

  const [repeatPassword, setRepeatPassword] = useState('');
  // const [token, setToken] = useState('');
  // const turnstileSiteKey = document.querySelector('#root')?.getAttribute('data-turnstile_sitekey');

  async function handleSubmit(e) {
    e.preventDefault();

    if ((!formData.Password || formData.Password !== repeatPassword) ||
      formData.Password.length < 4 ||
      !/^[A-Za-z]{2,30}$/.test(formData.FirstName) ||
      !/^[A-Za-z]{2,30}$/.test(formData.LastName) ||
      !/\S+@\S+\.\S+/.test(formData.Email) ||
      !/^\d{10}$/.test(formData.Phone)
    ) {
      alert('Please fill all fields correctly.');
      return;
    }

    // if (!token || !turnstileSiteKey) {
    //   alert('CAPTCHA verification failed. Please complete the CAPTCHA.');
    //   return;
    // }

    // setFormData(prevFormData => ({ ...prevFormData, turnstileToken: token }));
    setRegistrationLoading(true)
    try {
      const { signature } = await (await fetch('/wp-json/cyberactive/v1/sign-request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, body: JSON.stringify({ formData, uri: `${apiUrl}/api/customer/register` }),
      })).json();

      if (!signature) {
        alert('Something went wrong. Please try again.');
        return;
      }

      const data = await (await fetch(`${apiUrl}/api/customer/register`, {
        method: 'POST',
        headers: {
          'Authorization': signature,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData }),
      })).json();

      setRegistrationLoading(false);

      if (!data?.Success) {
        alert(data?.Errors[0]?.Messages[0]);
        return;
      }

      setRegistrationSuccess(true);
      setRegistrationResponse(data);
      setStep(5);

    } catch (e) {
      console.log(e);
      alert('Something went wrong. Please try again.');
    } finally {
      setRegistrationLoading(false);
    }

  }

  return (
    <>
      <div className="text">
        <div className="text--heading">Setup your profile:</div>
        <p className="text--body">Please confirm your information below and select a secure password. You will need it to log into your account and access your online courses.</p>
      </div>

      <div className="form-panel">
        <div className="form-panel--heading">Course Access</div>
        <div className="form-panel--body">
          <form id="user-registration" onSubmit={handleSubmit}>
            <div className="form-wrap">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.FirstName}
                  onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                  maxLength={30}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.LastName}
                  onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                  maxLength={30}
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.Phone}
                  onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                  maxLength={10}
                  inputMode="tel"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  maxLength={30}
                />
              </div>
              <div>
                <input type="password" placeholder="Password" value={formData.Password} onChange={(e) => setFormData({
                  ...formData,
                  Password: e.target.value,
                })} /></div>
              <div>
                <input type="password" placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
              </div>
            </div>
            {/*<div className="turnstile-widget">*/}
            {/*  <Turnstile*/}
            {/*    sitekey={turnstileSiteKey}*/}
            {/*    onVerify={(token) => setToken(token)}*/}
            {/*  />*/}
            {/*</div>*/}
          </form>
        </div>
      </div>
    </>
  );
}