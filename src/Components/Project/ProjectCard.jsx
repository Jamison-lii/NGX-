import React from 'react';
import img1 from "../../assets/Photo's/img1.jpeg";

const ProjectCard = () => {
  return (
    <div className="w-full font-Inter bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <img
        src={img1}
        alt="Children Outreach"
        className="w-full h-85 object-cover rounded-t-xl"
      />

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="font-semibold text-lg text-gray-800">
          Children Outreach
        </div>
        <p className="text-sm text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Quia ipsa illum aliquam veniam quae odit! Nihil dignissimos
          maiores veniam eos cupiditate enim, explicabo doloremque!
          Vel maiores sapiente inventore dolor eaque?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Quos ullam expedita ducimus non voluptas tempore
          , ipsum id vitae eaque minima harum repudiandae nulla amet, 
          in dolore numquam odio rerum et?
        </p>
      </div>
       <div className="w-full flex justify-center ">
          <button className="text-sm text-gray-500 pb-2 hover:text-blue-600 transition-colors duration-200">
           See More
           </button>
       </div>
    </div>
  );
};

export default ProjectCard;
