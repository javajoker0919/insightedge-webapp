import { motion } from "framer-motion";

const LandingSummarySection = () => {
  return (
    <section
      id="summary"
      className="py-16 md:py-24 px-4 md:px-8 flex flex-col items-center"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-5xl font-bold text-center max-w-4xl mb-6 text-gray-800"
      >
        Tailored insights{" "}
        <span className="text-primary-500 inline-block hover:scale-105 transition-transform">
          delivered to your inbox
        </span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg md:text-xl text-gray-600 max-w-3xl text-center mb-12"
      >
        Customize your outreach using insights from executive statements in
        earnings calls and press releases for your key accounts.
      </motion.p>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <InsightCard
            title="Targeted Sales & Marketing"
            subtitle="TAILORED ACCOUNT SPECIFIC STRATEGIES"
            items={[
              "Generate growth opportunities based on customer priorities",
              "Develop strategies using insights from earnings calls",
              "Gain an edge by addressing specific customer needs",
              "Personalize outreach with executive-level insights",
              "Align your offerings with customer's strategic initiatives",
              "Identify upsell and cross-sell opportunities",
            ]}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="md:mt-16"
        >
          <InsightCard
            title="Actionable Insights"
            subtitle="DATA DRIVEN CUSTOMER ENGAGEMENT"
            items={[
              "Identify key business priorities driving customer decisions",
              "Reveal critical pain points affecting target accounts",
              "Demonstrate how your solutions support their projects",
              "Track industry trends and competitive landscape",
              "Anticipate customer needs based on financial performance",
              "Leverage real-time data for timely decision-making",
            ]}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default LandingSummarySection;

interface InsightCardProps {
  title: string;
  subtitle: string;
  items: string[];
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  subtitle,
  items,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="flex flex-col p-6 backdrop-blur-md bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-all"
  >
    <p className="text-gray-500 text-sm mb-2">{subtitle}</p>
    <motion.h3
      whileHover={{ scale: 1.05 }}
      className="text-2xl md:text-3xl font-bold text-primary-500 mb-4"
    >
      {title}
    </motion.h3>
    <ul className="space-y-3">
      {items.map((item, index) => (
        <motion.li
          key={index}
          whileHover={{ x: 5 }}
          className="flex items-start"
        >
          <svg
            className="w-6 h-6 text-primary-500 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-gray-700">{item}</span>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);
