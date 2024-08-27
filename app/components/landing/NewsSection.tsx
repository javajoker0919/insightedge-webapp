import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const LandingNewsSection = ({ blogs }: any) => {
  return (
    <section id="new" className="py-16 px-4 flex flex-col items-center gap-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center max-w-[60rem]">
        What's new?
      </h1>

      <p className="text-gray-600">Explore our blogs</p>

      <div className="flex flex-col md:flex-row w-full max-w-[80rem] items-center md:items-start justify-around gap-6">
        <Swiper
          pagination={{ clickable: true }}
          onInit={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          watchOverflow={false}
          spaceBetween={15}
          slidesPerView={3}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next"
          }}
          modules={[Navigation]}
          // breakpoints={{
          //   320: { slidesPerView: 1 },
          //   768: { slidesPerView: 2 },
          //   1024: { slidesPerView: 3 },
          //   1280: { slidesPerView: 4 },
          //   1440: { slidesPerView: 5 },
          //   1600: { slidesPerView: 6 },
          //   1920: { slidesPerView: 7 }
          // }}
          className="gap-2 items-center md:!flex !py-5 !px-7 !hidden"
        >
          <div className="swiper-button-prev border rounded-full bg-white px-5 after:!text-sm after:!font-bold shadow-sm after:!text-black"></div>
          <div className="swiper-button-next border rounded-full bg-white px-5 after:!text-sm after:!font-bold shadow-sm after:!text-black"></div>
          {blogs.map((item: any, index: number) => (
            <SwiperSlide key={index}>
              <BlogCard
                key={item.id}
                title={item.attributes.title}
                description={item.attributes.description}
                src={`${item.attributes.cover.data.attributes.url}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="md:hidden flex flex-col gap-6">
          {blogs.map((item: any, index: number) => (
            <BlogCard
              key={item.id}
              title={item.attributes.title}
              description={item.attributes.description}
              src={`${item.attributes.cover.data.attributes.url}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingNewsSection;

const BlogCard: React.FC<{
  title: string;
  description: string;
  src: string;
}> = ({ title, description, src }) => (
  <div className="border shadow rounded-md overflow-hidden w-auto max-w-sm mx-auto">
    <div className="w-full h-48 sm:h-64 bg-primary-100">
      <Image
        src={src}
        alt="Blog image"
        width={480}
        height={400}
        className="object-cover w-full h-full"
      />
    </div>
    <div className="p-4">
      <p className="font-bold text-lg sm:text-xl line-clamp-2 mb-4">{title}</p>
      <span>
        <p className="text-gray-600 text-sm sm:text-base line-clamp-3 mb-2">
          {description}
        </p>
        <button className="text-primary-500 text-sm sm:text-base">
          Read more
        </button>
      </span>
    </div>
  </div>
);
