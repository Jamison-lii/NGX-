import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import ProjectCard from '../../Components/Project/ProjectCard';
import GalleryCard from '../../Components/Project/GalleryCard';

const Projects = () => {
  const [tab, setTab] = useState('Projects')

  const handleTabChange = (newTab) => {
    setTab(newTab);
  }
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-8">
      {/* Top bar with filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        {/* Left side (Projects + Gallery) */}
        <div className="flex font-Inter space-x-4">
          <button onClick={()=>{handleTabChange('Projects')}}  className={`${tab === 'Projects'? "bg-[#ECF0FC]": "bg-white"} text-[#474747] px-4 py-1 rounded-2xl text-sm sm:text-base`}>
            Projects
          </button>
          <button onClick={()=>{handleTabChange('Gallery')}} className={`${tab === 'Gallery'? "bg-[#ECF0FC]": "bg-white"} text-[#474747] px-4 py-1 rounded-2xl text-sm sm:text-base`}>
            Gallery
          </button>
        </div>

        {/* Right side (Filter) */}
        <div className="text-[#474747] font-Inter font-semibold flex text-sm sm:text-base cursor-pointer space-x-1">
          <Filter className="w-4 h-5 " />
          <span>Filter</span>
        </div>
      </div>

      
      <div className="mt-8">
       
        {tab === 'Projects' ? (
        <ProjectCard /> ) : (<GalleryCard />)}
      </div>

    </div>
  );
};

export default Projects;
