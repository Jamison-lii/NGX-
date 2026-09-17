
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  MapPin,
  ImagePlus,
} from "lucide-react";
import { projects as staticProjects } from "../../Constants/constants";

const WORKER_URL = import.meta.env.WORKER_URL;

const ProjectCard = ({ apiProjects }) => {
  const displayProjects =
    apiProjects && apiProjects.length > 0
      ? apiProjects
      : staticProjects;

  const cardVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <>
      {displayProjects.map((project, index) => (
        <ProjectCardItem
          key={project.id || index}
          project={project}
          cardVariants={cardVariants}
        />
      ))}
    </>
  );
};

function ProjectCardItem({ project, cardVariants }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;

    const loadProjectImage = async () => {
      // ------------------------------------------------
      // STATIC PROJECT
      // ------------------------------------------------

      if (!project?.image_file_key) {
        if (!cancelled) {
          setImageUrl(project?.image || null);
          setImageLoading(false);
          setImageError(false);
        }

        return;
      }

      // ------------------------------------------------
      // API PROJECT WITH R2 IMAGE
      // ------------------------------------------------

      setImageLoading(true);
      setImageError(false);
      setImageUrl(null);

      try {
        const response = await fetch(
          `${WORKER_URL}/public/projects/${project.id}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load project image: ${response.status}`
          );
        }

        const blob = await response.blob();

        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setImageUrl(objectUrl);
        }
      } catch (error) {
        console.error(
          "Project image loading error:",
          error
        );

        if (!cancelled) {
          setImageError(true);
        }
      } finally {
        if (!cancelled) {
          setImageLoading(false);
        }
      }
    };

    loadProjectImage();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [
    project?.id,
    project?.image_file_key,
    project?.image,
  ]);

  const getProjectDate = () => {
    if (
      project?.start_date &&
      project?.end_date
    ) {
      return `${project.start_date} - ${project.end_date}`;
    }

    if (project?.date) {
      return project.date;
    }

    return "2024";
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      viewport={{ once: true }}
      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100"
    >
      {/* Image Container */}

      <div className="relative h-72 overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : imageLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-[#4169E1]" />
          </div>
        ) : imageError ? (
          <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">
            <ImagePlus
              size={48}
              strokeWidth={1.5}
            />

            <span className="mt-2 text-xs text-slate-400">
              Image unavailable
            </span>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImagePlus
              size={48}
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* Overlay Gradient */}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Category Badge */}

        <div className="absolute left-5 top-5">
          <span className="rounded-full bg-white/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#4169E1] shadow-sm backdrop-blur-md">
            {project.category || "Field Work"}
          </span>
        </div>
      </div>

      {/* Content */}

      <div className="flex flex-grow flex-col p-8">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-[#4169E1]">
            {project.title}
          </h3>

          <div className="translate-y-2 text-[#4169E1] opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={24} />
          </div>
        </div>

        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-500">
          {project.description}
        </p>

        {/* Project Metadata */}

        <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6 text-slate-400">
          <div className="flex items-center gap-2 text-xs font-medium">
            <Calendar
              size={14}
              className="text-[#4169E1]"
            />

            <span>
              {getProjectDate()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium">
            <MapPin
              size={14}
              className="text-[#4169E1]"
            />

            <span>
              {project.location || "Global"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Hover Bar */}

      <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transform bg-[#4169E1] transition-transform duration-500 group-hover:scale-x-100" />
    </motion.div>
  );
}

export default ProjectCard;

