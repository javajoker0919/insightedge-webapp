import Link from "next/link";
import Image from "next/image";

const Logo: React.FC = () => {
  return (
    <Link href={`/app`}>
      <Image
        src={"/logo.png"}
        alt={"ProspectEdge"}
        width={200}
        height={40}
        className="max-w-[150px] sm:max-w-[200px]"
      />
    </Link>
  );
};

export default Logo;
