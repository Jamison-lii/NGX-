import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Globe, 
  Users, 
  ShieldCheck, 
  ExternalLink, 
  Menu, 
  X 
} from 'lucide-react';

// --- IMAGE IMPORTS ---
// This tells React exactly where to find your files
import img1 from '../../assets/Photos/img1.jpeg';
import img2 from '../../assets/Photos/img2.jpeg';
import img3 from '../../assets/Photos/img3.jpeg';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const brandColor = "#4169E1"; // Royal Blue

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      
      

      {/* --- HERO SECTION --- */}
      <section className="relative  pb-20 lg:pt-28 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 text-[#4169E1] text-xs font-bold uppercase tracking-widest">
              Non-Profit Organization
            </div>
            <h1 className="text-6xl lg:text-8xl font-extrabold leading-[1.1] mb-8 tracking-tight">
              Igniting <span style={{ color: brandColor }}>Passion.</span><br />
              Empowering.
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-light">
              Building a modern, secure framework to showcase NGX’s global impact and foster internal collaboration.
            </p>
            <div className="flex flex-col sm:row gap-5">
              <button className="bg-[#4169E1] text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 group hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200">
                Explore Projects <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="border border-slate-200 px-10 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                Our Mission
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-60" />
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]">
              <img 
                src={img1} 
                alt="NGX Hero" 
                className="w-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- MISSION STATEMENT (Minimalist) --- */}
      <section id="about" className="py-32 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2 {...fadeIn} className="text-3xl md:text-5xl font-medium leading-snug italic text-slate-800">
            "To build a modern, <span className="text-[#4169E1] font-bold not-italic">secure</span>, and professional framework that empowers internal collaboration and showcases field work to the world."
          </motion.h2>
          <motion.div {...fadeIn} className="mt-12 flex justify-center gap-2">
             <div className="w-16 h-1 bg-[#4169E1] rounded-full" />
             <div className="w-4 h-1 bg-[#4169E1]/30 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* --- CORE FEATURES --- */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div {...fadeIn} className="group p-10 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 group-hover:bg-[#4169E1] transition-colors">
                <Globe className="text-[#4169E1] group-hover:text-white transition-colors" size={30} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Public Outreach</h3>
              <p className="text-slate-500 leading-relaxed">Displaying our field work, impact, and media gallery to a global audience with transparency.</p>
            </motion.div>

            <motion.div {...fadeIn} className="group p-10 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 group-hover:bg-[#4169E1] transition-colors">
                <Users className="text-[#4169E1] group-hover:text-white transition-colors" size={30} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Geode Community</h3>
              <p className="text-slate-500 leading-relaxed">A private, secure hub for members to access confidential posts and project discussions.</p>
            </motion.div>

            <motion.div {...fadeIn} className="group p-10 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 group-hover:bg-[#4169E1] transition-colors">
                <ShieldCheck className="text-[#4169E1] group-hover:text-white transition-colors" size={30} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure Docs</h3>
              <p className="text-slate-500 leading-relaxed">Role-based access allowing only verified members to download sensitive organization files.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- PROJECT SHOWCASE (Dark Mode) --- */}
      <section id="projects" className="py-32 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Our Field Impact</h2>
              <p className="text-slate-400 text-lg">Every project we undertake is documented and verified. Here is how we are changing the world.</p>
            </div>
            <button className="text-[#4169E1] font-bold text-lg flex items-center gap-3 hover:gap-5 transition-all">
              All Projects <ExternalLink size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div {...fadeIn} className="group">
              <div className="overflow-hidden rounded-[2rem] mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img 
                  src={img2} 
                  alt="Project One" 
                  className="w-full aspect-[16/10] object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
              </div>
              <h3 className="text-3xl font-bold mb-4">Innovation Empowerment</h3>
              <p className="text-slate-400 leading-relaxed">Providing tools and training for local communities to build sustainable futures.</p>
            </motion.div>

            <motion.div {...fadeIn} className="group">
              <div className="overflow-hidden rounded-[2rem] mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img 
                  src={img3} 
                  alt="Project Two" 
                  className="w-full aspect-[16/10] object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
              </div>
              <h3 className="text-3xl font-bold mb-4">Sustainable Development</h3>
              <p className="text-slate-400 leading-relaxed">Focusing on clean energy and resource management across 12 different regions.</p>
            </motion.div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default LandingPage;