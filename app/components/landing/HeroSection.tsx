const LandingHeroSection = () => {
  return (
    <section
      id="hero"
      className="pt-20 sm:pt-32 md:pt-40 pb-12 sm:pb-16 px-4 gap-6 sm:gap-8 md:gap-10 flex flex-col items-center"
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-tight sm:leading-snug md:leading-[1.4] font-bold text-center text-neutral-900 max-w-[994px] px-2 sm:px-5">
        Transform earnings transcripts and press releases to Sales & Marketing
        opportunities
        <span className="text-primary-500"> tailored to your offerings</span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-center font-normal leading-relaxed sm:leading-loose md:leading-9 max-w-3xl mx-auto text-neutral-500 px-2 sm:px-4">
        Discover your key account's mission critical projects, challenges & pain
        points and optimize your sales and marketing approach
      </p>
      <div className="flex flex-col items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
        <a
          href="/auth/sign-up"
          className="px-6 sm:px-8 md:px-10 py-2 sm:py-3 text-lg sm:text-xl md:text-2xl font-normal rounded-full border bg-primary-500 border-primary-500 text-white hover:bg-primary-600 transition-colors duration-300"
        >
          Try for free
        </a>
        <p className="text-sm sm:text-base leading-5 sm:leading-6 font-normal text-[#9B9C9DFF]">
          Signup For Free. No card required.
        </p>
      </div>
    </section>
  );
};

export default LandingHeroSection;
