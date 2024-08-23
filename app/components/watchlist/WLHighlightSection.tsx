"use client";

import Loading from "../Loading";

export interface HighlightProps {
  companyID: number;
  companyName: string;
  highlight: string;
}

interface WatchlistHighlightsProps {
  isLoading: boolean;
  highlights: HighlightProps[];
}

const WLHighlightSection: React.FC<WatchlistHighlightsProps> = ({
  isLoading,
  highlights,
}) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className={`bg-gray-100 border-b font-medium text-gray-700 p-3`}>
        <p className="font-bold">Highlights</p>
        <p className="text-sm text-gray-400">Based on your watchlist</p>
      </div>

      {isLoading ? (
        <LoadingSection />
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {highlights.length > 0 ? (
            <ul className="list-disc p-2 pl-8">
              {highlights.map((highlight, index) => (
                <li key={`${highlight.companyName}-${index}`} className="mb-4">
                  <h4 className="font-semibold text-gray-700">
                    {highlight.companyName}
                  </h4>
                  <p className="text-sm text-gray-600">{highlight.highlight}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center h-20">
              <span className="text-sm text-gray-700">No Highlights</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LoadingSection = () => {
  return (
    <div className="h-40 w-full flex items-center justify-center">
      <Loading />
    </div>
  );
};

export default WLHighlightSection;
