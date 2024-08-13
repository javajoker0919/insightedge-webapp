"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { LuCalendarPlus } from "react-icons/lu";
import moment from "moment";
import { CompanyDataType } from "../../app/watchlist/[id]/page";
import Loading from "../Loading";

interface EarningsCalendar {
  id?: string;
  name: string | undefined;
  symbol: string;
}

type EarningsCalendarProps = {
  companies: CompanyDataType[];
};

export interface EarningsCalendarData extends EarningsCalendar {
  date: string;
}

const WLCalendarSection: React.FC<EarningsCalendarProps> = ({ companies }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ecList, setECList] = useState<EarningsCalendarData[] | null>(null);

  useEffect(() => {
    const fetchEarningCalendarData = async () => {
      try {
        setIsLoading(true);

        const companyIDs = companies.map((company) => company.id);

        const { data: ecData, error: ecError } = await supabase
          .from("earnings_calendar")
          .select(
            `
            date,
            symbol
            `
          )
          .in("company_id", companyIDs)
          .order("date", { ascending: true });

        if (ecError) {
          console.error("Error fetching watchlist:", ecError);
        } else if (ecData) {
          const finalList = ecData
            .filter((el) => moment(el.date).isSameOrAfter(moment(), "day"))
            .map((el) => ({
              name: companies.find((e) => e.symbol === el.symbol)?.name,
              ...el,
              date: moment(el.date).format("MMM DD, YYYY"),
            }));

          if (finalList.length) {
            setECList(finalList);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (companies?.length > 0) fetchEarningCalendarData();
  }, [companies]);

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
          <LoadingEvents />
        ) : ecList === null ? (
          <NoEvents />
        ) : (
          <EventList ecList={ecList} />
        )}
      </div>
    </div>
  );
};

export default WLCalendarSection;

const LoadingEvents: React.FC = () => {
  return (
    <div className="flex items-center p-2 h-20 justify-center">
      <Loading />
    </div>
  );
};

interface EventListProps {
  ecList: EarningsCalendarData[];
}

const EventList: React.FC<EventListProps> = ({ ecList }) => {
  return (
    <>
      {ecList.map(({ date, name }, index) => {
        const [_mmm, _dd] = date.split(", ")[0].split(" ");

        return (
          <div
            key={`event-${date}-${index}`}
            className="flex items-center p-2 justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex w-12 flex-col items-center bg-primary-50 text-primary-500 py-1 px-2 rounded">
                <span className="text-xs uppercase">{_mmm}</span>
                <span className="text-xl font-semibold">{_dd}</span>
              </div>
              <div className="flex flex-col">
                <h6 className="text-base text-gray-700 font-semibold">
                  {name}
                </h6>
                <span className="text-sm text-gray-500 capitalize">{date}</span>
              </div>
            </div>
            {/* <LuCalendarPlus
              size={25}
              className="cursor-pointer text-gray-500 hover:text-primary-500 transition-all duration-300"
            /> */}
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
