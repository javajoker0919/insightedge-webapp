import Link from "next/link";
import Image from "next/image";

import { userMetadataAtom } from "@/utils/atoms";
import { useAtomValue } from "jotai";

interface LogoProps {
  onClick?: () => void;
  withIcon?: boolean;
}

const Logo: React.FC<LogoProps> = ({ onClick, withIcon }) => {
  const userMetadata = useAtomValue(userMetadataAtom);

  return (
    <Link
      href={userMetadata == null ? "/" : "/app"}
      onClick={onClick}
      className="flex items-center"
    >
      {withIcon && (
        <Image src="/favicon.png" alt="Favicon" width={40} height={40} />
      )}

      <Image
        src={"/logo.png"}
        alt={"Logo"}
        width={200}
        height={40}
        priority={true}
        className="w-auto max-w-52"
      />
    </Link>
  );
};

export default Logo;
