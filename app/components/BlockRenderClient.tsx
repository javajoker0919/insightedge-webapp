"use client";
import Image from "next/image";

import {
  BlocksRenderer,
  type BlocksContent
} from "@strapi/blocks-react-renderer";

export default function BlockRendererClient({
  content
}: {
  readonly content: BlocksContent;
}) {
  if (!content) return null;
  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => {
          return (
            <div className="my-8">
              <Image
                src={image.url}
                width={image.width}
                height={image.height}
                alt={image.alternativeText || ""}
                className="rounded-lg shadow-md mx-auto"
              />
              {image.caption && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  {image.caption}
                </p>
              )}
            </div>
          );
        },
        heading: ({ children, level }) => {
          const Tag = `h${level}` as keyof JSX.IntrinsicElements;
          const styles = {
            h1: "text-4xl font-bold mb-6 mt-12",
            h2: "text-3xl font-bold mb-5 mt-10",
            h3: "text-2xl font-bold mb-4 mt-8",
            h4: "text-xl font-bold mb-3 mt-6",
            h5: "text-lg font-bold mb-2 mt-4",
            h6: "text-base font-bold mb-2 mt-4"
          };
          return <Tag className={styles[`h${level}`]}>{children}</Tag>;
        },
        paragraph: ({ children }) => {
          return (
            <p className="text-lg mb-6 leading-relaxed text-gray-800">
              {children}
            </p>
          );
        },
        list: ({ children, format }) => {
          const ListTag = format === "ordered" ? "ol" : "ul";
          return (
            <ListTag className="list-inside mb-6 ml-6 text-lg text-gray-800">
              {children}
            </ListTag>
          );
        },
        quote: ({ children }) => {
          return (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6 text-xl text-gray-700">
              {children}
            </blockquote>
          );
        },
        code: ({ children }) => {
          return (
            <pre className="bg-gray-100 rounded-md p-4 overflow-x-auto my-6">
              <code className="text-sm">{children}</code>
            </pre>
          );
        }
      }}
    />
  );
}