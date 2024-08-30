import { useState } from "react";

const LandingScheduleSection = ({
  handleChange,
  handleSchedule,
  formData,
  isLoading,
  setIsLoading
}: {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSchedule: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: {
    name: string;
    company: string;
    email: string;
  };
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}) => {
  const [errors, setErrors] = useState({
    name: "",
    company: "",
    email: ""
  });

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        break;
      case "company":
        if (!value.trim()) error = "Company is required";
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email is invalid";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    handleChange(e);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = {
      name: validateField("name", formData.name),
      company: validateField("company", formData.company),
      email: validateField("email", formData.email)
    };
    setErrors(formErrors);

    if (!Object.values(formErrors).some((error) => error !== "")) {
      handleSchedule(e);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row w-full justify-center items-center gap-8 lg:gap-20 py-16 px-4 xl:px-0">
      <div className="w-full xl:w-[577px] h-[300px] lg:h-[512px] bg-primary-100 rounded-lg">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Business team collaborating"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col w-full lg:max-w-[600px]">
        <h2 className="text-3xl lg:text-6xl font-bold leading-tight lg:leading-[64px] text-[#171A1FFF] mb-6 lg:mb-8 text-center lg:text-left">
          Generate your opportunities
        </h2>
        <form
          className="flex flex-col w-full gap-4 lg:gap-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className={`peer px-4 lg:px-5 h-12 lg:h-14 w-full border-b ${
                errors.name ? "border-red-500" : "border-blue-gray-200"
              } bg-transparent font-sans text-base lg:text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50`}
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col">
            <input
              name="company"
              type="text"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company"
              className={`peer px-4 lg:px-5 h-12 lg:h-14 w-full border-b ${
                errors.company ? "border-red-500" : "border-blue-gray-200"
              } bg-transparent font-sans text-base lg:text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50`}
            />
            {errors.company && (
              <p className="mt-1 text-red-500 text-sm">{errors.company}</p>
            )}
          </div>
          <div className="flex flex-col">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
              className={`peer px-4 lg:px-5 h-12 lg:h-14 w-full border-b ${
                errors.email ? "border-red-500" : "border-blue-gray-200"
              } bg-transparent font-sans text-base lg:text-lg font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50`}
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <button
            type="submit"
            className="mt-4 lg:mt-6 w-full bg-primary-500 text-white rounded-full text-base lg:text-lg font-semibold py-3 lg:py-4 hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Schedule a demo"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandingScheduleSection;
