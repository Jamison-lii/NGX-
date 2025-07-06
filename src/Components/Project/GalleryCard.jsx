import React, { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import vid1 from '../../assets/Videos/vid1.mp4';
import {images} from '../../Constants/constants'; 

const GalleryCard = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <>
    {/* Video */}
    <div className="w-full mb-6 font-Inter  shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="w-full h-[450px] bg-gray-200 relative">
        <video
          ref={videoRef}
          src={vid1}
          className="w-full h-full object-cover"
          controls={isPlaying} // Show controls only after play
        />

        {/* Play Icon Overlay */}
        {!isPlaying && (
          <div
            className="absolute  inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={handlePlay}
          >
            <div className='h-20 w-20 flex justify-center items-center border-6 border-white rounded-full mb-2'>
                 <Play className="w-14 h-14 text-white" />
            </div>
            
          </div>
        )}
      </div>
        
        
        
    </div>

{/*Image Caroussel */}
  <div className="w-full py-8">
  <div
    className="flex gap-6 px-4 overflow-x-auto no-scrollbar"
    style={{
      perspective: "1000px",
    }}
  >
    {images.map((src, i) => {
      let rotateY = 0;

      if (i === 0) rotateY = 57;
      else if (i === 1) rotateY = 10;
      else if (i === 2) rotateY = 0;
      else if (i === 3) rotateY = -10;
      else if (i === 4) rotateY = -20;

      return (
        <div
          key={i}
          className="w-40 h-32 shrink-0 shadow-lg rounded-md overflow-hidden bg-white"
          style={{
            transform: `rotateY(${rotateY}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <img
            src={src}
            alt={`Slide ${i}`}
            className="w-full h-full object-cover "
          />
        </div>
      );
    })}
  </div>
</div>


    </>
  );
};

export default GalleryCard;
