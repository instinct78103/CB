import '../styles/registration.scss';
// import Turnstile from 'react-turnstile';
import { useState } from 'react';

export default function Registration({ formData, setFormData, apiUrl, mainCourseId, allDeliveryOptions }) {

  // const [token, setToken] = useState('');
  // const turnstileSiteKey = document.querySelector('#root')?.getAttribute('data-turnstile_sitekey');

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.password || formData.password !== formData.repeatPassword) {
      return;
    }

    // if (!token || !turnstileSiteKey) {
    //   alert('CAPTCHA verification failed. Please complete the CAPTCHA.');
    //   return;
    // }

    // setFormData(prevFormData => ({ ...prevFormData, turnstileToken: token }));
    try {
      console.log(allDeliveryOptions)
      const data = new URLSearchParams();
      data.append("Email", formData.email);
      data.append("ProductPackageID", mainCourseId);
      data.append("Password", formData.password);

      const resp = await (await fetch(`${apiUrl}/api/customer/verifyAccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data.toString()
      })).json()

      if (resp?.Success) {
        return;
      }

      const test = await (await fetch(`${apiUrl}/api/customer/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })).json()

      console.log(test)

      // if (!Success) {
      //   alert('Account already exists');
      //   return;
      // }

    } catch (e) {
      // alert(`${e}. Something went wrong. Please try again.`);
      // return
    }

    // const response = await fetch('/api/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });
    //
    // const result = await response.json();

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
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  maxLength={48}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  maxLength={48}
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  maxLength={11}
                  inputMode="tel"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={48}
                />
              </div>
              <div><input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} /></div>
              <div><input type="password" placeholder="Repeat Password" value={formData.repeatPassword} onChange={(e) => setFormData({ ...formData, repeatPassword: e.target.value })} /></div>
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