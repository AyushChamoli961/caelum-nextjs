const teamMembers = [
  {
    name: "Member 1",
    designation: "Designation",
    image: "/assets/home/member1.jpg",
  },
  {
    name: "Member 2",
    designation: "Designation",
    image: "/assets/home/member2.jpg",
  },
  {
    name: "Member 3",
    designation: "Designation",
    image: "/assets/home/member3.jpg",
  },
  {
    name: "Member 4",
    designation: "Designation",
    image: "/assets/home/member4.jpg",
  },
];

const MeetTheTeam = () => {
  return (
    <div>
      <div className="pt-8 px-6 lg:px-0">
        <h3 className="text-center text-3xl font-bold text-color3 mb-4">
          Meet the Team
        </h3>
        <div className="container mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Image Container */}
              <div
                className="w-full h-52 lg:h-96 bg-gray-300 rounded-t-lg"
                style={{
                  backgroundImage: `url(${member.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>

              {/* Name & Designation */}
              <div className="w-full bg-white text-center shadow-lg border-b-4 border-l-4 border-r-4 rounded-b-lg border-color1 py-4">
                <h4 className="text-lg font-bold text-color3">{member.name}</h4>
                <p className="text-lg text-color3 -mt-1">
                  {member.designation}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-color3 mt-8">
          Caelum&apos;s leadership team is made up of visionaries who are
          passionate about redefining education. With decades of combined
          experience in education management, psychology, curriculum design, and
          school operations, our team brings expertise, innovation, and a
          relentless commitment to excellence.
        </p>
        <p className="text-center text-color3 mt-8">
          Caelum people are visionaries, inventors, and changemakers guided by a
          common mission: educational experiences that have a transformative
          effect on the students&apos; lives and their community.
        </p>
        <div className="mt-12 border-b-2 border-color1"></div>
      </div>
    </div>
  );
};

export default MeetTheTeam;
