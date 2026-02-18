import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Facebook, Phone, Instagram, Send, ShieldCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const brandColor = "#4169E1";

  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- TOP SECTION: GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4169E1] rounded-lg flex items-center justify-center text-white font-black text-xs">N</div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">NGX</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Non-Governmental Xenials is a nonprofit organization dedicated to morphing, analyzing, and securing systems to empower the next generation.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Mail].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#4169E1] hover:text-white hover:border-[#4169E1] transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Organization</h4>
            <ul className="space-y-4">
              {['About Us', 'Projects', 'Media Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase().replace(' ', '')}`} className="text-slate-500 hover:text-[#4169E1] text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & Access */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Diplomatic Access</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/login" className="flex items-center gap-2 text-slate-500 hover:text-[#4169E1] text-sm group">
                  <ShieldCheck size={16} className="text-[#4169E1]" />
                  Vimaux Community
                </Link>
              </li>
              <li className="flex items-center gap-2 text-slate-500 text-sm">
                <Globe size={16} className="text-[#4169E1]" />
                Global HQ: Virtual / Secure
              </li>
              <li className="flex items-center gap-2 text-slate-500 text-sm">
                <Phone size={16} className="text-[#4169E1]" />
                Direct Line Available
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Stay Informed</h4>
            <p className="text-slate-500 text-sm">Join our mission updates.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4169E1] transition-colors"
              />
              <button className="absolute right-2 top-2 bg-[#4169E1] text-white p-1.5 rounded-lg hover:bg-blue-700 transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT --- */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs">
            © 2025 <span className="font-bold text-slate-900">Non Governmental Xenials.</span> All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 hover:text-slate-900 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 text-xs transition-colors">Internal Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;