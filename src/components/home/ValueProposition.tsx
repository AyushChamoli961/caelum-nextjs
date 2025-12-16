"use client";

import { useState } from "react";
import Image from "next/image";
import "./ValueProposition.css";

const ValueProposition = () => {
  const [flippedCards, setFlippedCards] = useState(Array(8).fill(false));

  const handleFlip = (index: number) => {
    const newFlipped = [...flippedCards];
    newFlipped[index] = !newFlipped[index];
    setFlippedCards(newFlipped);
  };

  const cardData = [
    {
      title: "Infrastructure & Ambience Design",
      image: "/assets/home/infrastructure.png",
      content:
        "Our schools are designed to inspire. From the C-shape structure, natural lighting emphasis, and ergonomic seating, every detail at Caelum schools promotes well-being and intellectual curiosity.",
    },
    {
      title: "Furniture & Equipment",
      image: "/assets/home/furniture.png",
      content:
        "Caelum provides franchisees with child-friendly furniture and state-of-the-art educational tools. From smartboards to sensory play equipment, everything is designed to enhance learning.",
    },
    {
      title: "Researched Curriculum",
      image: "/assets/home/researched_planner.png",
      content:
        "Our curriculum is a result of years of research in early childhood development and educational psychology, balancing academics with social and emotional learning.",
    },
    {
      title: "Teaching Aids",
      image: "/assets/home/teacher_aids.png",
      content:
        "We offer comprehensive teaching aids, including educational games, visual aids, and hands-on learning kits, making lessons engaging and interactive.",
    },
    {
      title: "School Management Training",
      image: "/assets/home/school_management.png",
      content:
        "We provide in-depth management training covering administrative processes, leadership strategies, and operational efficiencies for effective school management.",
    },
    {
      title: "Teacher's Training",
      image: "/assets/home/teachers_training.png",
      content:
        "Caelum's teacher training programs offer certified workshops, one-on-one guidance, and modern learning tools to keep educators at the forefront of innovation.",
    },
    {
      title: "Operational & Marketing Support",
      image: "/assets/home/operational_management.png",
      content:
        "We offer ongoing operational and marketing support, including strategies for admissions, student retention, and daily operations to ensure sustainable school growth.",
    },
    {
      title: "Lead Management Support",
      image: "/assets/home/lead_management.png",
      content:
        "We provide lead management support to streamline admissions, track inquiries, and maximize enrollment conversion rates using advanced CRM tools.",
    },
  ];

  return (
    <div className="pt-8 px-6 lg:px-0">
      <h3 className="text-center text-3xl font-bold text-color3 mb-8">
        Value Proposition
      </h3>
      <div className="container mx-auto grid grid-cols-2 gap-8 md:grid-cols-4">
        {cardData.map((item, index) => (
          <div
            key={index}
            className={`flip-card ${flippedCards[index] ? "flipped" : ""}`}
            onClick={() => handleFlip(index)}
          >
            <div className="flip-card-inner">
              {/* Front Side */}
              <div className="flip-card-front">
                <div
                  className="flex flex-col items-center"
                  style={{ height: "178px" }}
                >
                  <div
                    className="bg-white p-4"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.20) 4px 4px 2.6px" }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="w-20 h-20"
                    />
                  </div>
                  <h4
                    className={`text-center text-sm lg:text-lg font-bold text-color3 mt-4 w-full break-words ${
                      item.title === "Teacher's Training"
                        ? "max-w-[170px]"
                        : "max-w-[200px]"
                    }`}
                  >
                    {item.title}
                  </h4>
                </div>
              </div>

              {/* Back Side */}
              <div className="flip-card-back">
                <p className="text-[9px] md:text-base lg:text-base">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 border-b-2 border-color1"></div>
    </div>
  );
};

export default ValueProposition;
