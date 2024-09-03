"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import LandingHeaderSection from "@/app/components/landing/Header";
import BlockRendererClient from "@/app/components/BlockRenderClient";
import Loading from "@/app/components/Loading";

interface BlogPost {
  title: string;
  description: string;
  body: Array<any>;
  cover: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  createdAt: string;
}

const Blog = () => {
  const { id: blogID } = useParams<{ id: string }>();
  const [blogData, setBlogData] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      setIsLoading(true);
      try {
        const strapiUrl =
          process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
        if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
          console.warn(
            "STRAPI_URL is not defined in the environment variables. Using default: http://localhost:1337"
          );
        }
        const res = await fetch(
          `${strapiUrl}/api/blogs/?filters\[slug][$eq]=${blogID}&populate=*`
        );
        if (!res.ok) throw new Error("Failed to fetch blog data");

        const { data } = await res.json();
        setBlogData(data[0].attributes);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching the blog post"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, [blogID]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {error}
      </div>
    );
  if (!blogData)
    return (
      <div className="flex justify-center items-center h-screen">
        No blog post found
      </div>
    );

  return (
    <div className="w-full">
      <LandingHeaderSection />
      <div className="flex max-w-3xl mx-auto px-4 py-8">
        <article className="prose lg:prose-xl">
          <h1 className="text-4xl font-bold mb-4">{blogData.title}</h1>
          <div className="mb-8">
            <Image
              src={blogData.cover.data.attributes.url}
              alt={blogData.title}
              width={1000}
              height={500}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="text-gray-600 mb-8">
            <span>
              Published on {new Date(blogData.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="text-gray-800 leading-relaxed">
            <BlockRendererClient content={blogData.body} />
          </div>
        </article>
      </div>
    </div>
  );
};

export default Blog;
