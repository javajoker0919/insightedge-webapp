"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { Navigation } from "swiper/modules";

import { supabase } from "@/utils/supabaseClient";
import { watchlistAtom } from "@/utils/atoms";
import { IoAddOutline, IoList, IoPencil, IoTrash } from "react-icons/io5";
import AddWatchlistModal from "@/app/components/AddWatchlistModal";

import "swiper/css";
import "swiper/css/navigation";

export default function WatchlistPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [watchlist, setWatchlist] = useAtom(watchlistAtom);
  const [watchlistName, setWatchlistName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const optionsModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchWatchlistName() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("watchlists")
        .select("name")
        .eq("uuid", id)
        .single();

      if (error) {
        console.error("Error fetching watchlist:", error);
      } else if (data) {
        setWatchlistName(data.name);
      }
      setIsLoading(false);
    }

    fetchWatchlistName();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsModalRef.current &&
        !optionsModalRef.current.contains(event.target as Node)
      ) {
        setIsOptionsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddWatchlist = () => {
    setIsModalOpen(true);
  };

  const toggleOptionsModal = () => {
    setIsOptionsModalOpen(!isOptionsModalOpen);
  };

  const handleDeleteWatchlist = async () => {
    setIsOptionsModalOpen(false);

    try {
      const { error } = await supabase
        .from("watchlists")
        .delete()
        .eq("uuid", id);

      if (error) throw error;

      setWatchlist((prev) => prev?.filter((item) => item.uuid !== id) || null);
      router.push(`/app/watchlist/${watchlist && watchlist[0].uuid}`);
    } catch (error) {
      console.error("Error deleting watchlist:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-1">
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
            320: {
              slidesPerView: 1,
            },
            480: {
              slidesPerView: 2,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 5,
            },
            1280: {
              slidesPerView: 5,
            },
          }}
          className="gap-2 items-center flex !px-5"
        >
          <div className="swiper-button-prev border rounded-full bg-white px-5 after:!text-sm after:!font-bold shadow-sm after:!text-black"></div>
          <div className="swiper-button-next border rounded-full bg-white px-5 after:!text-sm after:!font-bold shadow-sm after:!text-black"></div>
          {watchlist &&
            watchlist?.map((item) => {
              return (
                <SwiperSlide
                  key={item.uuid}
                  className="!flex w-auto flex-col items-center py-1"
                >
                  <Link
                    href={`/app/watchlist/${item.uuid}`}
                    className={`flex items-center gap-2 p-2 rounded-lg bg-white w-fit hover:shadow-md border transition-all duration-200`}
                  >
                    <IoList className={`text-2xl bg-gray-100 p-1 rounded-sm`} />

                    <span className="text-gray-700 w-36 transition-colors duration-200 text-sm truncate font-medium">
                      {item.name}
                    </span>
                  </Link>
                </SwiperSlide>
              );
            })}

          <SwiperSlide className="py-1">
            <button
              onClick={handleAddWatchlist}
              className="flex items-center min-w-fit gap-2 rounded-md hover:bg-gray-100 text-indigo-500 p-2"
            >
              <IoAddOutline className={`text-xl`} />
              <p>New list</p>
            </button>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="flex-1 w-full items-center flex justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
            <h1>Loading</h1>
          </div>
        ) : (
          <div className="w-full h-full justify-between flex flex-col px-4 py-2">
            <div className="w-full flex items-center justify-between relative">
              <h1>{watchlistName}</h1>
              {watchlist && watchlist[0] && id !== watchlist[0].uuid && (
                <button
                  onClick={toggleOptionsModal}
                  className="hover:bg-gray-100 rounded-full w-12 h-12 items-center justify-center gap-0.5 bg-white flex flex-col"
                >
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="rounded-full w-1 h-1 bg-black mb-0.5"
                    />
                  ))}
                </button>
              )}
              {isOptionsModalOpen && (
                <div
                  ref={optionsModalRef}
                  className="absolute w-52 py-1 border border-gray-100 right-0 top-14 bg-white shadow-md rounded-md overflow-hidden"
                >
                  <button className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100">
                    <IoPencil className="text-gray-600 text-xl" />
                    <span>Rename</span>
                  </button>
                  <button
                    onClick={handleDeleteWatchlist}
                    className="flex items-center gap-3 px-4 py-2 w-full hover:bg-gray-100 text-red-500"
                  >
                    <IoTrash className="text-red-500 text-xl" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <p>Nothing in this watchlist yet</p>
              <p className="text-gray-500">
                Track investments you care about here
              </p>
              <button className="rounded-full p-2 text-indigo-500 hover:bg-gray-100 flex items-center gap-2">
                <IoAddOutline className={`text-xl`} />
                <p>Add investments</p>
              </button>
            </div>
          </div>
        )}
      </div>

      <AddWatchlistModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
