import React from 'react'
import { Mail, Facebook, Phone, X } from 'lucide-react';

const Footer = () => {
  return (
    <div className="container  mx-auto relative ">
       <div className="flex flex-col font-Inter justify-between items-center">
         <div className='w-full flex justify-center font-bold items-center py-4 text-[#5F5F5F]'>
          NGX
         </div>
         <div className='w-full lg:px-20 max-sm:px-10 max-sm:text-sm flex justify-center text-center font-medium items-center py-4 text-[#5F5F5F]'>
          Next Generation eXperience is a nonprofit organization committed to creating lasting impact through sustainable,<br/> 
          community-driven development projects. We focus on areas like health, education, and the environment empowering <br/>
          underserved populations through action, innovation, and collaboration.
         </div>

       </div>
         <div className='w-full flex justify-center items-center py-4 text-[#5F5F5F]'>
            <div className='flex justify-center items-center space-x-4'> 
                 <Mail className="w-5 h-5" />
                 <Facebook className="w-5 h-5" />
                 <Phone className="w-5 h-5" />
                 <X className="w-5 h-5" /> {/* X icon (formerly Twitter) */}
             </div>
        </div>
            <div className='w-full flex justify-center items-center py-4 text-[#5F5F5F]'>
            Copyright© 2025 <span className='text-[#4169E1]'>  NextGenerationXenials </span>
            </div>
    </div>
  )
}

export default Footer