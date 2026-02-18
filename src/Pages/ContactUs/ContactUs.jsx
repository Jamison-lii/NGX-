import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  ShieldCheck,
  Globe
} from 'lucide-react';

// Using your existing image for the side visual
import img3 from '../../assets/Photos/img3.jpeg'; 

const ContactUs = () => {
  const brandColor = "#4169E1";

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  // Replace with your actual WhatsApp number
  const whatsappNumber = "1234567890"; 
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20NGX%20Diplomatic%20Core,%20I%20would%20like%20to%20inquire%20about...`;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      
      {/* --- HEADER --- */}
      <section className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-[#4169E1] font-bold tracking-[0.3em] uppercase text-sm mb-4">Connect with us</h2>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Let’s Start the <span className="text-slate-300">Mission.</span>
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto">
            Whether you are looking for partnership, recruitment, or have a question for the VIMAUX core, we are here to listen.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* --- LEFT: CONTACT INFO --- */}
          <motion.div 
            {...fadeInUp}
            className="lg:col-span-5 space-y-8"
          >
            <div className="bg-slate-950 text-white p-10 rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4169E1] blur-[80px] opacity-30" />
              
              <h3 className="text-2xl font-bold mb-8 relative z-10">Diplomatic Details</h3>
              
              <div className="space-y-8 relative z-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#4169E1]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Email Us</p>
                    <p className="text-lg font-medium">contact@ngx-organization.com</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#4169E1]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Location</p>
                    <p className="text-lg font-medium">VIMAUX Horizon HQ, Global</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#4169E1]">
                    <Globe size={24} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
                    <p className="text-lg font-medium">Operating Internationally</p>
                  </div>
                </div>
              </div>

              {/* WHATSAPP CTA */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-slate-400 text-sm mb-6">Need an immediate response? Connect via our secure line.</p>
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-[#4169E1] hover:bg-blue-600 text-white w-full py-4 rounded-2xl font-bold transition-all"
                >
                  <MessageCircle size={22} />
                  WhatsApp the Core
                </a>
              </div>
            </div>

            {/* Visual Decorative Card */}
            <div className="rounded-[3rem] overflow-hidden h-64 relative group">
              <img src={img3} alt="NGX impact" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors" />
            </div>
          </motion.div>

          {/* --- RIGHT: CONTACT FORM --- */}
          <motion.div 
            {...fadeInUp}
            className="lg:col-span-7 bg-slate-50 p-8 md:p-16 rounded-[3rem] border border-slate-100"
          >
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-[#4169E1] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-[#4169E1] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">Subject</label>
                <select className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-[#4169E1] transition-colors appearance-none">
                  <option>General Inquiry</option>
                  <option>Partnership Proposal</option>
                  <option>VIMAUX Recruitment</option>
                  <option>Press & Media</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">Your Message</label>
                <textarea 
                  rows="5"
                  placeholder="How can NGX assist you?"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-[#4169E1] transition-colors resize-none"
                ></textarea>
              </div>

              <button className="bg-[#4169E1] text-white w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:scale-[1.02] transition-all">
                Send Message <Send size={20} />
              </button>

              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs pt-4">
                <ShieldCheck size={14} />
                <span>Your communication is secured by NGX encryption.</span>
              </div>
            </form>
          </motion.div>

        </div>
      </section>

      {/* --- MAP / TEXT DECORATION --- */}
      <section className="mt-32 overflow-hidden pointer-events-none select-none opacity-[0.03]">
        <div className="text-[20vw] font-black leading-none whitespace-nowrap">
          CONNECT CONNECT CONNECT
        </div>
      </section>
    </div>
  );
};

export default ContactUs; 