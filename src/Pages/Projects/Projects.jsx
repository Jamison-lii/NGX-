import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "../../Components/Project/ProjectCard";
import GalleryCard from "../../Components/Project/GalleryCard";
import { supabase } from "../../lib/supabase";

const Projects = () => {
  const [tab, setTab] = useState("Projects");

  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);

  const [loadingProjects, setLoadingProjects] =
    useState(true);

  const [loadingGallery, setLoadingGallery] =
    useState(true);

  const tabs = ["Projects", "Gallery"];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);

      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, title, description, start_date, end_date, image_file_name, image_file_key, image_file_type"
        )
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Failed to fetch projects:",
          error
        );

        setProjects([]);
      } else {
        setProjects(data || []);
      }

      setLoadingProjects(false);
    };

    const fetchGallery = async () => {
      setLoadingGallery(true);

      const { data, error } = await supabase
        .from("gallery")
        .select(
          "id, title, type, file_name, file_key, file_type, file_size, created_at"
        )
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Failed to fetch gallery:",
          error
        );

        setGallery([]);
      } else {
        setGallery(data || []);
      }

      setLoadingGallery(false);
    };

    fetchProjects();
    fetchGallery();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-20">
      {/* Top bar with filters */}
      <div className="flex flex-col items-start justify-between space-y-6 border-b border-slate-100 pb-6 md:flex-row md:items-center md:space-y-0">
        {/* Left side: Tab Buttons */}
        <div className="relative flex rounded-2xl bg-slate-100 p-1.5">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative z-10 px-8 py-2 text-sm font-semibold transition-colors duration-300 sm:text-base ${
                tab === t
                  ? "text-[#4169E1]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t}

              {tab === t && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 -z-10 rounded-[14px] bg-white shadow-sm"
                  transition={{
                    type: "spring",
                    duration: 0.5,
                    bounce: 0.2,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-12 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            {tab === "Projects" ? (
              loadingProjects ? (
                <div className="py-12 text-center text-slate-500">
                  Loading projects...
                </div>
              ) : projects.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  No projects available yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <ProjectCard
                    apiProjects={projects}
                  />
                </div>
              )
            ) : loadingGallery ? (
              <div className="py-12 text-center text-slate-500">
                Loading gallery...
              </div>
            ) : (
              <GalleryCard
                apiGallery={gallery}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Projects;