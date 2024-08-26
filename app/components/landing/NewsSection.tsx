import Image from "next/image";

const LandingNewsSection = ({ blogs }: any) => {
  return (
    <section id="new" className="py-16 px-4 flex flex-col items-center gap-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center max-w-[60rem]">
        What's new?
      </h1>

      <p className="text-gray-600">Explore our blogs</p>

      <div className="flex flex-col md:flex-row w-full max-w-[80rem] items-center md:items-start justify-around gap-6">
        {blogs.map((item: any) => (
          <BlogCard
            key={item.id}
            title={item.attributes.title}
            description={item.attributes.description}
            src={`${item.attributes.cover.data.attributes.url}`}
          />
        ))}
        {/* <BlogCard
          title="5 Game-Changing Ways AI-Powered Market Intelligence is Revolutionizing B2B Sales"
          description="In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity. In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity."
          src="/image/blog-1.jpg"
        />
        <BlogCard
          title="7 Innovative Strategies AI-Driven Market Insights are Transforming B2B Sales"
          description="In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity. In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity."
          src="/image/blog-2.jpg"
        />
        <BlogCard
          title="6 Innovative Approaches AI-Driven Market Intelligence is Shaping B2B Sales"
          description="In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity. In today's fast-paced business environment, staying ahead of the curve is not just an advantage—it's a necessity."
          src="/image/blog-3.jpg"
        /> */}
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
