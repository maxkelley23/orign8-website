import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Zap, ShieldCheck, GitMerge, Activity, Mic, Server } from 'lucide-react';

export const Product: React.FC = () => {
  return (
    <div className="w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">

      {/* Clean, Adaptive Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-200/20 dark:bg-brand-900/20 rounded-[100%] blur-3xl -z-10" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span className="text-xs font-semibold text-brand-700 dark:text-brand-300 tracking-wide uppercase">Orign8 Suite</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display tracking-tight text-slate-900 dark:text-white animate-fade-in-up delay-100">
            The Core Platform for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">Compliance-First Growth</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Orign8 combines enterprise-grade queue processing with advanced voice AI to create the most resilient origination engine on the market.
          </p>
        </div>
      </section>

      {/* Capability Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

          {/* Left Side: Features List */}
          <div className="lg:col-span-7 space-y-20">

            {/* Feature 1: Compliance Engine */}
            <div className="flex gap-6 group">
              <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-green-100 dark:border-slate-800 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                <ShieldCheck size={32} className="text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-display">The Compliance Engine</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                  A dedicated layer that checks every single call request against a strict set of rules before it proceeds. We mechanically enforce calling windows (8am-9pm local) and DNC lists.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div> Timezone Awareness
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div> Frequency Caps (Max 3 calls/day)
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div> State-Specific Logic (e.g. Louisiana laws)
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

            {/* Feature 2: Queue Processor */}
            <div className="flex gap-6 group">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-brand-100 dark:border-slate-800 shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                <Zap size={32} className="text-brand-600 dark:text-brand-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-display">Resilient Queue Processor</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                  The heart of the system. We manage concurrency to avoid overwhelming your team and implement "Circuit Breakers" to pause calling if external providers fail.
                </p>
                <div className="mt-6 flex gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">Concurrency Control</span>
                  <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">Smart Retries</span>
                  <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">99.9% Uptime</span>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800"></div>

            {/* Feature 3: CRM Integration */}
            <div className="flex gap-6 group">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-purple-100 dark:border-slate-800 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                <GitMerge size={32} className="text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-display">Total CRM Sync</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                  Seamless bi-directional integration with platforms like Total Expert. We fetch leads, inject borrower context into the AI, and push back call notes and dispositions instantly.
                </p>
              </div>
            </div>
          </div>

          {/* Right side graphic - Sticky with Warp-style Backdrop */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32">

              {/* Warp-style glow behind the component */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-brand-500/30 to-purple-500/30 dark:from-brand-500/20 dark:to-purple-500/20 rounded-[32px] blur-3xl -z-10 opacity-70 animate-pulse-subtle"></div>
              {/* Texture image behind component */}
              <div className="absolute inset-0 z-[-5] rounded-2xl overflow-hidden opacity-30 dark:opacity-40">
                <img src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover blur-xl scale-150" alt="Texture" />
              </div>

              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-green-500 animate-pulse" />
                    <span className="text-sm font-mono text-slate-500 dark:text-slate-400 font-medium">LIVE TRANSCRIPT</span>
                  </div>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded font-bold tracking-wide">ACTIVE</span>
                </div>

                <div className="space-y-6 font-sans max-h-[500px] overflow-y-auto no-scrollbar pr-2">
                  {/* Message Blocks */}
                  <div className="flex gap-4 animate-fade-in-up">
                    <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-xs text-white font-bold shrink-0">AI</div>
                    <div className="space-y-1">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed shadow-sm border border-slate-100 dark:border-slate-700">
                        Hi Sarah, this is Alex from Orign8 Mortgage. I saw you were looking at rates online. Did you have a specific loan amount in mind?
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1 uppercase tracking-wide font-medium">
                        <Mic size={10} /> 1.2s Latency
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 flex-row-reverse animate-fade-in-up delay-200">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs text-purple-700 dark:text-purple-300 font-bold shrink-0 border border-purple-200 dark:border-purple-800">S</div>
                    <div className="space-y-1 text-right">
                      <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 p-4 rounded-2xl rounded-tr-none text-slate-700 dark:text-slate-200 text-sm leading-relaxed shadow-sm text-left">
                        Yeah, looking around $450k, but I'm worried about where rates are today.
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 animate-fade-in-up delay-400">
                    <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-xs text-white font-bold shrink-0">AI</div>
                    <div className="space-y-1">
                      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed shadow-sm border border-slate-100 dark:border-slate-700">
                        I completely understand that concern. The market has been volatile. We actually have a few programs that offer rate buydowns. Do you have 5 minutes to chat with our senior loan officer about that?
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center py-4 animate-fade-in delay-500">
                    <div className="text-xs text-slate-400 italic flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      Call Transferred to Senior Loan Officer (555-019-2834)
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack Floating Tags */}
              <div className="absolute -right-8 top-10 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2 animate-float">
                <Server size={16} className="text-brand-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Total Expert</span>
              </div>
              <div className="absolute -left-4 bottom-20 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2 animate-float" style={{ animationDelay: '2s' }}>
                <ShieldCheck size={16} className="text-green-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">TCPA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display text-slate-900 dark:text-white">Ready to deploy?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">Get a custom demo of the Orign8 platform tailored to your specific volume and lead sources.</p>
          <Link to="/contact">
            <Button className="text-lg px-10 py-4 bg-slate-900 text-white hover:bg-slate-800 shadow-xl dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">Build Your Agent</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};