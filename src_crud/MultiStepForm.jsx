import React, { useState } from "react";

export default function MultiStepForm () {

  const [step, setStep] = useState(1);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);


  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Submitted!");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Step {step} of 3</h2>

      {step === 1 && (
        <div>
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full mb-4"
          />

          <label className="block mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full mb-4"
          />

          <button onClick={nextStep} className="bg-blue-500 text-white p-2 rounded">
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block mb-2">Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 w-full mb-4"
          />

          <label className="block mb-2">City:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="border p-2 w-full mb-4"
          />

          <button onClick={prevStep} className="bg-gray-500 text-white p-2 rounded mr-2">
            Back
          </button>
          <button onClick={nextStep} className="bg-blue-500 text-white p-2 rounded">
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="font-bold mb-2">Review Your Details</h3>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Address:</strong> {formData.address}</p>
          <p><strong>City:</strong> {formData.city}</p>

          <button onClick={prevStep} className="bg-gray-500 text-white p-2 rounded mr-2">
            Back
          </button>
          <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded">
            Submit
          </button>
        </div>
      )}
    </div>
  );
};
