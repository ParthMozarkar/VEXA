"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Upload, Wand2, Sparkles, CheckCircle2, Star, Zap, Ruler, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <div className="w-full flex flex-col items-center justify-start overflow-hidden pt-12">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center -mt-24 pt-24 pb-32">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#bef264]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-[#a3e635]/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

        {/* Floating Images Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden lg:block">
          <motion.div 
            style={{ y: y1 }}
            animate={{ rotate: [-2, 2, -2], y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[8%] w-48 h-64 rounded-2xl overflow-hidden glass-panel border border-[#bef264]/20 shadow-[0_0_40px_rgba(190,242,100,0.15)] opacity-60"
          >
            <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&h=800&fit=crop" className="w-full h-full object-cover" alt="Model" />
          </motion.div>
          
          <motion.div 
            style={{ y: y2 }}
            animate={{ rotate: [2, -2, 2], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[15%] right-[10%] w-56 h-72 rounded-2xl overflow-hidden glass-panel border border-[#bef264]/20 shadow-[0_0_40px_rgba(190,242,100,0.15)] opacity-80"
          >
            <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop" className="w-full h-full object-cover" alt="Model" />
          </motion.div>

          <motion.div 
            style={{ y: y3 }}
            animate={{ rotate: [-1, 3, -1], y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[10%] left-[15%] w-64 h-80 rounded-2xl overflow-hidden glass-panel border border-[#bef264]/20 shadow-[0_0_40px_rgba(190,242,100,0.15)] opacity-70"
          >
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop" className="w-full h-full object-cover" alt="Model" />
          </motion.div>

          <motion.div 
            style={{ y: y1 }}
            animate={{ rotate: [3, -1, 3], y: [0, -25, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[20%] right-[18%] w-48 h-64 rounded-2xl overflow-hidden glass-panel border border-[#bef264]/20 shadow-[0_0_40px_rgba(190,242,100,0.15)] opacity-60"
          >
            <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop" className="w-full h-full object-cover" alt="Model" />
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl px-4 mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-[#bef264]/30 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#bef264]" />
              <span className="text-sm font-medium text-[#bef264] uppercase tracking-wider">Next-Gen Fashion Tech</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-tight">
              Try Any Outfit on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bef264] to-[#a3e635] drop-shadow-[0_0_30px_rgba(190,242,100,0.3)]">
                Yourself Instantly.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto font-medium">
              AI-powered styling. No guessing. No returns. Experience the flawless fit of any garment before you even buy it.
            </p>
            
            <Link href="/studio">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden rounded-full font-bold tracking-wide text-lg px-10 py-5 bg-[#bef264] text-black hover:bg-[#a3e635] shadow-[0_0_40px_rgba(190,242,100,0.4)] transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                Start Building Your Outfit
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="w-full max-w-7xl mx-auto px-4 py-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-white/60 text-lg">Three simple steps to your perfect fit.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Upload, title: "1. Upload Photo", desc: "Drag and drop a full-body photo. Secure and private." },
            { icon: Zap, title: "2. Pick Outfit", desc: "Choose from an endless catalog of premium garments." },
            { icon: CheckCircle2, title: "3. See Yourself", desc: "Our AI maps the garment seamlessly onto your body." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-[#bef264]/40 transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#bef264]/10 flex items-center justify-center mb-6">
                <item.icon className="w-8 h-8 text-[#bef264]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-white/60">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. DEMO PREVIEW SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Hyper-Realistic <br />
              <span className="text-[#bef264]">AI Try-On</span>
            </h2>
            <p className="text-lg text-white/60">
              Don't just imagine how clothes look on you. See exactly how they drape, fit, and align with your body semantics in real time.
            </p>
            
            <ul className="space-y-4 pt-4">
              {["Preserves original pose & background", "Accurate shadow mapping", "Textile texture preservation"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#bef264]" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Simple Before/After Demo */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[3/4] sm:aspect-square w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(190,242,100,0.15)] border border-[#bef264]/20"
          >
            {/* Base Fake Result Image */}
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop" className="w-full h-full object-cover" alt="Result" />
            
            {/* Comparison Line (Static Representation) */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-[#bef264] -translate-x-1/2 shadow-[0_0_10px_rgba(190,242,100,1)] z-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-xl">
                <ChevronLeft className="w-4 h-4 -mr-1" />
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            
            {/* Original Image Slice */}
            <div className="absolute top-0 bottom-0 left-0 w-1/2 overflow-hidden z-10 filter grayscale brightness-50 contrast-125">
               <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop" className="h-full w-[200%] object-cover max-w-none" alt="Original" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. FEATURES */}
      <section className="w-full max-w-7xl mx-auto px-4 py-32 relative z-10 border-t border-white/10 mt-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Built for the Future</h2>
          <p className="text-white/60 text-lg">Enterprise-grade AI, designed for end-users.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <Wand2 className="w-8 h-8 text-[#bef264] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Smart Styling Assistant</h3>
            <p className="text-white/60">Get AI-driven feedback on silhouette, fit, and proportions instantly.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <Ruler className="w-8 h-8 text-[#bef264] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Sizing Intelligence</h3>
            <p className="text-white/60">Our engine calculates your body metrics to recommend the strict perfect size, avoiding returns.</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl border border-white/10">
            <ShieldCheck className="w-8 h-8 text-[#bef264] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Privacy First</h3>
            <p className="text-white/60">All data is processed ephemerally and completely discarded post-generation.</p>
          </div>
        </div>
        
        <div className="mt-20 flex justify-center">
          <Link href="/studio">
            <button className="px-12 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors">
              Enter The Studio
            </button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/10 text-center text-white/40 text-sm mt-32">
        &copy; {new Date().getFullYear()} Vexa Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
}
