import Link from "next/link";
import Image from "next/image";

import { userMetadataAtom } from "@/utils/atoms";
import { useAtomValue } from "jotai";

interface LogoProps {
  withIcon?: boolean;
}

const Logo: React.FC<LogoProps> = ({ withIcon }) => {
  const userMetadata = useAtomValue(userMetadataAtom);

  return (
    <Link
      href={userMetadata == null ? "/" : "/app"}
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
        // className="max-w-[150px] sm:max-w-[200px]"
      />
    </Link>
  );
};

export default Logo;
