"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface blogType {
  title: string;
  description: string;
}

const Blog = () => {
  const { id: blogID } = useParams<{ id: string }>();
  const [blogData, setBlogData] = useState<blogType>({
    title: "",
    description: ""
  });

  const [blogImage, setBlogImage] = useState<string>("");

  const getBlogDataByID = async () => {
    const strapiUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const res = await fetch(`${strapiUrl}/api/blogs/${blogID}?populate=*`);
    const posts = await res.json();
    if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
      console.warn(
        "STRAPI_URL is not defined in the environment variables. Using default: http://localhost:1337"
      );
    }
    setBlogData(posts.data.attributes);
    setBlogImage(posts.data.attributes.cover.data.attributes.url);
  };

  useEffect(() => {
    getBlogDataByID();
  }, [blogID]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <article className="prose lg:prose-xl">
        <h1 className="text-4xl font-bold mb-4">{blogData.title}</h1>
        <div className="mb-8">
          <Image
            src={blogImage}
            alt={blogData.title}
            width={1000}
            height={500}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="text-gray-600 mb-8">
          {/* Add author and date information here if available */}
          <span>Published on {new Date().toLocaleDateString()}</span>
        </div>
        <div
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blogData.description }}
        />
      </article>
    </div>
  );
};

export default Blog;
