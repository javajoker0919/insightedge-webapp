"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LandingHeaderSection from "../components/landing/Header";

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

  useEffect(() => {
    getBlogData();
    getCategoryList();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <LandingHeaderSection isHeaderVisible={true} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {blog && blog.length > 0 && (
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
                <p className="text-sm text-gray-500 font-semibold">
                  {new Date(blog[0].attributes.createdAt).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {blog[0].attributes.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {blog[0].attributes.description}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By {blog[0].attributes.author.data.attributes.name}
                </p>
              </div>
            </div>
            <div className="mt-20 flex flex-col gap-10 items-center justify-center">
              <h2 className="text-3xl font-bold text-gray-800">
                Explore Blogs
              </h2>
              <div className="flex flex-row gap-3">
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
                {categoryList.map((category) => {
                  return (
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
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
              {categroyBlogData.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/blog/${post.attributes.slug}`)}
                >
                  <div className="relative h-48">
                    <Image
                      alt={post.attributes.title}
                      src={post.attributes.cover.data.attributes.url}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {post.attributes.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.attributes.description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
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
        )}
      </div>
    </div>
  );
};

export default Blog;
