export const validateField = (name, value, formData = {}) => {
  const nameRegex = /^[A-Za-z]{2,30}$/;
  const emailRegex = /^\S+@\S+\.\S+$/;
  const phoneRegex = /^\d{10}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  switch (name) {
    case "FirstName":
    case "LastName":
      return nameRegex.test(value) ? "" : "Must be 2-30 letters only.";

    case "Email":
      return emailRegex.test(value) ? "" : "Invalid email format.";

    case "Phone":
      return phoneRegex.test(value) ? "" : "Must be exactly 10 digits.";

    case "Password":
      return passwordRegex.test(value) ? "" : "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.";

    case "RepeatPassword":
      return value === formData.Password ? "" : "Passwords do not match.";

    default:
      return "";
  }
};