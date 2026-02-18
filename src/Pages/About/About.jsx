import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sun, Eye, Shield, Zap, Globe } from 'lucide-react';

// Using the images you actually have
import img1 from '../../assets/Photos/img1.jpeg'; // Main Core / Hero
import img2 from '../../assets/Photos/img2.jpeg'; // Genesis / Project Work
import img3 from '../../assets/Photos/img3.jpeg'; // Vision / Impact

const About = () => {
  const brandColor = "#4169E1"; // Royal Blue

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-20">
      
      {/* --- HERO: THE VIMAUX HORIZON --- */}
      <section className="relative py-24 lg:py-40 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#4169E1] blur-[150px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div {...fadeInUp}>
            <h1 className="text-5xl lg:text-8xl font-black mb-8 tracking-tighter">
              VIMAUX <span className="text-[#4169E1]">HORIZON</span> INFINITY
            </h1>
            <p className="text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed uppercase tracking-widest">
              Morphing • Securing • Contributing
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- PHILOSOPHY: AUXILUX VIMARE --- */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-sm font-bold tracking-[0.3em] text-[#4169E1] uppercase mb-6">Our Philosophy</h2>
              <h3 className="text-4xl lg:text-6xl font-bold mb-10 leading-tight">
                Derived from <span className="italic font-serif">Auxilux Vimare</span>
              </h3>
              
              <div className="space-y-8">
                {[
                  { label: 'AUXILLIUM (AID)', desc: 'The base value for NGX to empower the population.', icon: <Heart size={20}/> },
                  { label: 'LUX (LIGHT)', desc: 'Bringing children into the recognition of our aim.', icon: <Sun size={20}/> },
                  { label: 'AMARE (LOVE)', desc: 'A spiritual foundation established through good works.', icon: <Zap size={20}/> },
                  { label: 'VISIO FUTURUM', desc: 'A visionary future that acknowledges the next generation.', icon: <Eye size={20}/> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-[#4169E1] group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg uppercase tracking-tight">{item.label}</h4>
                      <p className="text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Using img1 here as it represents the "Core/Stronghold" */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl bg-slate-100">
                <img src={img1} alt="VIMAUX Core" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-5 lg:-left-10 bg-white p-8 rounded-3xl shadow-xl max-w-xs border border-slate-100 z-20">
                <p className="text-slate-600 italic text-sm">"VIMAUX serves as the stronghold pillars of NGX. A group capable of tackling situations with infinite creativity."</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- MISSION: VIMAUX GENESIS --- */}
      <section className="py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Using img2 here as it shows the "Field Work/Genesis" */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[3rem] overflow-hidden order-2 lg:order-1"
            >
              <img src={img2} alt="Genesis Mission" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </motion.div>

            <div className="order-1 lg:order-2">
              <motion.h2 {...fadeInUp} className="text-sm font-bold tracking-[0.3em] text-[#4169E1] uppercase mb-6">Module I</motion.h2>
              <h3 className="text-4xl lg:text-5xl font-bold mb-8">Vimaux Genesis</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                The first mission starts as VIMAUX commits to aiding orphanages and bringing joy to children. 
                VIMAUX will be branded under a spiritual foundation to establish trust through 
                the <span className="font-bold text-slate-900">Ambassadors of Christ Christian Fellowship Center.</span>
              </p>
              <div className="bg-white p-8 rounded-2xl border-l-4 border-[#4169E1] shadow-sm">
                <p className="text-slate-500 font-medium italic">
                  "Target: Recognition, Acknowledgement, Trust, Love, and Satisfaction."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE ROOT CORE --- */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <motion.h2 {...fadeInUp} className="text-sm font-bold tracking-[0.3em] text-[#4169E1] uppercase mb-4">The Backbone</motion.h2>
          <h3 className="text-4xl lg:text-6xl font-black">ROOT CORE</h3>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'EYOLE NGANJE', alias: 'NGX' },
            { name: 'JECOLIAH MEWANU', alias: 'JECKY' },
            { name: 'BRIAN FUBRILA', alias: 'CORE' },
            { name: 'LUMU BLAISE', alias: 'CORE' }
          ].map((member, i) => (
            <motion.div 
              key={i} 
              {...fadeInUp}
              className="group relative h-80 rounded-[2rem] overflow-hidden bg-slate-900"
            >
              {/* Using img3 as a background for members to show "Global Impact" */}
              <img src={img3} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="member bg" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
              <div className="absolute bottom-0 p-8 w-full">
                <h4 className="text-white text-xl font-bold">{member.name}</h4>
                <p className="text-[#4169E1] text-xs font-bold tracking-widest mt-1">({member.alias})</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- VISION STATEMENT --- */}
      <section className="py-32 bg-slate-950 text-white relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <Globe className="mx-auto mb-10 text-[#4169E1]" size={60} />
            <h2 className="text-3xl md:text-5xl font-light leading-snug italic mb-12">
              "VIMAUX only target is to <span className="text-[#4169E1] font-bold not-italic">aid the world</span> but not be a part of it."
            </h2>
            <div className="flex justify-center gap-8 text-sm font-bold tracking-[0.2em] text-slate-500">
               <span>EST 2024</span>
               <span>•</span>
               <span>VIMAUX HORIZON INFINITY</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;