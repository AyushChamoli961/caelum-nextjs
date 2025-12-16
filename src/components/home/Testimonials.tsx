"use client";

import { useState, useEffect, useCallback } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const testimonials = [
    {
      name: "Kyle and Zayne Nariman's Parents",
      text: "Our experience with Caelum High School has far exceeded our expectations. The dedicated educators, comprehensive curriculum, and nurturing environment have greatly contributed to our children's growth. The school's commitment to academic excellence and character development is truly commendable, leaving a positive impact on our children's education and overall development.",
    },
    {
      name: "Reia Rathod's Father",
      text: "Caelum High School's commitment to holistic student development is commendable. Expert staff fosters a nurturing learning environment. State-of-the-art facilities encourage potential exploration. Well-organized extracurriculars like annual events provide diverse opportunities for skill growth. The holistic approach nurtures capable, confident individuals, excelling academically and embracing the future.",
    },
    {
      name: "Sarrah Dhariwal's Father",
      text: "Our daughter Sarrah, part of Caelum High since preschool, has grown from toddler to confident teen with equal opportunities in academics and extracurriculars. Caelum's shaping of her character fuels her strides into high school, embodying the school's legacy. Our appreciation knows no bounds.",
    },
    {
      name: "Mannan & Ryka Marhatta's Father",
      text: "Caelum High is a wonderful school; we admitted our elder one first, and over the years saw brilliant nurturing for his future. So, admitting the younger one was an easy choice. Caelum truly lives its happy school ideology, providing equal opportunities for academics and holistic development. Certainly the best school!",
    },
    {
      name: "Yash and Chintan Dhoka's Parents",
      text: "Our kids enjoyed their schooling. Thanks to '#thehappyschool'. Perfect harmony of hardware (school infrastructure) and software (school teachers) to help groom children into respectable human beings.",
    },
  ];

  useEffect(() => {
    const updateMobileView = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    updateMobileView();
    window.addEventListener("resize", updateMobileView);
    return () => window.removeEventListener("resize", updateMobileView);
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex + (isMobile ? 1 : 2) >= (isMobile ? 3 : testimonials.length)
        ? 0
        : prevIndex + (isMobile ? 1 : 2)
    );
  }, [isMobile, testimonials.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? isMobile
          ? 2
          : testimonials.length - (isMobile ? 1 : 2)
        : prevIndex - (isMobile ? 1 : 2)
    );
  }, [isMobile, testimonials.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [handleNext]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
  };

  return (
    <div>
      <div className="py-8 px-6 lg:px-0">
        <h3 className="text-center text-3xl font-bold text-color3 mb-8">
          Parents&apos; Testimonies
        </h3>
        <div className="container mx-auto">
          <div className="flex justify-center space-x-12 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              {testimonials
                .slice(currentIndex, currentIndex + (isMobile ? 1 : 2))
                .map((testimonial, index) => (
                  <motion.div
                    key={`${testimonial.name}-${index}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 80, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="w-[550px] h-[380px] max-w-md bg-white shadow-lg border-2 border-color1 rounded-lg p-6 flex flex-col justify-between"
                  >
                    <h4 className="text-xl font-bold text-gray-800 mb-4">
                      {testimonial.name}
                    </h4>

                    <p className="text-gray-600 italic flex-grow overflow-hidden text-ellipsis whitespace-normal flex">
                      <span className="flex items-start">
                        <span className="text-yellow-500 text-3xl mr-2">
                          <ImQuotesLeft />
                        </span>
                      </span>
                      <span className="flex-grow">{testimonial.text}</span>
                      <span className="flex items-end">
                        <span className="text-yellow-500 text-3xl ml-2">
                          <ImQuotesRight />
                        </span>
                      </span>
                    </p>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center mt-6">
            <button onClick={handlePrev} className="text-color10 text-2xl mr-4">
              <FaArrowLeft />
            </button>

            <div className="flex space-x-2">
              {Array.from({
                length: Math.ceil(
                  (isMobile ? 3 : testimonials.length) / (isMobile ? 1 : 2)
                ),
              }).map((_, index) => (
                <span
                  key={index}
                  className={`h-3 w-3 rounded-full ${
                    index === Math.floor(currentIndex / (isMobile ? 1 : 2))
                      ? "bg-black"
                      : "bg-gray-300"
                  }`}
                ></span>
              ))}
            </div>

            <button onClick={handleNext} className="text-color10 text-2xl ml-4">
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
