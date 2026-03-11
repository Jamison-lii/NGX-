import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Globe, 
  Users, 
  ShieldCheck, 
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- IMAGE IMPORTS ---
import img1 from '../../assets/Photos/img1.jpeg';
import img2 from '../../assets/Photos/img2.jpeg';
import img3 from '../../assets/Photos/img3.jpeg';

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const brandColor = "#4169E1"; // Royal Blue

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-10 pb-20 lg:pt-28 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 text-[#4169E1] text-xs font-bold uppercase tracking-widest">
              NGX: Non-Governmental Xenials
            </div>

            <h1 className="text-6xl lg:text-8xl font-extrabold leading-[1.1] mb-8 tracking-tight">
              Supporting <span style={{ color: brandColor }}>Children.</span><br />
              Strengthening <span className="text-slate-300">Communities.</span>
            </h1>

            <p className="text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-light">
              NGX is committed to aiding orphanages and bringing joy, hope, and opportunity 
              to children and communities. Through compassion, trust, and consistent effort, 
              NGX works to create a future where every child feels supported and valued.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={() => navigate('/projects')} 
                className="bg-[#4169E1] text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 group hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200"
              >
                See Our Work <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>

              <button 
                onClick={() => navigate('/about')} 
                className="border border-slate-200 px-10 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                Learn More
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
                alt="NGX Mission" 
                className="w-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE PILLARS */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-[#4169E1] font-bold tracking-[0.3em] uppercase text-sm mb-4">The NGX Mission</h2>
            <h3 className="text-4xl md:text-5xl font-bold">Creating Lasting Impact</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Care', 
                desc: 'Supporting orphanages and bringing encouragement and joy to children through meaningful outreach and community support.', 
                icon: <Users size={24}/> 
              },
              { 
                title: 'Trust', 
                desc: 'Building strong relationships with communities through integrity, compassion, and dependable action.', 
                icon: <ShieldCheck size={24}/> 
              },
              { 
                title: 'Consistency', 
                desc: 'Maintaining a long-term commitment to improving the lives of children through continuous support and engagement.', 
                icon: <Target size={24}/> 
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="text-[#4169E1] mb-6">{item.icon}</div>
                <h4 className="text-2xl font-bold mb-4">{item.title}</h4>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VIMAUX COMMUNITY */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeIn} className="rounded-[3rem] overflow-hidden shadow-2xl relative group">
              <img src={img2} alt="NGX Community" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors" />
            </motion.div>
            
            <motion.div {...fadeIn}>
              <h2 className="text-[#4169E1] font-bold tracking-[0.3em] uppercase text-sm mb-6">Internal Collaboration</h2>
              <h3 className="text-5xl font-black mb-8 tracking-tighter">Vimaux Community</h3>

              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Vimaux is NGX’s internal community platform where members collaborate, 
                share updates, and coordinate projects focused on supporting children, 
                orphanages, and community outreach initiatives.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <Target size={20} className="text-[#4169E1]" /> Role-based Authentication
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <Target size={20} className="text-[#4169E1]" /> Community Updates & Posts
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <Target size={20} className="text-[#4169E1]" /> Shared Documents & Projects
                </li>
              </ul>

              <button 
                onClick={() => navigate('/login')}
                className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-[#4169E1] transition-all"
              >
                Access Vimaux
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GLOBAL IMPACT */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Global Impact</h2>
            <p className="text-slate-500 mt-4 text-xl">
              Supporting children, orphanages, and communities through meaningful action.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100">
               <Globe className="text-[#4169E1] mb-6" size={40} />
               <h4 className="text-2xl font-bold mb-4">Orphanage Support</h4>
               <p className="text-slate-500">
               Working with orphanages to provide encouragement, visibility,
               and support for children who need care and attention.
               </p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100">
               <Users className="text-[#4169E1] mb-6" size={40} />
               <h4 className="text-2xl font-bold mb-4">Community Empowerment</h4>
               <p className="text-slate-500">
               Strengthening communities by supporting young people
               and creating opportunities for positive growth.
               </p>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100">
               <Zap className="text-[#4169E1] mb-6" size={40} />
               <h4 className="text-2xl font-bold mb-4">Consistent Mission</h4>
               <p className="text-slate-500">
               Since launching this mission on May 1st 2024,
               NGX continues to work consistently toward helping children and communities.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10">
              Be Part of the <span className="text-[#4169E1]">NGX Mission.</span>
            </h2>

            <button 
              onClick={() => navigate('/contact')} 
              className="bg-[#4169E1] text-white px-12 py-6 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-blue-200"
            >
              Contact NGX Headquarters
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;