export const validateEmail = (Email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return !emailRegex.test(Email);
};

export const validatePassword = (Password: string): boolean => {
  return Password.length < 5;
};

export const validateName = (Name: String): boolean => {
  return Name.length < 7;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(?:\(?[1-9]{2}\)?\s?)?(?:9\d{4}|\d{4})-?\d{4}$/;
  return phoneRegex.test(phone);
};
