import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Users,
  ShieldCheck,
  Zap,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- IMAGE IMPORTS ---
import img1 from "../../assets/Photos/img1.jpeg";
import img2 from "../../assets/Photos/img2.jpeg";
import img3 from "../../assets/Photos/img3.jpeg";

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const brandColor = "#4169E1";

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white font-sans text-slate-900">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-0 pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pb-32 lg:pt-28">
        <div className="mx-auto grid w-full max-w-7xl min-w-0 grid-cols-1 items-center gap-12 px-4 sm:px-6 md:gap-16 lg:grid-cols-2 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="min-w-0 w-full"
          >
            <div className="mb-5 inline-flex max-w-full rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#4169E1] sm:mb-6 sm:px-4 sm:text-xs sm:tracking-widest">
              NGX: Non-Governmental Xenials
            </div>

            <h1 className="mb-7 max-w-full text-[2.35rem] font-extrabold leading-[1.12] tracking-[-0.04em] sm:mb-8 sm:text-5xl sm:leading-[1.08] md:text-6xl lg:mb-8 lg:text-7xl xl:text-8xl">
              Supporting <span style={{ color: brandColor }}>Children.</span>
              <br />
              Strengthening <span className="text-slate-300">Communities.</span>
            </h1>

            <p className="mb-8 max-w-xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-relaxed lg:mb-10 lg:text-xl">
              NGX is committed to aiding orphanages and bringing joy, hope, and
              opportunity to children and communities. Through compassion,
              trust, and consistent effort, NGX works to create a future where
              every child feels supported and valued.
            </p>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-5">
              <button
                onClick={() => navigate("/projects")}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#4169E1] px-6 py-4 font-bold text-white shadow-2xl shadow-blue-200 transition-all hover:bg-blue-700 sm:w-auto sm:px-8 sm:py-5"
              >
                See Our Work
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-2"
                />
              </button>

              <button
                onClick={() => navigate("/about")}
                className="w-full rounded-2xl border border-slate-200 px-6 py-4 font-bold transition-all hover:bg-slate-50 sm:w-auto sm:px-8 sm:py-5"
              >
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative min-w-0 w-full"
          >
            <div className="absolute -right-20 -top-16 h-48 w-48 rounded-full bg-blue-100 opacity-60 blur-[80px] sm:-right-20 sm:-top-20 sm:h-64 sm:w-64 sm:blur-[100px]" />

            <div className="relative z-10 w-full overflow-hidden rounded-[1.75rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.2)] sm:rounded-[2.5rem] sm:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]">
              <img
                src={img1}
                alt="NGX Mission"
                className="aspect-[4/5] w-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CORE PILLARS */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20 lg:py-24">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16 lg:mb-20">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#4169E1] sm:mb-4 sm:text-sm sm:tracking-[0.3em]">
              The NGX Mission
            </h2>

            <h3 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Creating Lasting Impact
            </h3>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                title: "Care",
                desc: "Supporting orphanages and bringing encouragement and joy to children through meaningful outreach and community support.",
                icon: <Users size={24} />,
              },
              {
                title: "Trust",
                desc: "Building strong relationships with communities through integrity, compassion, and dependable action.",
                icon: <ShieldCheck size={24} />,
              },
              {
                title: "Consistency",
                desc: "Maintaining a long-term commitment to improving the lives of children through continuous support and engagement.",
                icon: <Target size={24} />,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="min-w-0 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 sm:rounded-[2.5rem] sm:p-8 lg:p-10"
              >
                <div className="mb-5 text-[#4169E1] sm:mb-6">{item.icon}</div>

                <h4 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
                  {item.title}
                </h4>

                <p className="text-sm leading-7 text-slate-400 sm:text-base sm:leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VIMAUX COMMUNITY */}
      <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-32">
        <div className="mx-auto grid w-full max-w-7xl min-w-0 grid-cols-1 items-center gap-12 px-4 sm:px-6 md:gap-16 lg:grid-cols-2 lg:gap-20 lg:px-8">
          <motion.div
            {...fadeIn}
            className="relative min-w-0 w-full overflow-hidden rounded-[2rem] shadow-2xl sm:rounded-[3rem]"
          >
            <img
              src={img2}
              alt="NGX Community"
              className="aspect-[4/3] h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-blue-900/10 transition-colors" />
          </motion.div>

          <motion.div {...fadeIn} className="min-w-0 w-full">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#4169E1] sm:mb-6 sm:text-sm sm:tracking-[0.3em]">
              Internal Collaboration
            </h2>

            <h3 className="mb-6 text-4xl font-black leading-tight tracking-[-0.04em] sm:mb-8 sm:text-5xl">
              Vimaux Community
            </h3>

            <p className="mb-7 text-base leading-7 text-slate-600 sm:mb-8 sm:text-lg sm:leading-relaxed">
              Vimaux is NGX’s internal community platform where members
              collaborate, share updates, and coordinate projects focused on
              supporting children, orphanages, and community outreach
              initiatives.
            </p>

            <ul className="mb-8 space-y-4 sm:mb-10">
              <li className="flex items-start gap-3 text-sm font-medium leading-6 text-slate-700 sm:text-base">
                <Target size={20} className="mt-0.5 shrink-0 text-[#4169E1]" />
                <span>Role-based Authentication</span>
              </li>

              <li className="flex items-start gap-3 text-sm font-medium leading-6 text-slate-700 sm:text-base">
                <Target size={20} className="mt-0.5 shrink-0 text-[#4169E1]" />
                <span>Community Updates &amp; Posts</span>
              </li>

              <li className="flex items-start gap-3 text-sm font-medium leading-6 text-slate-700 sm:text-base">
                <Target size={20} className="mt-0.5 shrink-0 text-[#4169E1]" />
                <span>Shared Documents &amp; Projects</span>
              </li>
            </ul>

            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white transition-all hover:bg-[#4169E1] sm:w-auto sm:px-10 sm:py-5"
            >
              Access Vimaux
            </button>
          </motion.div>
        </div>
      </section>

      {/* GLOBAL IMPACT */}
      <section className="overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl md:text-6xl">
              Global Impact
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg md:text-xl">
              Supporting children, orphanages, and communities through
              meaningful action.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 md:gap-8">
            <div className="min-w-0 rounded-[1.75rem] border border-slate-100 bg-white p-6 sm:rounded-[2.5rem] sm:p-8 lg:p-10">
              <Globe className="mb-5 text-[#4169E1] sm:mb-6" size={40} />

              <h4 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
                Orphanage Support
              </h4>

              <p className="text-sm leading-7 text-slate-500 sm:text-base sm:leading-relaxed">
                Working with orphanages to provide encouragement, visibility,
                and support for children who need care and attention.
              </p>
            </div>

            <div className="min-w-0 rounded-[1.75rem] border border-slate-100 bg-white p-6 sm:rounded-[2.5rem] sm:p-8 lg:p-10">
              <Users className="mb-5 text-[#4169E1] sm:mb-6" size={40} />

              <h4 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
                Community Empowerment
              </h4>

              <p className="text-sm leading-7 text-slate-500 sm:text-base sm:leading-relaxed">
                Strengthening communities by supporting young people and
                creating opportunities for positive growth.
              </p>
            </div>

            <div className="min-w-0 rounded-[1.75rem] border border-slate-100 bg-white p-6 sm:rounded-[2.5rem] sm:p-8 lg:p-10">
              <Zap className="mb-5 text-[#4169E1] sm:mb-6" size={40} />

              <h4 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">
                Consistent Mission
              </h4>

              <p className="text-sm leading-7 text-slate-500 sm:text-base sm:leading-relaxed">
                Since launching this mission on May 1st 2024, NGX continues to
                work consistently toward helping children and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="overflow-hidden bg-white py-20 sm:py-28 lg:py-40">
        <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
          <motion.div {...fadeIn}>
            <h2 className="mb-8 text-4xl font-black leading-tight tracking-[-0.04em] sm:mb-10 sm:text-5xl md:text-6xl lg:text-7xl">
              Be Part of the{" "}
              <span className="text-[#4169E1]">NGX Mission.</span>
            </h2>

            <button
              onClick={() => navigate("/contact")}
              className="w-full rounded-2xl bg-[#4169E1] px-8 py-5 font-bold text-white shadow-xl shadow-blue-200 transition-all hover:scale-105 sm:w-auto sm:px-12 sm:py-6"
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
