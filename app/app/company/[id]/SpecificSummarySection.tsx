const SpecificSummarySection: React.FC = () => (
  <details
    className="bg-white border border-gray-300 rounded-lg overflow-hidden"
    open
  >
    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-700 hover:bg-gray-50">
      User Specific Summary
    </summary>
    <div className="px-4 py-3">
      <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md border border-indigo-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out">
        Generate
      </button>
    </div>
  </details>
);

export default SpecificSummarySection;
