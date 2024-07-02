import Image from "next/image";

const Hero = () => {
  return (
    <div className=" ">
      <Image
        className="rounded-xl"
        src={`https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/hero.jpg`}
        height={600}
        width={1216}
        alt="hero section image"
      />
      <div className="absolute flex flex-col gap-4 p-8 bg-slate-50 w-[550px] h-[280px] top-[540px] ml-32 rounded-xl border border-slate-500">
        <div className="px-3 py-1 bg-pink-500 rounded-lg text-xs text-white w-fit">
          Technology
        </div>

        <div className="text-4xl font-bold leading-10">
          The Impact of Technology on the Workplace: How Technology is Changing
        </div>
        <div className="flex flex-row gap-4 place-items-center items-center">
          <Image
            className="rounded-full"
            src="https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/avatar.png"
            height={40}
            width={40}
            alt="avatar"
          />
          <span className="text-base text-gray-400 font-semibold">
            LockStar Developer
          </span>
          <span className="pl-4 text-base text-gray-400 font-semibold">
            July 26, 2024
          </span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
