import { Details } from "../../../app/company/[id]/components";
import { SummaryProps } from "./SummarySection";

const RenderSummaryContent = ({
  data,
  showFullSummary,
  setShowFullSummary,
}: {
  data: SummaryProps | null;
  showFullSummary: boolean;
  setShowFullSummary: (showFullSummary: boolean) => void;
}) => {
  const renderList = (items: string[] | undefined, maxItems?: number) => (
    <ul className="list-disc pl-8 py-2 text-gray-700 text-sm">
      {items && Array.isArray(items) && items.length > 0 ? (
        (maxItems ? items.slice(0, maxItems) : items).map((item, index) => (
          <li key={index}>{item}</li>
        ))
      ) : (
        <li>No data</li>
      )}
    </ul>
  );

  const renderDetails = (title: string, items: string[] | undefined) => (
    <Details key={title} title={title} type="sub" open={false}>
      {renderList(items)}
    </Details>
  );

  return (
    <>
      {data?.summary && (
        <div className="px-1.5 py-3">
          {renderList(data.summary, showFullSummary ? undefined : 2)}
          {!showFullSummary && data.summary.length > 2 && (
            <button
              onClick={() => setShowFullSummary(true)}
              className="text-blue-500 hover:underline"
            >
              Show more
            </button>
          )}
        </div>
      )}
      {renderDetails("Priorities", data?.priorities)}
      {renderDetails("Challenges", data?.challenges)}
      {renderDetails("Pain Points", data?.pain_points)}
      {renderDetails("Key Initiatives", data?.opportunities)}
    </>
  );
};

export default RenderSummaryContent;
