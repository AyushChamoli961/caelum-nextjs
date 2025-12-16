"use client";

const Hero = () => {
  return (
    <div className="relative">
      {/* Hero Section with Background Video */}
      <div className="relative h-[700px] w-full px-10 overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        >
          <source src="/assets/home/Homepage Video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Content */}
        <div className="flex items-center w-full h-full justify-end relative z-10">
          <div className="w-[390px] flex-col gap-4 items-center justify-center hidden lg:flex">
            <h2 className="text-4xl text-white font-bold text-left">
              Reimagining Education: Where Curiosity Meets Growth
            </h2>
            <p className="text-xl text-white">
              Nurturing Young Minds, Building Lasting Success: The Future of
              Education, Today
            </p>
            <button className="text-xl font-semibold w-full text-color3 bg-color1 py-2 px-4 rounded-lg">
              What Makes Us Different
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View (Without Video) */}
      <div className="flex w-full justify-center py-10 lg:hidden">
        <div className="w-[450px] px-4 flex flex-col gap-4 items-center">
          <h2 className="text-4xl font-bold">
            Reimagining Education: Where Curiosity Meets Growth
          </h2>
          <p className="text-xl">
            Nurturing Young Minds, Building Lasting Success: The Future of
            Education, Today
          </p>
          <button className="text-xl font-semibold bg-color1 py-2 px-4 rounded-lg">
            What Makes Us Different
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
