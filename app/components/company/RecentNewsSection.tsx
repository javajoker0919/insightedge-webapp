import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { supabase } from "@/utils/supabaseClient";
import { Details, Loading } from "..";

export interface NewsItem {
  published_date: string;
  title: string;
  image: string;
  url: string;
}

interface RecentNewsSectionProps {
  companyID: number;
}

const RecentNewsSection: React.FC<RecentNewsSectionProps> = ({ companyID }) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchNewsItems(companyID);
  }, [companyID]);

  const fetchNewsItems = async (companyID: number) => {
    if (!companyID) return;

    setIsLoading(true);

    try {
      const { data: newsData, error: newsError } = await supabase
        .from("stock_news_sentiments")
        .select("published_date, title, image, url")
        .eq("company_id", companyID)
        .order("published_date", { ascending: false })
        .limit(10);

      if (newsError) throw newsError;

      setNewsItems(newsData as NewsItem[]);
    } catch (error) {
      console.error("Error fetching news items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const differenceInTime = now.getTime() - publishedDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    const differenceInWeeks = Math.floor(differenceInDays / 7);
    const differenceInMonths = Math.floor(differenceInDays / 30);
    const differenceInYears = Math.floor(differenceInDays / 365);

    if (differenceInYears > 0) {
      return `${differenceInYears} year${differenceInYears > 1 ? "s" : ""} ago`;
    } else if (differenceInMonths > 0) {
      return `${differenceInMonths} month${
        differenceInMonths > 1 ? "s" : ""
      } ago`;
    } else if (differenceInWeeks > 0) {
      return `${differenceInWeeks} week${differenceInWeeks > 1 ? "s" : ""} ago`;
    } else if (differenceInDays > 0) {
      return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
    } else {
      return "Today";
    }
  };

  return (
    <Details title={"Recent News"}>
      {isLoading ? (
        <div className="flex justify-center items-center h-40 p-4">
          <Loading />
        </div>
      ) : newsItems.length === 0 ? (
        <div className="flex p-4 h-40 items-center justify-center">
          <span className="text-gray-600">There is no recent news</span>
        </div>
      ) : (
        <Swiper
          pagination={{ clickable: true }}
          onInit={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          watchOverflow={false}
          spaceBetween={15}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          modules={[Navigation]}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1440: { slidesPerView: 5 },
            1600: { slidesPerView: 6 },
            1920: { slidesPerView: 7 },
          }}
          className="gap-2 items-center flex !py-5 !px-7"
        >
          <div className="swiper-button-prev border rounded-full bg-white px-5 after:!text-sm after:!font-bold shadow-sm after:!text-black"></div>
          <div className="swiper-button-next border rounded-full bg-white px-5 after:!text-sm after:!font-bold shadow-sm after:!text-black"></div>
          {newsItems.map((item, index) => (
            <SwiperSlide key={index}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex hover:shadow-md border border-transparent hover:border-gray-200 flex-col overflow-hidden rounded-lg"
              >
                <div className="w-full overflow-hidden">
                  <img
                    className="object-cover w-full"
                    src={
                      item.image ||
                      `https://picsum.photos/200/300?random=${index}`
                    }
                    alt={item.title}
                  />
                </div>
                <div className="p-3 border space-y-2 rounded-b-lg">
                  <h4 className="font-medium line-clamp-3">{item.title}</h4>
                  <p className="text-sm text-gray-500">
                    {getTimeAgo(item.published_date)}
                  </p>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Details>
  );
};

export default RecentNewsSection;
