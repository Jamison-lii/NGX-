import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added Framer Motion
import { Filter } from 'lucide-react';
import ProjectCard from '../../Components/Project/ProjectCard';
import GalleryCard from '../../Components/Project/GalleryCard';

const Projects = () => {
  const [tab, setTab] = useState('Projects');

  const tabs = ['Projects', 'Gallery'];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-12">
      {/* Top bar with filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 border-b border-slate-100 pb-6">
        
        {/* Left side: Tab Buttons with Animated Background */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl relative">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-8 py-2 text-sm sm:text-base font-semibold transition-colors duration-300 z-10 ${
                tab === t ? 'text-[#4169E1]' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
              {/* This is the sliding background pill */}
              {tab === t && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white rounded-[14px] shadow-sm z-[-1]"
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Right side (Filter) */}
       
      </div>

      {/* Content Area with Fade/Slide Transition */}
      <div className="mt-12 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab} // Key is essential for Framer Motion to know when to switch
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {tab === 'Projects' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* I'm assuming you have multiple cards; if the component handles its own grid, just keep <ProjectCard /> */}
                <ProjectCard /> 
              </div>
            ) : (
              
                <GalleryCard />
            
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Projects;