import { useState } from "react";
import { motion } from "framer-motion";

interface LandingScheduleSectionProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSchedule: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formData: {
    name: string;
    company: string;
    email: string;
  };
}

const LandingScheduleSection: React.FC<LandingScheduleSectionProps> = ({
  handleChange,
  handleSchedule,
  formData,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ensure all required fields are filled
      if (!formData.name || !formData.email || !formData.company) {
        throw new Error("Please fill in all required fields");
      }

      // Construct Calendly URL with query parameters
      const calendlyUrl =
        `https://calendly.com/pratik-padooru-prospectedge/30min?` +
        `name=${encodeURIComponent(formData.name)}` +
        `&email=${encodeURIComponent(formData.email)}` +
        `&a1=${encodeURIComponent(formData.company)}`;

      // Open Calendly appointment scheduler in a new tab
      window.open(calendlyUrl, "_blank");
    } catch (error) {
      console.error("Error scheduling demo:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-primary-200 opacity-20 blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-800 mb-4 text-center">
            Unlock Your Potential
          </h2>
          <p className="text-xl text-primary-600 mb-8 text-center">
            Schedule a demo and discover how we can transform your business
          </p>
          <form className="flex flex-col w-full gap-6" onSubmit={handleSubmit}>
            {["name", "company", "email"].map((field) => (
              <motion.div
                key={field}
                initial={false}
                animate={{ scale: focusedField === field ? 1.02 : 1 }}
                className="relative"
              >
                <input
                  name={field}
                  type={field === "email" ? "email" : "text"}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(field)}
                  onBlur={() => setFocusedField(null)}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="peer w-full p-4 rounded-lg bg-white border-2 border-primary-300 focus:border-primary-500 outline-none transition-all text-lg text-primary-800 placeholder-primary-400 shadow-sm"
                />
                <motion.div
                  initial={false}
                  animate={{ width: focusedField === field ? "100%" : "0%" }}
                  className="absolute bottom-0 left-0 h-0.5 bg-primary-500"
                  style={{ originX: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </motion.div>
            ))}
            <div className="flex justify-center mt-6">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-primary-500 text-white rounded-full text-lg font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Demo"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingScheduleSection;
