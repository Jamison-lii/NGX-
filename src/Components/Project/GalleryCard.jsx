import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Maximize2, X, Image as ImageIcon, Film } from 'lucide-react';
import vid1 from '../../assets/Videos/vid1.mp4';
import { images as staticImages } from '../../Constants/constants';

const GalleryCard = ({ apiGallery }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  // Use API data if available, otherwise use static constants
  const displayImages = apiGallery && apiGallery.length > 0 ? apiGallery : staticImages;

  const handlePlay = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="space-y-16">
      {/* --- SECTION 1: CINEMATIC VIDEO FEATURE --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative group"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#4169E1]">
            <Film size={20} />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Featured Field Footage</h3>
        </div>

        <div className="relative w-full h-[500px] md:h-[600px] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/20">
          <video
            ref={videoRef}
            src={vid1}
            className={`w-full h-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-60'}`}
            controls={isPlaying}
            onPause={() => setIsPlaying(false)}
          />

          {!isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlay}
                className="group/btn relative"
              >
                {/* Pulse Effect */}
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
                <div className="relative h-24 w-24 flex justify-center items-center bg-white rounded-full transition-transform duration-300">
                  <Play className="w-10 h-10 text-[#4169E1] fill-[#4169E1]" />
                </div>
              </motion.button>
              <p className="mt-6 text-white font-bold tracking-[0.3em] uppercase text-xs opacity-70">Watch Impact Film</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* --- SECTION 2: BENTO MASONRY GALLERY --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#4169E1]">
              <ImageIcon size={20} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">The Gallery (VIMAUX Impact)</h3>
          </div>
          <span className="text-sm text-slate-400 font-medium">{displayImages.length} Captures</span>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayImages.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedImg(src)}
              className={`relative cursor-pointer overflow-hidden rounded-[2rem] group h-64 shadow-sm hover:shadow-xl transition-all
                ${i === 0 ? 'md:col-span-2 md:row-span-2 h-auto' : ''} 
                ${i === 5 ? 'md:col-span-2' : ''}
              `}
            >
              <img
                src={src}
                alt={`Impact ${i}`}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#4169E1]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <div className="p-4 bg-white/20 rounded-full text-white">
                  <Maximize2 size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- LIGHTBOX (MODAL) --- */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl p-4 md:p-12 flex items-center justify-center"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-10 right-10 text-white hover:text-[#4169E1] transition-colors">
              <X size={40} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImg}
              className="max-w-full max-h-full rounded-3xl shadow-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryCard;