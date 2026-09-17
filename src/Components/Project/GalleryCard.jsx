import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Maximize2,
  X,
  Image as ImageIcon,
  Film,
  ArrowUpRight,
} from "lucide-react";

import { images as staticImages } from "../../Constants/constants";

const WORKER_URL = import.meta.env.WORKER_URL;

const GalleryCard = ({ apiGallery }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  /*
   * Use database gallery when available.
   * Fall back to the old static images only
   * when there is no database gallery yet.
   */
  const hasApiGallery =
    Array.isArray(apiGallery) &&
    apiGallery.length > 0;

  useEffect(() => {
    let objectUrls = [];
    let cancelled = false;

    const loadGalleryMedia = async () => {
      if (!hasApiGallery) {
        setGalleryItems(
          staticImages.map((src, index) => ({
            id: `static-${index}`,
            title: `Impact ${index + 1}`,
            type: "image",
            src,
            isStatic: true,
          }))
        );

        return;
      }

      setLoading(true);

      try {
        const loadedItems = await Promise.all(
          apiGallery.map(async (item) => {
            try {
              const response = await fetch(
                `${WORKER_URL}/public/gallery/${item.id}`
              );

              if (!response.ok) {
                throw new Error(
                  `Failed to load gallery item: ${response.status}`
                );
              }

              const blob = await response.blob();

              const objectUrl =
                URL.createObjectURL(blob);

              objectUrls.push(objectUrl);

              return {
                ...item,
                src: objectUrl,
              };
            } catch (error) {
              console.error(
                `Gallery item ${item.id} failed to load:`,
                error
              );

              return {
                ...item,
                src: null,
              };
            }
          })
        );

        if (!cancelled) {
          setGalleryItems(loadedItems);
        }
      } catch (error) {
        console.error(
          "Failed to load gallery:",
          error
        );

        if (!cancelled) {
          setGalleryItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadGalleryMedia();

    return () => {
      cancelled = true;

      objectUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [apiGallery, hasApiGallery]);

  const featuredItem =
    galleryItems.length > 0
      ? galleryItems[0]
      : null;

  const remainingItems =
    galleryItems.slice(1);

  const openLightbox = (item) => {
    if (!item?.src) {
      return;
    }

    setSelectedItem(item);
  };

  return (
    <div className="space-y-20">
      {/* =====================================================
          FEATURED IMPACT
      ===================================================== */}
      <section>
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#4169E1]">
                <ImageIcon size={19} />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#4169E1]">
                Featured Impact
              </span>
            </div>

            <h3 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Stories worth seeing.
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              A glimpse into the people, projects and
              moments behind Vimaux's work.
            </p>
          </div>

          {galleryItems.length > 0 && (
            <span className="hidden text-sm font-medium text-slate-400 sm:block">
              {galleryItems.length}{" "}
              {galleryItems.length === 1
                ? "capture"
                : "captures"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex h-[520px] items-center justify-center rounded-[2.5rem] bg-slate-100">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-[#4169E1]" />
          </div>
        ) : featuredItem ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className="group relative overflow-hidden rounded-[2.5rem] bg-slate-950 shadow-2xl shadow-slate-200"
          >
            <div className="relative h-[500px] md:h-[620px]">
              {featuredItem.type === "video" ? (
                <video
                  src={featuredItem.src}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : featuredItem.src ? (
                <img
                  src={featuredItem.src}
                  alt={featuredItem.title}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  Unable to load featured media.
                </div>
              )}

              {/* Dark cinematic gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Featured badge */}
              <div className="absolute left-6 top-6 md:left-8 md:top-8">
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-xl">
                  {featuredItem.type === "video" ? (
                    <Film size={13} />
                  ) : (
                    <ImageIcon size={13} />
                  )}

                  Featured
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10">
                <div className="max-w-2xl">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-white/60">
                    Vimaux Impact
                  </p>

                  <h4 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                    {featuredItem.title ||
                      "Featured Impact"}
                  </h4>

                  <div className="mt-6 flex items-center gap-4">
                    {featuredItem.type ===
                    "image" ? (
                      <button
                        type="button"
                        onClick={() =>
                          openLightbox(
                            featuredItem
                          )
                        }
                        className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-transform hover:scale-105"
                      >
                        <Maximize2 size={16} />
                        View image
                      </button>
                    ) : (
                      <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md">
                        <Play
                          size={16}
                          fill="currentColor"
                        />
                        Featured video
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex h-[420px] items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-slate-50 text-slate-400">
            No gallery media available yet.
          </div>
        )}
      </section>

      {/* =====================================================
          IMPACT GALLERY
      ===================================================== */}
      {remainingItems.length > 0 && (
        <section>
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#4169E1]">
                Explore the work
              </p>

              <h3 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                More from the field
              </h3>
            </div>

            <span className="text-sm font-medium text-slate-400">
              {remainingItems.length} more
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-4 md:auto-rows-[220px]">
            {remainingItems.map(
              (item, index) => {
                const isLarge =
                  index === 0 ||
                  index === 4;

                const isWide =
                  index === 2 ||
                  index === 5;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      openLightbox(item)
                    }
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.5,
                      delay:
                        index * 0.05,
                    }}
                    className={`
                      group relative overflow-hidden rounded-[2rem]
                      bg-slate-100 text-left shadow-sm
                      transition-all duration-500
                      hover:-translate-y-1 hover:shadow-xl
                      ${
                        isLarge
                          ? "md:col-span-2 md:row-span-2"
                          : ""
                      }
                      ${
                        isWide
                          ? "md:col-span-2"
                          : ""
                      }
                    `}
                  >
                    {item.src ? (
                      item.type ===
                      "video" ? (
                        <video
                          src={item.src}
                          muted
                          playsInline
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src={item.src}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        Media unavailable
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Type */}
                    <div className="absolute left-5 top-5">
                      <div className="flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                        {item.type ===
                        "video" ? (
                          <Film size={12} />
                        ) : (
                          <ImageIcon
                            size={12}
                          />
                        )}

                        {item.type}
                      </div>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                      <div className="min-w-0 pr-4">
                        <h4 className="truncate text-lg font-bold text-white">
                          {item.title}
                        </h4>

                        <p className="mt-1 text-xs font-medium text-white/60">
                          Vimaux Impact
                        </p>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-[#4169E1]">
                        <ArrowUpRight
                          size={18}
                        />
                      </div>
                    </div>
                  </motion.button>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          LIGHTBOX
      ===================================================== */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-xl md:p-10"
            onClick={() =>
              setSelectedItem(null)
            }
          >
            <button
              type="button"
              onClick={() =>
                setSelectedItem(null)
              }
              className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-slate-900 md:right-8 md:top-8"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="relative max-h-full max-w-6xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {selectedItem.type ===
              "video" ? (
                <video
                  src={selectedItem.src}
                  controls
                  autoPlay
                  className="max-h-[85vh] max-w-full rounded-3xl object-contain shadow-2xl"
                />
              ) : (
                <img
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  className="max-h-[85vh] max-w-full rounded-3xl object-contain shadow-2xl"
                />
              )}

              <div className="mt-4 text-center">
                <h4 className="text-lg font-semibold text-white">
                  {selectedItem.title}
                </h4>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryCard;