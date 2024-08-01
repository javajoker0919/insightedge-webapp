import { supabase } from "@/supabase";
import { useEffect, useState } from "react";
import { LuCalendarPlus } from "react-icons/lu";
import moment from "moment";

interface EarningsCalendar {
  id?: string;
  name: string | undefined;
  symbol: string;
}

type EarningsCalendarProps = {
  companiesList: EarningsCalendar[];
};

interface EarningsCalendarData extends EarningsCalendar {
  date: string;
}

const EarningsCalendar: React.FC<EarningsCalendarProps> = ({
  companiesList,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [earningCalendarList, setEarningCalendarList] = useState<
    EarningsCalendarData[] | null
  >(null);

  useEffect(() => {
    async function fetchEarningCalendarData() {
      setIsLoading(true);
      const { data: earningCalendarData, error: earningCalendarError } =
        await supabase
          .from("earnings_calendar")
          .select(
            `
            date,
            symbol
            `
          )
          .in(
            "symbol",
            companiesList.map((el) => el.symbol)
          );

      if (earningCalendarError) {
        console.error("Error fetching watchlist:", earningCalendarError);
      } else if (earningCalendarData) {
        console.log({ earningCalendarData });
        const finalList = earningCalendarData.map((el) => ({
          name: companiesList.find((e) => e.symbol === el.symbol)?.name,
          ...el,
          date: moment(el.date).format("MMM DD, YYYY"),
        }));
        if (finalList.length) setEarningCalendarList(finalList);
      }
      setIsLoading(false);
    }

    if (companiesList?.length > 0) fetchEarningCalendarData();
  }, []);
  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div className="flex items-center p-2 justify-between border-t border-gray-300 pb-2 mb-2 last:mb-0 ">
          <p className="text-sm text-gray-700 w-full text-center">
            Loading Events...
          </p>
        </div>
      ) : earningCalendarList !== null ? (
        earningCalendarList.map(({ date, name }) => {
          const [_mmm, _dd] = date.split(", ")[0].split(" ");
          return (
            <div
              key={`event-${date}`}
              className="flex items-center p-2 justify-between border-t border-gray-300 pb-2 mb-2 last:mb-0 "
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
                  <span className="text-sm text-gray-500 capitalize">
                    {date}
                  </span>
                </div>
              </div>
              <LuCalendarPlus
                size={25}
                className="cursor-pointer text-gray-500 hover:text-primary-500 transition-all duration-300"
              />
            </div>
          );
        })
      ) : (
        <div className="flex items-center p-2 justify-between border-t border-gray-300 pb-2 mb-2 last:mb-0 ">
          <p className="text-sm text-gray-700 w-full text-center">No Events</p>
        </div>
      )}
    </div>
  );
};

export default EarningsCalendar;
