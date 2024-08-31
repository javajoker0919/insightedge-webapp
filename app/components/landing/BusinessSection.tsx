import { motion } from "framer-motion";

const LandingBusinessSection = () => {
  return (
    <section id="business" className="py-20 px-4 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C30,40 70,40 100,0 L100,100 L0,100 Z"
            fill="url(#grad1)"
            opacity="0.1"
          />
        </svg>
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center max-w-4xl mx-auto mb-16 relative z-10"
      >
        Elevate <span className="text-primary-500">Your Business</span> with Our
        Intelligence Platform
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto relative z-10">
        <BusinessFeature
          icon={<TargetIcon />}
          title="Targeted Approach"
          description="Align your strategy with customers' critical needs and projects."
        />
        <BusinessFeature
          icon={<WinRateIcon />}
          title="Improved Win Rates"
          description="Boost conversions by focusing on customers' priorities."
        />
        <BusinessFeature
          icon={<ChartIcon />}
          title="Enhanced Pipeline"
          description="Build a stronger pipeline with data-driven customer insights."
        />
      </div>
    </section>
  );
};

export default LandingBusinessSection;

const BusinessFeature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:bg-white/10 backdrop-blur-sm"
  >
    <div className="w-32 h-32 mb-6">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const TargetIcon = () => (
  <motion.svg
    viewBox="0 0 100 100"
    className="w-full h-full"
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <defs>
      <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#60A5FA" />
      </linearGradient>
    </defs>
    <motion.circle
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke="url(#targetGradient)"
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 1,
      }}
    />
    <motion.circle
      cx="50"
      cy="50"
      r="30"
      fill="none"
      stroke="url(#targetGradient)"
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 1,
        delay: 0.5,
      }}
    />
    <motion.circle
      cx="50"
      cy="50"
      r="15"
      fill="url(#targetGradient)"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 2,
      }}
    />
    <motion.g
      initial={{ rotate: 0 }}
      animate={{ rotate: -360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      <motion.line
        x1="50"
        y1="0"
        x2="50"
        y2="100"
        stroke="url(#targetGradient)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 1,
        }}
      />
      <motion.line
        x1="0"
        y1="50"
        x2="100"
        y2="50"
        stroke="url(#targetGradient)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 1,
        }}
      />
    </motion.g>
  </motion.svg>
);

const WinRateIcon = () => (
  <motion.svg
    viewBox="0 0 100 100"
    className="w-full h-full"
    initial={{ y: 0 }}
    animate={{ y: [-2, 2, -2] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  >
    <defs>
      <linearGradient id="winRateGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#60A5FA" />
      </linearGradient>
    </defs>

    {/* Percentage symbol */}
    <motion.path
      d="M30,70 L70,30 M40,40 A10,10 0 1,1 40,20 A10,10 0 1,1 40,40 M60,80 A10,10 0 1,1 60,60 A10,10 0 1,1 60,80"
      fill="none"
      stroke="url(#winRateGradient)"
      strokeWidth="8"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />

    {/* Pulsing circle */}
    <motion.circle
      cx="50"
      cy="50"
      r="48"
      stroke="url(#winRateGradient)"
      strokeWidth="2"
      fill="none"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1.1, opacity: 0.5 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
    />
  </motion.svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="pipelineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#60A5FA" />
      </linearGradient>
    </defs>

    {/* Funnel */}
    <motion.path
      d="M10,20 L90,20 L70,80 L30,80 Z"
      fill="none"
      stroke="url(#pipelineGradient)"
      strokeWidth="4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />

    {/* Funnel stages */}
    <motion.line
      x1="20"
      y1="40"
      x2="80"
      y2="40"
      stroke="url(#pipelineGradient)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    />
    <motion.line
      x1="25"
      y1="60"
      x2="75"
      y2="60"
      stroke="url(#pipelineGradient)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    />

    {/* Flowing data */}
    <motion.g
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <motion.circle
        cx="50"
        cy="30"
        r="3"
        fill="url(#pipelineGradient)"
        animate={{ y: [0, 50], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
      />
      <motion.circle
        cx="40"
        cy="30"
        r="3"
        fill="url(#pipelineGradient)"
        animate={{ y: [0, 50], opacity: [1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 0.5,
          delay: 0.3,
        }}
      />
      <motion.circle
        cx="60"
        cy="30"
        r="3"
        fill="url(#pipelineGradient)"
        animate={{ y: [0, 50], opacity: [1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 0.5,
          delay: 0.6,
        }}
      />
    </motion.g>
  </svg>
);
