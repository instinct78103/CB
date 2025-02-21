export default function Registration({ formData, setFormData }) {

  return (
    <>
      <div className="text">
        <div className="text--heading">Setup your profile:</div>
        <p className="text--body">Please confirm your information below and select a secure password. You will need it to log into your account and access your online courses.</p>
      </div>

      <div className="form-panel">
        <div className="form-panel--heading">Course Access</div>
        <div className="form-panel--body">
          <form id="user-registration">
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
              <div><input type="password" placeholder="Password" /></div>
              <div><input type="password" placeholder="Repeat Password" /></div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}