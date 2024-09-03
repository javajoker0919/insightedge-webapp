import React, { useState } from "react";
import { motion } from "framer-motion";

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How can this help my business?",
      answer: "Our platform provides tailored insights and actionable data to help you identify key opportunities, understand market trends, and make informed decisions that drive business growth. By leveraging advanced analytics and AI-driven insights, you can uncover hidden patterns in your data, optimize your marketing strategies, and enhance your sales processes. Additionally, our platform offers real-time updates and personalized recommendations, ensuring that you stay ahead of the competition and capitalize on emerging trends. Whether you're looking to improve customer engagement, increase operational efficiency, or expand into new markets, our platform equips you with the tools and knowledge needed to achieve your business objectives."
    },
    {
      question: "What is included in the Free plan?",
      answer: "The Free plan includes general summaries of earnings calls, latest news, press releases, general insights into company priorities, challenges, pain points, key initiatives, top general sales opportunities, top general marketing tactics, and a maximum of 1 watch list to track companies."
    },
    {
      question: "What additional features are available in the Premium plan?",
      answer: "The Premium plan includes everything in the Free plan, plus tailored insights into company priorities, challenges, pain points, key initiatives to your offerings, tailored sales opportunities, identification of buyers for each opportunity, tailored inbound and outbound strategies, tailored marketing strategy, unlimited watch lists, emailed reports, and priority support."
    },
    {
      question: "How can I contact sales for the Enterprise plan?",
      answer: "You can contact sales for the Enterprise plan by clicking the 'Contact Sales' button under the Enterprise plan section. This will take you to a Calendly link where you can schedule a meeting with our sales team."
    },
    {
      question: "What are Targeted Sales Opportunities?",
      answer: "Identify top sales opportunities tailored to your offerings & pinpoint decision-makers. Leverage AI-driven insights to craft personalized pitches that address specific pain points and increase your win rates."
    },
    {
      question: "What is Account Based Marketing?",
      answer: "Generate targeted marketing tactics for each account, perfectly aligned with your offerings and customer needs. Utilize deep market intelligence to create highly relevant content and campaigns that resonate with your ideal customers."
    },
    {
      question: "What are Actionable Insights?",
      answer: "Uncover key initiatives, priorities, challenges & pain points within your target accounts. Transform raw data into strategic action plans that drive meaningful conversations and build stronger customer relationships."
    }
  ];

  return (
    <div className="mt-16">
      <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">Frequently Asked Questions</h3>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="shadow-lg rounded-lg p-6 cursor-pointer border border-gray-200 bg-white"
            onClick={() => toggleFAQ(index)}
          >
            <h4 className="text-xl font-semibold mb-2 flex justify-between items-center">
              {faq.question}
              <span>{activeIndex === index ? "-" : "+"}</span>
            </h4>
            {activeIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-600 mt-2">{faq.answer}</p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;