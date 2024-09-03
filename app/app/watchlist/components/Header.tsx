"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoAddOutline, IoList } from "react-icons/io5";
import { useAtomValue } from "jotai";

import { watchlistAtom } from "@/utils/atoms";
import WatchlistModal from "@/app/components/WatchlistModal";
import { useParams } from "next/navigation";

import "swiper/css";
import "swiper/css/navigation";
import { getMixPanelClient } from "@/utils/mixpanel";

const Header = () => {
  const params = useParams();
  const paramUUID = params.id as string;
  const mixpanel = getMixPanelClient();

  const watchlist = useAtomValue(watchlistAtom);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddWatchlist = () => {
    mixpanel.track("watchlist.create", {
      $source: "watchlist_page.header",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="w-full p-4 bg-gray-50">
      <Swiper
        onInit={(swiper) => {
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        watchOverflow={false}
        slidesPerView="auto"
        spaceBetween={15}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
        className="gap-2 items-center flex !px-5"
      >
        <div className="swiper-button-prev border rounded-full bg-white px-5 after:!text-sm after:!font-bold shadow-sm after:!text-black"></div>
        <div className="swiper-button-next border rounded-full bg-white px-5 after:!text-sm after:!font-bold shadow-sm after:!text-black"></div>
        {watchlist?.map((item) => (
          <SwiperSlide
            key={item.uuid}
            className="!flex w-auto flex-col items-center py-1"
          >
            <Link
              href={`/app/watchlist/${item.uuid}`}
              className={`flex items-center gap-2 p-2 bg-white text-gray-700 rounded-lg w-full max-w-56 border transition-all duration-200 ${
                paramUUID === item.uuid
                  ? "border-b-2 border-b-primary-500"
                  : "hover:shadow-md"
              }`}
            >
              <IoList className="text-2xl p-1 rounded-sm bg-gray-100" />
              <span className="w-36 transition-colors duration-200 text-sm truncate font-medium">
                {item.name}
              </span>
              {item?.company_count !== undefined && (
                <span className="text-gray-500 text-sm">
                  {item.company_count}
                </span>
              )}
            </Link>
          </SwiperSlide>
        ))}
        <SwiperSlide className="py-1">
          <button
            onClick={handleAddWatchlist}
            className="flex items-center min-w-fit w-full gap-2 rounded-md hover:bg-gray-100 text-primary-500 p-2"
          >
            <IoAddOutline className="text-xl" />
            <p>New list</p>
          </button>
        </SwiperSlide>
      </Swiper>

      <WatchlistModal
        type="add"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default Header;
