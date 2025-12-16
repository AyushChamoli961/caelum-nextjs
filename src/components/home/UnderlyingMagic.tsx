"use client";

import { useState } from "react";

const UnderlyingMagic = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const caelumWayContent = [
    "The Caelum Way is a commitment to changing education. We believe that every child deserves nurturing support and recognition of their talents and interests so that they can be strong in all those areas. Our approach integrates high academic standards with emotional and social development so that students are prepared not only for the academic challenges that lie ahead but for life itself.",
    "The Caelum Way positions children at the heart of their learning journey, empowering them to be curious, confident, and creative thinkers. Through our schools, we hope to help foster leaders, innovators, and compassionate citizens who will shape a better tomorrow.",
    "Creating an ecosystem for children to grow is what the Caelum Way is about, but it's also a proven business model with scalability and results. The curriculum design, infrastructure setting, marketing, and even operational support are all turnkey solutions that enable our franchisees to concentrate on delivering quality education and driving growth. With a strong brand, all-round support, and an innovative approach to education, the Caelum Way guarantees high profitability and long-term success for investors.",
  ];

  return (
    <div className="pt-12 px-6 lg:px-0">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-20">
        {/* Left Column - Paragraphs */}
        <div className="w-full lg:w-1/2 space-y-6">
          <p className="text-color3 text-left">{caelumWayContent[0]}</p>
          <button
            className="bg-color1 text-color3 px-8 py-2 lg:px-12 rounded-lg font-semibold"
            onClick={() => setIsModalOpen(true)}
          >
            Read More
          </button>
        </div>
        {/* Right Column - Headings (Aligned in the middle) */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center h-full">
          <h3 className="text-3xl lg:text-4xl font-bold text-color3">
            The Caelum Way
          </h3>
          <h3 className="text-2xl lg:text-3xl italic text-color3 mt-6 self-center lg:self-start">
            Underlying Magic
          </h3>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-color3 mb-4">
              The Caelum Way - Underlying Magic
            </h2>
            {caelumWayContent.map((content, index) => (
              <p key={index} className="text-color3 mb-4">
                {content}
              </p>
            ))}
            <button
              className="bg-color1 text-color3 px-8 py-2 rounded-lg font-semibold mt-4"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 border-b-2 border-color1"></div>
    </div>
  );
};

export default UnderlyingMagic;
