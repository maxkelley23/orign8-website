import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Zap, Target, ArrowRight, Activity, Lock, Check, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';

export const About: React.FC = () => {
   return (
      <div className="w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
         {/* Hero */}
         <section className="relative pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
               <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 font-display tracking-tight animate-fade-in-up">
                  Built by Lenders, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">For Lenders.</span>
               </h1>
               <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                  We aren't just a tech company. We are mortgage professionals who grew tired of losing leads to speed-to-lead failure and compliance anxiety. So we built the solution we needed.
               </p>
            </div>
         </section>

         {/* The Story / Mission */}
         <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
               <div className="animate-fade-in-up delay-200">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800 mb-6">
                     <span className="text-xs font-semibold text-brand-700 dark:text-brand-300 uppercase tracking-wide">Our Mission</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 font-display">
                     Solving the "Lead Leakage" Crisis
                  </h2>
                  <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                     <p>
                        In the mortgage industry, every second counts. But human loan officers can't work 24/7, and they certainly can't make hundreds of calls simultaneously while adhering to strict TCPA regulations.
                     </p>
                     <p>
                        We created Orign8 to bridge the gap between <strong>human empathy</strong> and <strong>machine scale</strong>. Our platform leverages advanced Voice AI to handle the grunt work—lead retention, appointment setting, and outreach—so your LOs can focus on closing loans.
                     </p>
                  </div>
               </div>
               <div className="relative animate-fade-in-up delay-300">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/20 to-purple-500/20 rounded-[2rem] blur-2xl -z-10"></div>
                  <img
                     src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop"
                     alt="Team collaboration"
                     className="rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 grayscale hover:grayscale-0 transition-all duration-700"
                  />
               </div>
            </div>
         </section>

         {/* Core Values / Architecture DNA */}
         <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-16 animate-fade-in-up">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-display">Our Engineering DNA</h2>
                  <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                     We didn't just wrap an LLM in a UI. We built an enterprise-grade orchestration engine designed for the specific rigors of the financial sector.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Card 1 */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group animate-fade-in-up delay-100">
                     <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform">
                        <Shield size={24} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Compliance is Core</h3>
                     <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Our "Compliance Engine" isn't an afterthought. It mechanically prevents calls outside legal windows, checks DNC registries instantly, and adheres to state-specific laws (like Louisiana's Sunday ban) before a call is ever placed.
                     </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group animate-fade-in-up delay-200">
                     <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6 group-hover:scale-110 transition-transform">
                        <Zap size={24} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Resilience at Scale</h3>
                     <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        Our Queue Processor uses circuit breakers and concurrency controls to ensure stability. Whether you have 100 leads or 100,000, our system scales without breaking, ensuring 99.9% uptime during market rallies.
                     </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group animate-fade-in-up delay-300">
                     <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                        <Users size={24} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Lender-Centric Design</h3>
                     <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        We integrate deeply with the tools you actually use, like Total Expert. We know that if the data doesn't sync back to your CRM with the right disposition, the call didn't happen.
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* Why Orign8? - New Section */}
         <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-900/30 to-transparent pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
               <div className="flex flex-col lg:flex-row gap-16 items-center">
                  <div className="w-full lg:w-1/2 animate-fade-in-up">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 mb-6 backdrop-blur-sm">
                        <Sparkles size={14} className="text-brand-300" />
                        <span className="text-xs font-semibold text-brand-300 uppercase tracking-wide">The Orign8 Difference</span>
                     </div>
                     <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display leading-tight">
                        Why leading lenders choose <span className="text-brand-400">Orign8</span> over generic AI.
                     </h2>
                     <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                        Most "AI" dialers are just wrappers around basic scripts. We built a financial-grade origination engine that understands the nuances of the mortgage lifecycle.
                     </p>

                     <div className="space-y-8">
                        {[
                           { title: "Context-Aware Conversations", desc: "Our agents know the loan amount, LTV, and property address before they say 'Hello', creating trust instantly." },
                           { title: "Mechanical Compliance", desc: "We don't rely on training. Our code physically prevents non-compliant calls based on time, frequency, and DNC status." },
                           { title: "Seamless Total Expert Sync", desc: "If it's not in the CRM, it didn't happen. We ensure every disposition and note is logged instantly for your LOs." }
                        ].map((item, i) => (
                           <div key={i} className="flex gap-5 group">
                              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1 group-hover:bg-brand-500/20 group-hover:text-brand-300 transition-all duration-300">
                                 <Check size={22} className="text-green-400 group-hover:text-brand-300 transition-colors" />
                              </div>
                              <div>
                                 <h4 className="text-xl font-bold mb-2 text-white">{item.title}</h4>
                                 <p className="text-slate-400 text-base leading-relaxed">{item.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="w-full lg:w-1/2 relative animate-fade-in-up delay-200">
                     <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-800/40 backdrop-blur-xl p-8 md:p-10">
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 p-32 bg-brand-500/20 blur-[80px] -z-10 rounded-full"></div>

                        <h3 className="text-lg font-semibold text-white mb-6 uppercase tracking-wider opacity-80">ROI Comparison</h3>

                        <div className="space-y-6">
                           <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                              <div className="flex justify-between items-start mb-2">
                                 <div className="text-sm text-slate-400 font-medium">Traditional Call Center</div>
                                 <div className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded border border-red-500/30">High Overhead</div>
                              </div>
                              <div className="text-2xl font-bold text-slate-200 mb-3">
                                 Expensive & Slow to Scale
                              </div>
                              <div className="flex gap-2 mt-4 flex-wrap">
                                 <span className="text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded">High turnover</span>
                                 <span className="text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded">Training lag</span>
                                 <span className="text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded">Human error</span>
                              </div>
                           </div>

                           <div className="bg-gradient-to-br from-brand-600 to-blue-700 p-8 rounded-2xl border border-white/20 shadow-lg relative overflow-hidden group cursor-default transform hover:scale-[1.02] transition-all duration-300">
                              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay"></div>
                              <div className="flex justify-between items-start mb-4">
                                 <div className="text-base font-bold text-brand-50 flex items-center gap-2">
                                    <Sparkles size={16} /> Orign8 AI Agent
                                 </div>
                                 <div className="px-2 py-1 bg-white/20 text-white text-xs rounded border border-white/30 backdrop-blur-md font-bold">Best Value</div>
                              </div>

                              <div className="text-5xl font-bold text-white mb-2 tracking-tight">
                                 10x <span className="text-2xl font-medium opacity-80">ROI</span>
                              </div>
                              <p className="text-brand-100 text-sm mb-6 opacity-90">
                                 Deploy infinite capacity instantly.
                              </p>

                              <div className="grid grid-cols-2 gap-3">
                                 <div className="flex items-center gap-2 text-xs text-white font-medium">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div> Infinite Scale
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-white font-medium">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div> Zero Training
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-white font-medium">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div> 100% Compliant
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-white font-medium">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div> 24/7 Uptime
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Team / Culture Snippet */}
         <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
               <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                     <Lock size={16} className="text-green-500" /> TCPA Compliant
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                     <Activity size={16} className="text-brand-500" /> SOC2 Type II
                  </div>
               </div>
               <p className="text-2xl font-medium text-slate-800 dark:text-slate-200 italic leading-relaxed">
                  "We built Orign8 because we were tired of choosing between non-compliant robo-dialers and expensive human call centers. We knew there had to be a better way."
               </p>
            </div>
         </section>

         {/* Future Vision */}
         <section className="py-24 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-900 dark:bg-black">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
               <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-900/20 to-transparent"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
               <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-8 text-white">
                  <Target size={32} />
               </div>
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-display">More Than Just Voice.</h2>
               <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                  The AI Voice Agent is just the beginning. Orign8 is building a complete suite of automated products designed to handle every aspect of the loan lifecycle that doesn't require a human signature.
               </p>
               <Link to="/contact">
                  <Button className="bg-white text-slate-900 hover:bg-brand-50 h-14 px-8 text-lg border-none hover:scale-105 transition-transform">
                     Join the Movement
                     <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
               </Link>
            </div>
         </section>
      </div>
   );
};