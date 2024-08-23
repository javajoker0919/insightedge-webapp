import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";

const HeaderImage = () => {
  return (
    <div className="flex items-center absolute top-4 left-4 z-20">
      <Link href="/app">
        <Image
          src="/favicon.png"
          alt="ProspectEdge Logo"
          width={40}
          height={40}
        />
      </Link>
      <Logo />
    </div>
  );
};

export default HeaderImage;
