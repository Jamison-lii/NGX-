import React from 'react'
import { navItems } from '../../Constants/constants'
import { Menu, X } from "lucide-react";

const NormalNavbar = () => {
  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur border-b border-neutral-700/80">
       <div className="container px-4 mx-auto relative text-sm">
        
        <div className="flex justify-between items-center">

          {/* logo */}
          <div className="flex items-center flex-shrink-0">
            <span className="text-xl tracking-tight font-medium">NGX</span>
          </div>


         {/* Desktop navigation*/}
          <ul className="hidden lg:flex ml-14 space-x-12">{/* hidden lg: causes this to be seen only on large screen sizes */}
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href} className="hover:text-orange-500">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger Menu */}
          <div className=" flex justify-center  items-center">
            <div className="py-2 px-1 font-medium text-[19px]  hover:bg-neutral-200">
              EN
            </div>
           <div className="py-2 px-1 hover:bg-neutral-200 cursor-pointer">
             <Menu className="w-6 h-6" />
            </div>

          </div>

          
        </div>
         
          

       </div>

    </nav>
  )
}

export default NormalNavbar