"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LandingHeaderSection from "../components/landing/Header";
import LandingFooterSection from "../components/landing/Footer";

interface BlogPost {
  id: number;
  attributes: {
    title: string;
    description: string;
    createdAt: string;
    slug: string;
    category: {
      data: {
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
    author: {
      data: {
        attributes: {
          name: string;
        };
      };
    };
    cover: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

interface Category {
  id: number;
  attributes: {
    title: string;
    name: string;
    description: string;
    createdAt: string;
    slug: string;
  };
}

const Blog = () => {
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [categroyBlogData, setCategoryBlogData] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  const getBlogData = async () => {
    const res = await fetch(`${strapiUrl}/api/blogs?populate=*`);
    const posts = await res.json();
    if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
      console.warn(
        "STRAPI_URL is not defined in the environment variables. Using default: http://localhost:1337"
      );
    }
    setBlog(posts.data);
    setCategoryBlogData(posts.data);
  };

  const getCategoryList = async () => {
    const res = await fetch(`${strapiUrl}/api/categories?populate=*`);
    const categories = await res.json();
    setCategoryList(categories.data);
  };

  const getBlogDataByCategory = async (categorySlug: string) => {
    const res = await fetch(
      `${strapiUrl}/api/blogs?filters[category][slug][$eq]=${categorySlug}&populate=*`
    );
    const posts = await res.json();
    setCategoryBlogData(posts.data);
  };

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    setIsHeaderVisible(currentScrollY <= lastScrollY || currentScrollY < 50);
    setLastScrollY(currentScrollY);
    setIsScrolled(currentScrollY > 0);
  }, [lastScrollY]);

  useEffect(() => {
    getBlogData();
    getCategoryList();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-transparent">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.15" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#grad1)" />

          <circle cx="200" cy="200" r="300" fill="#9ca3af" opacity="0.07">
            <animate
              attributeName="r"
              values="300;320;300"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="800" cy="800" r="400" fill="#6b7280" opacity="0.05">
            <animate
              attributeName="r"
              values="400;420;400"
              dur="15s"
              repeatCount="indefinite"
            />
          </circle>

          <g className="hidden md:block">
            <circle cx="50" cy="100" r="80" fill="#9ca3af" opacity="0.25">
              <animate
                attributeName="cy"
                values="100;120;100"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          <g className="hidden md:block">
            <circle cx="800" cy="200" r="40" fill="#4b5563" opacity="0.3">
              <animate
                attributeName="r"
                values="40;55;40"
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cx"
                values="800;820;800"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          <g filter="url(#glow)">
            <circle cx="300" cy="300" r="5" fill="#60a5fa" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="5;7;5"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          <path
            d="M0,100 Q250,50 500,100 T1000,100 V1000 H0 Z"
            fill="url(#grad2)"
          >
            <animate
              attributeName="d"
              values="M0,100 Q250,50 500,100 T1000,100 V1000 H0 Z;
                      M0,100 Q250,150 500,100 T1000,100 V1000 H0 Z;
                      M0,100 Q250,50 500,100 T1000,100 V1000 H0 Z"
              dur="20s"
              repeatCount="indefinite"
            />
          </path>

          <g className="hidden lg:block">
            <polygon
              points="850,80 870,120 830,120"
              fill="#60a5fa"
              opacity="0.3"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,20; 0,0"
                dur="4s"
                repeatCount="indefinite"
              />
            </polygon>
            <rect
              x="100"
              y="600"
              width="40"
              height="40"
              fill="#3b82f6"
              opacity="0.2"
              transform="rotate(45 120 620)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="45 120 620; 90 120 620; 45 120 620"
                dur="6s"
                repeatCount="indefinite"
              />
            </rect>
          </g>

          <g filter="url(#glow)">
            <circle cx="700" cy="500" r="4" fill="#93c5fd" opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.6;0.3;0.6"
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="4;6;4"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="150" cy="700" r="3" fill="#60a5fa" opacity="0.7">
              <animate
                attributeName="opacity"
                values="0.7;0.4;0.7"
                dur="3.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values="3;5;3"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>

        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 via-transparent to-gray-300 opacity-40"></div>
        <div className="absolute inset-0 bg-radial-gradient from-gray-100 to-transparent opacity-25"></div>
      </div>

      <LandingHeaderSection
        isMenuOpen={false}
        toggleMenu={() => {}}
        scrollToSection={() => {}}
        isLandingPage={true}
        isTransparent={!isScrolled}
        isScrolled={isScrolled}
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {blog && blog.length > 0 ? (
          <div>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 cursor-pointer"
              onClick={() => router.push(`/blog/${blog[0].attributes.slug}`)}
            >
              <div className="relative h-64 md:h-full">
                <Image
                  alt={blog[0].attributes.title}
                  src={blog[0].attributes.cover.data.attributes.url}
                  width={1000}
                  height={500}
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-center p-6 space-y-4">
                <p className="text-sm text-gray-700 font-semibold">
                  {new Date(blog[0].attributes.createdAt).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </p>
                <h2 className="text-3xl font-bold text-gray-900">
                  {blog[0].attributes.title}
                </h2>
                <p className="text-gray-800 leading-relaxed">
                  {blog[0].attributes.description}
                </p>
                <p className="text-gray-800 leading-relaxed">
                  By {blog[0].attributes.author.data.attributes.name}
                </p>
              </div>
            </div>
            <div className="mt-20 flex flex-col gap-10 items-center justify-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Explore Blogs
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  className={`${
                    selectedCategory === "all" ? "bg-blue-600" : "bg-gray-500"
                  } hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out outline-none`}
                  onClick={() => {
                    setSelectedCategory("all");
                    getBlogData();
                  }}
                >
                  All
                </button>
                {categoryList.map((category) => (
                  <button
                    key={category.id}
                    className={`${
                      selectedCategory === category.attributes.slug
                        ? "bg-blue-600"
                        : "bg-gray-500"
                    } hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out outline-none`}
                    onClick={() => {
                      setSelectedCategory(category.attributes.slug);
                      getBlogDataByCategory(category.attributes.slug);
                    }}
                  >
                    {category.attributes.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
              {categroyBlogData.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => router.push(`/blog/${post.attributes.slug}`)}
                >
                  <div className="relative h-48">
                    <Image
                      alt={post.attributes.title}
                      src={post.attributes.cover.data.attributes.url}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.attributes.title}
                    </h3>
                    <p className="text-gray-800 mb-4 line-clamp-3">
                      {post.attributes.description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-700">
                      <p>{post.attributes.author.data.attributes.name}</p>
                      <p>
                        {new Date(post.attributes.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
              <div className="bg-gray-300 h-64 md:h-full rounded-lg"></div>
              <div className="flex flex-col justify-center p-6 space-y-4">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
            <div className="mt-20 flex flex-col gap-10 items-center justify-center">
              <div className="h-8 bg-gray-300 rounded w-1/4"></div>
              <div className="flex flex-wrap gap-3 justify-center">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="h-10 w-20 bg-gray-300 rounded-md"
                  ></div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="bg-gray-300 h-48"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <LandingFooterSection scrollToSection={() => {}} />
    </div>
  );
};

export default Blog;
