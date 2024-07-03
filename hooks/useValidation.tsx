const useValidation = () => {
  const validateField = (
    value: string,
    regex: RegExp,
    errorMessage: string
  ) => {
    const isValid = regex.test(value);
    return {
      validate: isValid,
      error: isValid ? "" : errorMessage,
    };
  };

  const validateEmail = (email: string) =>
    validateField(
      email,
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email"
    );

  const validatePassword = (password: string) =>
    validateField(
      password,
      /^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
      "Please provide a strong password"
    );

  return {
    validateEmail,
    validatePassword,
  };
};

export default useValidation;
