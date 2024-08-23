"use client";

import Loading from "../Loading";

export interface CalendarProps {
  companyID: number;
  companyName: string;
  date: string;
}

type EarningsCalendarProps = {
  calendars: CalendarProps[];
  isLoading: boolean;
};

const WLCalendarSection: React.FC<EarningsCalendarProps> = ({
  calendars,
  isLoading,
}) => {
  return (
    <div className="border border-gray-300 overflow-hidden rounded-lg">
      <div className="p-3 bg-gray-100">
        <h2 className="text-base font-semibold text-gray-800">
          Earnings Calendar
        </h2>
        <h5 className="text-xs font-semibold text-gray-400">
          Based on your watchlist
        </h5>
      </div>

      <hr></hr>

      <div className="flex flex-col max-h-60 overflow-y-auto divide-y">
        {isLoading ? (
          <LoadingSection />
        ) : calendars.length > 0 ? (
          <EventList calendars={calendars} />
        ) : (
          <NoEvents />
        )}
      </div>
    </div>
  );
};

const LoadingSection: React.FC = () => {
  return (
    <div className="h-40 flex items-center w-full justify-center">
      <Loading />
    </div>
  );
};

interface EventListProps {
  calendars: CalendarProps[];
}

const EventList: React.FC<EventListProps> = ({ calendars }) => {
  return (
    <>
      {calendars.map((calendar, index) => {
        const [_mmm, _dd] = calendar.date.split("-");

        return (
          <div
            key={`event-${calendar.date}-${index}`}
            className="flex items-center p-2 justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex w-12 flex-col items-center bg-primary-50 text-primary-500 py-1 px-2 rounded">
                <span className="text-xs uppercase">{_mmm}</span>
                <span className="text-xl font-semibold">{_dd}</span>
              </div>
              <div className="flex flex-col">
                <h6 className="text-base text-gray-700 font-semibold">
                  {calendar.companyName}
                </h6>
                <span className="text-sm text-gray-500 capitalize">
                  {calendar.date}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

const NoEvents: React.FC = () => {
  return (
    <div className="flex items-center p-2 h-20 justify-center">
      <p className="text-sm text-gray-700 w-full text-center">
        There is no upcoming earnings events
      </p>
    </div>
  );
};

export default WLCalendarSection;
