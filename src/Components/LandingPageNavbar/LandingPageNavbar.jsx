import React from 'react'
import { navItems } from '../../Constants/constants'
import { Link, Menu, X } from "lucide-react";
import { Globe, ChevronDown } from 'lucide-react';

const NormalNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur  border-neutral-700/80">
       <div className="container px-9 mx-auto relative text-sm">
        
        <div className="flex font-Inter justify-between items-center">

          {/* logo */}
          <div className="flex items-center flex-shrink-0">
            <span className="text-xl tracking-tight font-Inter text-[#5F5F5F] font-bold">NGX</span>
          </div>


       <ul className="hidden text-[17px] text-[#5F5F5F] lg:flex ml-14 space-x-12">
  {navItems.map((item, index) => (
    <li key={index}>
      <Link to={item.href} className="hover:text-orange-500">
        {item.label}
      </Link>
    </li>
  ))}
</ul>


          {/* Hamburger Menu */}
          <div className=" flex justify-center  items-center">
           <div className="flex items-center text-[#5F5F5F] space-x-1 py-2 px-2 font-normal text-[16px] hover:bg-neutral-200 rounded-md cursor-pointer">
             <Globe className="w-5 h-5 text-[#5F5F5F]" />
           <span>EN</span>
             <ChevronDown className="w-5 h-5" />
             </div>
           <div className="py-2 px-1 hover:bg-neutral-200 text-[#5F5F5F] cursor-pointer">
             <Menu className="w-6 h-6" />
            </div>

          </div>

          
        </div>
         
          

       </div>

    </nav>
  )
}

export default NormalNavbar