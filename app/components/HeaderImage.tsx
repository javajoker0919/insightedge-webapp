import Image from "next/image";
import Link from "next/link";

const HeaderImage = () => {
  return (
    <>
      <Link href="/">
        <div className="flex items-center absolute top-4 left-4">
          <Image
            src="/favicon.png"
            alt="ProspectEdge Logo"
            width={40}
            height={40}
          />
          <Image src="/logo.png" alt="ProspectEdge" width={200} height={40} />
        </div>
      </Link>
    </>
  );
};

export default HeaderImage;
