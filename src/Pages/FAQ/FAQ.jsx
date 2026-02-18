import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircle, ShieldCheck } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex justify-between items-center text-left hover:text-[#4169E1] transition-colors group"
      >
        <span className="text-xl md:text-2xl font-bold tracking-tight pr-8">{question}</span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-all ${isOpen ? 'bg-[#4169E1] border-[#4169E1] text-white' : 'group-hover:border-[#4169E1]'}`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-slate-500 text-lg leading-relaxed max-w-3xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What exactly is NGX?",
      answer: "NGX, or Non-Governmental Xenials, is a modern non-profit organization dedicated to morphing, analyzing, and securing systems to empower the youth of this generation and the next. We focus on providing massive economical and educational skills through community-driven projects."
    },
    {
      question: "What is the relationship between NGX and VIMAUX?",
      answer: "NGX is our public-facing identity—the agency through which we carry out specific community goals. VIMAUX (Auxilux Vimare) represents the Root Core, the stronghold pillars, and the strategic visionaries who guide the organization's deeper objectives."
    },
    {
      question: "What does 'Auxilux Vimare' mean?",
      answer: "It is the philosophical foundation of our organization, derived from four core principles: Auxillium (Aid), Lux (Light), Amare (Love), and Visio Futurum (Visionary Future). Together, these form our commitment to providing aid and light to the world through a lens of love and foresight."
    },
    {
      question: "What is the Geode Community?",
      answer: "Geode is the private section of our digital ecosystem. It is a secure hub where VIMAUX members and authorized diplomats collaborate, share confidential documents, and discuss internal project strategies that are not yet ready for public disclosure."
    },
    {
      question: "I heard about 'Vimaux Genesis'—what is that?",
      answer: "Vimaux Genesis is our primary mission module, launched on May 1st, 2024. It focuses on aiding orphanages and bringing joy to children, who we believe are the essential labor force and leaders of the future."
    },
    {
      question: "Is NGX a religious organization?",
      answer: "NGX operates under a spiritual foundation known as the Ambassadors of Christ Christian Fellowship Center. We believe that this spiritual alignment allows us to establish trust quickly and brings a higher level of integrity and commitment to our humanitarian work."
    },
    {
      question: "How can I join the organization?",
      answer: "We look for applicants who are determined, strong-willed, optimistic, and loyal. While many roles are open to the public, VIMAUX core roles are highly confidential. You can check our LinkedIn for current intern and staff openings."
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      {/* --- HEADER --- */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 text-[#4169E1] font-bold tracking-widest uppercase text-xs mb-6">
              <HelpCircle size={16} />
              <span>Resources & Transparency</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Questions <br /> 
              <span className="text-slate-300">&</span> Answers.
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 text-xl lg:max-w-md pb-2"
          >
            Everything you need to know about the NGX framework, the VIMAUX core, and our mission for a visionary future.
          </motion.p>
        </div>
      </section>

      {/* --- FAQ LIST --- */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="border-t border-slate-100">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      {/* --- SUPPORT CTA --- */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <div className="bg-slate-50 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#4169E1]">
              <MessageCircle size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Still have questions?</h3>
              <p className="text-slate-500">Contact the NGX diplomatic core for more details.</p>
            </div>
          </div>
         <a 
  href="https://wa.me/695425977?text=Hello%20NGX%20Diplomatic%20Core,%20I%20have%20a%20question." 
  target="_blank" 
  rel="noopener noreferrer"
  className="inline-block"
>
  <button className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#4169E1] transition-colors flex items-center gap-3">
    Get in Touch <ShieldCheck size={20} />
  </button>
</a>
        </div>
      </section>
      
      {/* --- VISION QUOTE --- */}
      <div className="mt-32 text-center text-slate-200 font-black text-6xl md:text-[10rem] select-none pointer-events-none overflow-hidden whitespace-nowrap opacity-50">
        VIMAUX HORIZON INFINITY
      </div>
    </div>
  );
};

export default FAQ;