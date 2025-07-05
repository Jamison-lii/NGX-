import React from 'react';
import img1 from "../../assets/Photo's/img1.jpeg";
import { projects } from '../../Constants/constants';

const ProjectCard = () => {
  return (
projects.map((project, index) => (
    <div key={index} className="w-full mb-6 font-Inter bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}

      <img
        src={project.image}
        alt={project.title}
        className="w-full h-85 object-cover rounded-t-xl"
      />

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="font-semibold text-lg text-gray-800">
          {project.title}
        </div>
        <p className="text-sm text-gray-600">
          {project.description}
        </p>
      </div>
       <div className="w-full flex justify-center ">
          <button className="text-sm text-gray-500 pb-2 hover:text-blue-600 transition-colors duration-200">
           See More
           </button>
       </div>
    </div>))
  );
};

export default ProjectCard;
