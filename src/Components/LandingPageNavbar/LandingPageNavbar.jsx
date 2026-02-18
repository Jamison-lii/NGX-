import React, { useState } from "react";
import { navItems } from "../../Constants/constants";
import { Menu, X, ShieldCheck } from "lucide-react"; // Added ShieldCheck for Geode
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // For smooth transitions
import Login from "../Login/Login";
import { useModal } from "../../Context/ModalContext";

const NormalNavbar = () => {
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const { showModal } = useModal();

  const toggleDrawer = () => setOpenMobileDrawer(!openMobileDrawer);

  const openLogin = () => {
    setOpenMobileDrawer(false); // Close drawer when opening login
    showModal(<Login />);
  };

  return (
    <nav className="sticky top-0 z-50 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="container px-6 lg:px-20 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 group cursor-pointer">
            
            <span className="text-xl tracking-tighter font-black text-slate-800">
              NGX
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center space-x-10 text-[15px] font-semibold text-slate-500">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `transition-all duration-300 hover:text-[#4169E1] flex items-center gap-1 ${
                      isActive ? "text-[#4169E1]" : ""
                    }`
                  }
                >
                  {item.label}
                  {/* Small dot indicator for active state */}
                  <NavLink to={item.href} className={({ isActive }) => 
                    isActive ? "w-1 h-1 bg-[#4169E1] rounded-full" : "hidden"
                  }/>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Action Buttons (Desktop) */}
          <div className="hidden lg:flex items-center">
             <button 
               onClick={openLogin}
               className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#4169E1] transition-all active:scale-95 shadow-lg shadow-slate-200"
             >
               <ShieldCheck size={14} />
               COMMUNITY ACCESS
             </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={toggleDrawer} 
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {openMobileDrawer ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer with Framer Motion */}
        <AnimatePresence>
          {openMobileDrawer && (
            <>
              {/* Dark Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleDrawer}
                className="fixed inset-0 top-[73px] bg-slate-900/20 backdrop-blur-sm z-40"
              />
              
              {/* Drawer Content */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-[75px] left-0 right-0 bg-white border-b border-slate-100 shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-6 space-y-6">
                  <ul className="space-y-4">
                    {navItems.map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <NavLink
                          to={item.href}
                          onClick={toggleDrawer}
                          className={({ isActive }) =>
                            `text-lg font-bold block p-2 transition-colors ${
                              isActive ? "text-[#4169E1]" : "text-slate-600"
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      </motion.li>
                    ))}
                  </ul>

                  <hr className="border-slate-100" />

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Private Access</p>
                    <button
                      onClick={openLogin}
                      className="w-full flex items-center justify-center gap-3 bg-[#4169E1] text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 active:scale-[0.98] transition-all"
                    >
                      <ShieldCheck size={20} />
                       Community Access
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NormalNavbar;