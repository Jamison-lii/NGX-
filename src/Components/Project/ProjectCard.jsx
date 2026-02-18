import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import { projects as staticProjects } from '../../Constants/constants';

// We pass "apiProjects" as a prop. If it's empty, it uses the static constants.
const ProjectCard = ({ apiProjects }) => {
  const displayProjects = apiProjects && apiProjects.length > 0 ? apiProjects : staticProjects;

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -10, transition: { duration: 0.3 } }
  };

  return (
    <>
      {displayProjects.map((project, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          initial="initial"
          whileInView="animate"
          whileHover="hover"
          viewport={{ once: true }}
          className="group relative flex flex-col bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500"
        >
          {/* Image Container */}
          <div className="relative h-72 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Category/Status Badge */}
            <div className="absolute top-5 left-5">
              <span className="bg-white/90 backdrop-blur-md text-[#4169E1] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                {project.category || 'Field Work'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-[#4169E1] transition-colors">
                {project.title}
              </h3>
              <div className="text-[#4169E1] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <ArrowUpRight size={24} />
              </div>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
              {project.description}
            </p>

            {/* Project Metadata - Makes it look "Official" */}
            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2 text-xs font-medium">
                <Calendar size={14} className="text-[#4169E1]" />
                <span>{project.date || '2024'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                <MapPin size={14} className="text-[#4169E1]" />
                <span>{project.location || 'Global'}</span>
              </div>
            </div>
          </div>

          {/* Hidden "See More" - Reveals on hover as a bar at the bottom */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#4169E1] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </motion.div>
      ))}
    </>
  );
};

export default ProjectCard;