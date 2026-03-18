import React, { useState } from "react";
import { navItems } from "../../Constants/constants";
import { Menu, X, ShieldCheck } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NormalNavbar = () => {
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => setOpenMobileDrawer((prev) => !prev);

  const closeDrawer = () => setOpenMobileDrawer(false);

  const openLogin = () => {
    closeDrawer();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 py-4 backdrop-blur-md transition-all duration-300">
      <div className="container relative mx-auto px-6 text-sm lg:px-20">
        <div className="flex items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <span className="text-xl font-black tracking-tighter text-slate-800">
              NGX
            </span>
          </div>

          <ul className="hidden items-center space-x-10 text-[15px] font-semibold text-slate-500 lg:flex">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-2 transition-all duration-300 hover:text-[#4169E1] ${
                      isActive ? "text-[#4169E1]" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4169E1]" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center lg:flex">
            <button
              onClick={openLogin}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F2C94C] px-5 py-2.5 text-xs font-bold text-slate-900 shadow-lg shadow-[#D4AF37]/30 transition-all duration-200 hover:from-[#C79A1B] hover:to-[#E0B43D] active:scale-95"
            >
              <ShieldCheck size={14} />
              COMMUNITY ACCESS
            </button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={toggleDrawer}
              className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100"
            >
              {openMobileDrawer ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {openMobileDrawer && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeDrawer}
                className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
              />

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute left-0 right-0 top-[75px] z-50 overflow-hidden border-b border-slate-100 bg-white shadow-2xl lg:hidden"
              >
                <div className="space-y-6 p-6">
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
                          onClick={closeDrawer}
                          className={({ isActive }) =>
                            `block p-2 text-lg font-bold transition-colors ${
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
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Private Access
                    </p>

                    <button
                      onClick={openLogin}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F2C94C] px-5 py-2.5 text-xs font-bold text-slate-900 shadow-lg shadow-[#D4AF37]/30 transition-all duration-200 hover:from-[#C79A1B] hover:to-[#E0B43D] active:scale-95"
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