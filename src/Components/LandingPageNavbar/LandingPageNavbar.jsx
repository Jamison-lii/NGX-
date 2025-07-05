import React, { useState } from "react";
import { navItems } from "../../Constants/constants";
import { Menu, X } from "lucide-react";
import { Globe, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

const NormalNavbar = () => {
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenMobileDrawer(!openMobileDrawer);
  };
  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur  border-neutral-700/80">
      <div className="container px-9 mx-auto relative text-sm">
        <div className="flex font-Inter justify-between items-center">
          {/* logo */}
          <div className="flex items-center flex-shrink-0">
            <span className="text-xl tracking-tight font-Inter text-[#5F5F5F] font-bold">
              NGX
            </span>
          </div>

          <ul className="hidden lg:flex ml-14 space-x-12 text-[17px] text-[#5F5F5F]">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    isActive
                      ? 'text-black font-medium relative pl-4 before:content-[""] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#4169E1] before:rounded-full'
                      : "hover:text-black "
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Hamburger Menu */}
          <div className=" flex justify-center  items-center">
            <div className="flex items-center text-[#5F5F5F] space-x-1 py-2 pr-6 font-normal text-[16px] hover:bg-neutral-200 rounded-md cursor-pointer">
              <Globe className="w-5 h-5 text-[#5F5F5F]" />
              <span>EN</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="py-2 px-1 hover:bg-neutral-200 text-[#5F5F5F] cursor-pointer">
              <button onClick={toggleDrawer}>
                {openMobileDrawer ? (
                  <X className="w-8 h-8" />
                ) : (
                  <Menu className="w-7 h-7 mt-[5px]" />
                )}
              </button>

              {openMobileDrawer && (
                <div
                  className={`fixed top-20 bg-white/30 backdrop-blur-md right-0 h-70 w-100 z-50 shadow-md  transform transition-transform duration-300 ease-in-out 
    ${openMobileDrawer ? "translate-x-0" : "translate-x-full"}
    
  `}
                >
                  <div className="px-4 py-2 mt-2 text-center bg-white/80 hover:bg-white/90 rounded-[5px] border-1 border-[#e3e3e3] shadow-lg text-[#5F5F5F] font-Inter text-sm cursor-pointer transition-colors duration-200 max-w-[350px] mx-auto">
                    Community (Vimaux Community)
                  </div>
                  <hr className="max-w-[340px] border-[#CCCCCC] mt-2 mx-auto" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NormalNavbar;
