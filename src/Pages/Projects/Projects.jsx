import React from 'react';
import { Filter } from 'lucide-react';

const Projects = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-8">
      {/* Top bar with filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        {/* Left side (Projects + Gallery) */}
        <div className="flex font-Inter space-x-4">
          <button className="bg-[#ECF0FC] text-[#474747] px-4 py-1 rounded-2xl text-sm sm:text-base">
            Projects
          </button>
          <button className="bg-[#ECF0FC] text-[#474747] px-4 py-1 rounded-2xl text-sm sm:text-base">
            Gallery
          </button>
        </div>

        {/* Right side (Filter) */}
        <div className="text-[#474747] font-Inter font-semibold flex text-sm sm:text-base cursor-pointer space-x-1">
          <Filter className="w-4 h-5 " />
          <span>Filter</span>
        </div>
      </div>

      {/* Add your project/gallery grid here */}
      <div className="mt-8">
        {/* Responsive grid goes here */}
      </div>
    </div>
  );
};

export default Projects;
