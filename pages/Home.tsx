import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Zap, Shield, ArrowRight, BarChart3, MessageSquare, Clock, Check, Sparkles, Database, Loader2, Lock } from 'lucide-react';

import { Button } from '../components/Button';
import { LazyImage } from '../components/LazyImage';
import { ButtonVariant } from '../types';
import { trackCtaClick } from '../services/analytics';

export const Home: React.FC = () => {
  // Initialize with placeholders to prevent layout shift, but track loading state
  const [bgImages, setBgImages] = useState({
    speed: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
    reactivation: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2000&auto=format&fit=crop",
    compliance: "https://images.unsplash.com/photo-1614850523060-8da1d56a37cf?q=80&w=2000&auto=format&fit=crop",
    analytics: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop"
  });
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({
    speed: true,
    reactivation: true,
    compliance: true,
    analytics: true
  });

  useEffect(() => {
    const generateBackgrounds = async () => {
      const cards = [
        {
          key: 'speed',
          prompt: 'Surrealism painting with a beautiful scenery, motion blur of a high speed futuristic train travelling through a cloud city at golden hour, oil painting style, highly detailed, 8k',
          aspectRatio: '16:9'
        },
        {
          key: 'reactivation',
          prompt: 'Surrealism painting with a beautiful scenery, a dormant ancient garden suddenly blooming with bioluminescent flowers in twilight, oil painting style, highly detailed, 8k',
          aspectRatio: '9:16'
        },
        {
          key: 'compliance',
          prompt: 'Surrealism painting with a beautiful scenery, a perfectly symmetrical glass fortress standing calm in a turbulent ocean, safe, oil painting style, highly detailed, 8k',
          aspectRatio: '4:3'
        },
        {
          key: 'analytics',
          prompt: 'Surrealism painting with a beautiful scenery, complex constellations connecting in a deep blue night sky over mountains, insightful, oil painting style, highly detailed, 8k',
          aspectRatio: '4:3'
        }
      ];

      cards.forEach(async (card) => {
        try {
          const response = await fetch('/api/generate-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gemini-2.0-flash', // Using flash for speed on home page
              contents: [{ parts: [{ text: card.prompt }] }],
              config: {
                imageConfig: {
                  aspectRatio: card.aspectRatio
                }
              }
            }),
          });

          if (!response.ok) throw new Error('Failed to generate content');

          const data = await response.json();

          if (data.candidates?.[0]?.content?.parts) {
            for (const part of data.candidates[0].content.parts) {
              if (part.inlineData) {
                setBgImages(prev => ({
                  ...prev,
                  [card.key]: `data:image/png;base64,${part.inlineData.data}`
                }));
                break;
              }
            }
          }
        } catch (error) {
          console.error(`Failed to generate background for ${card.key}:`, error);
        } finally {
          setLoadingImages(prev => ({ ...prev, [card.key]: false }));
        }
      });
    };

    generateBackgrounds();
  }, []);

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-6 z-10 transition-colors duration-300">

        {/* Main Hero Background - Surreal Landscape */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Base Image: Majestic, surreal abstract fluid landscape - Softened */}
          <LazyImage
            src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop"
            alt="Surreal Landscape"
            className="w-full h-full object-cover opacity-5 dark:opacity-10 transition-opacity duration-500 scale-105 filter blur-2xl"
            placeholderClassName="w-full h-full"
          />

          {/* Gradient Overlay for Text Readability - More opaque for subtlety */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/50 to-white dark:from-slate-950/80 dark:via-slate-950/50 dark:to-slate-950 transition-colors duration-300"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 mb-8 animate-fade-in-up backdrop-blur-md shadow-sm hover:scale-105 transition-transform cursor-default group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wide uppercase group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Now enrolling for Q4 Cohort</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 dark:text-white mb-8 leading-[1.1] text-balance animate-fade-in-up delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
            Built by Lenders, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">
              For Lenders.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed text-balance animate-fade-in-up delay-300 opacity-0 font-medium tracking-tight" style={{ animationFillMode: 'forwards' }}>
            Orign8 deploys hyper-realistic Voice AI agents to nurture your past client database and convert new leads 24/7, fully integrated with your CRM.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-400 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <Link to="/contact" onClick={() => trackCtaClick({ ctaName: 'Start Growing', location: 'hero' })}>
              <Button className="h-14 px-8 text-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 shadow-[0_0_20px_-5px_rgba(0,0,0,0.2)] dark:shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300 rounded-full">
                Start Growing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/product" onClick={() => trackCtaClick({ ctaName: 'Platform Tour', location: 'hero' })}>
              <Button variant={ButtonVariant.OUTLINE} className="h-14 px-8 text-lg border-slate-300 text-slate-700 hover:bg-slate-50 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white bg-white/50 dark:bg-transparent backdrop-blur-sm rounded-full">
                Platform Tour
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Visual / Dashboard Preview with Warp-style Backdrop */}
        <div className="mt-20 max-w-6xl mx-auto relative animate-fade-in-up delay-500 opacity-0 z-20" style={{ animationFillMode: 'forwards' }}>

          {/* Warp-style Atmospheric Backdrop behind the Product */}
          <div className="absolute -inset-4 md:-inset-10 bg-gradient-to-b from-brand-500/20 to-purple-600/20 dark:from-brand-500/30 dark:to-purple-600/30 rounded-[3rem] blur-3xl -z-10 opacity-70"></div>

          {/* Image Texture Layer behind product (Cosmic/Nebula vibe) */}
          <div className="absolute -inset-1 z-[-5] rounded-[32px] overflow-hidden opacity-40 dark:opacity-60 mix-blend-screen pointer-events-none">
            <LazyImage src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover blur-3xl scale-110" alt="Glow" placeholderClassName="w-full h-full" />
          </div>

          {/* New Premium Frame Container */}
          <div className="rounded-[24px] bg-white/40 dark:bg-slate-900/40 p-2 ring-1 ring-inset ring-white/60 dark:ring-white/10 backdrop-blur-3xl shadow-2xl">
            <div className="relative rounded-[20px] border border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/95 overflow-hidden transition-colors duration-300">
              {/* Mock Browser Header */}
              <div className="h-12 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 gap-4 transition-colors duration-300">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400/20 border border-yellow-400/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/50"></div>
                </div>
                <div className="flex-1 max-w-md mx-auto bg-white dark:bg-slate-900 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs font-medium text-slate-400 shadow-sm">
                  <Lock size={10} className="mr-1.5 opacity-50" /> orign8.app
                </div>
              </div>
              {/* Dashboard Content */}
              <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-950/50 grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors duration-300">
                {/* Left Col */}
                <div className="col-span-1 space-y-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300 relative overflow-hidden group">
                    {/* Subtle Card Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2 relative z-10">Active Queue</div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white relative z-10 tracking-tight">14</div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1.5 relative z-10 font-medium bg-green-50 dark:bg-green-900/20 w-fit px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Optimal
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                    <div className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Appointments Set</div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">8</div>
                    <div className="text-xs text-slate-400 mt-2 font-medium">Synced to Total Expert</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex-grow transition-colors duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs font-bold tracking-wider text-slate-400 uppercase">Recent Activity</div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 text-sm group cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800 group-hover:scale-110 transition-transform">
                            <Phone size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 dark:text-slate-200 truncate">Lead #{1020 + i}</div>
                            <div className="text-xs text-slate-500 font-medium">Interest Verified • 2m ago</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Col - Chat Interface */}
                <div className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-colors duration-300 min-h-[400px]">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 transition-colors duration-300 z-10 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xs shadow-md">AI</div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">Orign8 Agent</div>
                        <div className="text-xs text-green-500 font-medium flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-green-500"></span>
                          Active Call
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-500 border border-red-100 dark:border-red-900/50 text-[10px] font-bold px-2 py-1 rounded-md animate-pulse flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> REC
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-950/30 transition-colors duration-300 relative">
                    {/* Chat Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

                    <div className="absolute inset-0 p-6 space-y-6 overflow-y-auto">
                      <div className="flex gap-4 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">JD</div>
                        <div className="space-y-1">
                          <div className="text-xs text-slate-400 ml-1">John Doe • 0:14</div>
                          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl rounded-tl-none text-slate-700 dark:text-slate-300 text-sm shadow-sm max-w-md">
                            I'm mostly just looking at rates right now, honestly. I don't want to pull credit yet.
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 flex-row-reverse relative z-10">
                        <div className="w-8 h-8 rounded-full bg-brand-600 shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md">AI</div>
                        <div className="space-y-1 text-right">
                          <div className="text-xs text-slate-400 mr-1">AI Agent • 0:19</div>
                          <div className="bg-brand-600 text-white p-3.5 rounded-2xl rounded-tr-none text-sm shadow-md max-w-md text-left border border-brand-500">
                            That's completely fair. The market moves fast. I can share a soft quote based on today's par rates without a hard pull. Would that be helpful?
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">JD</div>
                        <div className="flex gap-1 items-center h-10 bg-white dark:bg-slate-800 px-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700">
                          <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-100"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-200"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid with AI-style Scenery */}
      <section className="py-24 px-6 relative z-10 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-display tracking-tight">The Complete Origination Engine</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Stop losing leads to speed-to-lead failure. Orign8 combines resilience, intelligence, and strict compliance in one platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Feature 1: Speed to Lead */}
            <div className="md:col-span-2 row-span-1 md:row-span-2 rounded-[32px] p-10 border border-slate-200 dark:border-slate-800 flex flex-col relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700">
              <div className="absolute inset-0 bg-slate-900">
                {loadingImages.speed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="w-8 h-8 text-slate-600 animate-spin" />
                  </div>
                )}
                <img
                  src={bgImages.speed}
                  alt="Abstract Surreal Speed"
                  className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${loadingImages.speed ? 'opacity-0' : 'opacity-100'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300"></div>
              </div>

              <div className="relative z-10 mt-auto">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Zap size={28} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3 font-display tracking-tight text-shadow-sm">Smart Queue Processor</h3>
                <p className="text-slate-300 leading-relaxed max-w-md font-medium text-lg">
                  We manage concurrency and implement smart retries to ensure immediate contact. Our circuit-breaker technology prevents system overload.
                </p>
              </div>
            </div>

            {/* Feature 2: Database Reactivation */}
            <div className="md:col-span-1 row-span-1 md:row-span-2 rounded-[32px] p-10 border border-slate-200 dark:border-slate-800 flex flex-col relative overflow-hidden group hover:shadow-xl transition-all duration-500 hover:border-slate-300 dark:hover:border-slate-700">
              <div className="absolute inset-0 bg-slate-900">
                {loadingImages.reactivation && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="w-8 h-8 text-slate-600 animate-spin" />
                  </div>
                )}
                <img
                  src={bgImages.reactivation}
                  alt="Surreal Crystal Discovery"
                  className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${loadingImages.reactivation ? 'opacity-0' : 'opacity-100'}`}
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors"></div>
              </div>

              <div className="relative z-10 h-full flex flex-col text-white justify-end">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center mb-6 text-white shadow-lg group-hover:rotate-6 transition-transform duration-500">
                  <Database size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-display text-white tracking-tight">Infinite Scalability</h3>
                <p className="text-slate-300 leading-relaxed mb-0 font-medium">
                  Mine your entire past database simultaneously. Our AI Call Executor personalizes every conversation.
                </p>
              </div>
            </div>

            {/* Feature 3: TCPA */}
            <div className="md:col-span-1 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden min-h-[260px] flex flex-col justify-end hover:border-slate-300 dark:hover:border-slate-700">
              <div className="absolute inset-0 bg-slate-900">
                {loadingImages.compliance && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="w-8 h-8 text-slate-600 animate-spin" />
                  </div>
                )}
                <img
                  src={bgImages.compliance}
                  alt="Geometric Structure Compliance"
                  className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${loadingImages.compliance ? 'opacity-0' : 'opacity-100'}`}
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors"></div>
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center mb-4 text-white border border-white/20 group-hover:scale-110 transition-transform duration-500">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display tracking-tight">"Sleep Well" Compliance</h3>
                <p className="text-sm text-slate-300 font-medium">Mechanically enforced calling windows, frequency caps, and DNC checks.</p>
              </div>
            </div>

            {/* Feature 4: Analytics */}
            <div className="md:col-span-1 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden min-h-[260px] flex flex-col justify-end hover:border-slate-300 dark:hover:border-slate-700">
              <div className="absolute inset-0 bg-slate-900">
                {loadingImages.analytics && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="w-8 h-8 text-slate-600 animate-spin" />
                  </div>
                )}
                <img
                  src={bgImages.analytics}
                  alt="Galactic Network Analytics"
                  className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${loadingImages.analytics ? 'opacity-0' : 'opacity-100'}`}
                />
                <div className="absolute inset-0 bg-black/70 group-hover:bg-black/60 transition-colors"></div>
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center mb-4 text-white border border-white/20 group-hover:scale-110 transition-transform duration-500">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display tracking-tight">Intelligent Orchestration</h3>
                <p className="text-sm text-slate-300 font-medium">Automatic timezone detection and smart call queues for optimal contact rates.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Demo Teaser */}
      <section className="py-32 px-6 relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 font-display leading-tight tracking-tighter">
              Conversations that <br />actually convert.
            </h2>
            <div className="space-y-10">
              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0 border border-brand-100 dark:border-brand-800 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Contextual Awareness</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">Most AI sounds robotic. Orign8 injects borrower data and loan details to pivot naturally like a senior LO.</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 border border-purple-100 dark:border-purple-800 group-hover:scale-110 transition-transform duration-300">
                  <Clock size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">24/7 Availability</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">Leads don't just come in 9-5. Your AI agent works nights, weekends, and holidays to ensure no opportunity is missed.</p>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <Link to="/product">
                <Button variant={ButtonVariant.OUTLINE} className="px-8 h-12 text-base dark:border-slate-700 dark:text-slate-300 dark:hover:text-white rounded-full">Technical Deep Dive</Button>
              </Link>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            {/* Abstract Glow behind Chat */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full blur-[100px] opacity-50 -z-10 animate-pulse-subtle"></div>
            <ChatDemo />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 dark:bg-slate-900 px-6 py-20 md:px-20 md:py-28 text-center shadow-2xl group">
            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105">
              <LazyImage
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop"
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                alt="CTA Background"
                placeholderClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/30"></div>
            </div>

            {/* Animated Gradient Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/20 rounded-full blur-[120px] animate-pulse-subtle"></div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 text-white/90 text-sm font-medium animate-fade-in-up shadow-lg">
                <Sparkles size={16} className="text-brand-300" />
                <span className="tracking-wide uppercase text-xs font-bold">AI-First Mortgage Origination</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 font-display tracking-tighter leading-tight animate-fade-in-up delay-100 drop-shadow-sm">
                Scale your volume without <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 via-white to-purple-200">scaling your payroll.</span>
              </h2>

              <p className="text-xl text-slate-300 mb-12 leading-relaxed animate-fade-in-up delay-200 max-w-2xl mx-auto font-medium">
                Join the top 1% of lenders using Orign8 to automate follow-up, qualify leads, and book appointments 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
                <Link to="/contact" onClick={() => trackCtaClick({ ctaName: 'Get Started Now', location: 'footer-cta' })}>
                  <Button className="h-16 px-10 text-lg bg-white text-slate-900 hover:bg-brand-50 hover:scale-105 transition-all duration-300 border-none shadow-[0_0_30px_rgba(255,255,255,0.25)] rounded-full font-bold">
                    Get Started Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/product" onClick={() => trackCtaClick({ ctaName: 'View Platform Demo', location: 'footer-cta' })}>
                  <Button variant={ButtonVariant.OUTLINE} className="h-16 px-10 text-lg border-slate-600 text-white hover:bg-white/10 hover:text-white hover:border-white backdrop-blur-sm rounded-full">
                    View Platform Demo
                  </Button>
                </Link>
              </div>

              <div className="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 animate-fade-in-up delay-400 opacity-80">
                <div className="flex items-center gap-3 text-slate-300 font-medium">
                  <div className="bg-green-500/20 p-1 rounded-full"><Check size={14} className="text-green-400" /></div> <span>SOC2 Compliant</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 font-medium">
                  <div className="bg-green-500/20 p-1 rounded-full"><Check size={14} className="text-green-400" /></div> <span>Seamless CRM Sync</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300 font-medium">
                  <div className="bg-green-500/20 p-1 rounded-full"><Check size={14} className="text-green-400" /></div> <span>No Contract Lock-in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Improved Chat Demo with State Machine Logic
const ChatDemo: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const timeoutIds: NodeJS.Timeout[] = [];

    const runSequence = () => {
      if (!mounted) return;

      const steps = [
        { delay: 1000, fn: () => setMessages([{ role: 'user', text: "Hi, I was looking at the 30-year fixed rate you have listed." }]) },
        { delay: 2500, fn: () => setIsTyping(true) },
        { delay: 4000, fn: () => { setIsTyping(false); setMessages(prev => [...prev, { role: 'ai', text: "Thanks for reaching out, John. The rates change daily, but I can lock you in today if we move forward. What's your timeline?" }]) } },
        { delay: 6000, fn: () => setMessages(prev => [...prev, { role: 'user', text: "Ideally within the next 60 days." }]) },
        { delay: 7500, fn: () => setIsTyping(true) },
        { delay: 9000, fn: () => { setIsTyping(false); setMessages(prev => [...prev, { role: 'ai', text: "Perfect. We have a 60-day lock program. Would you like to see a total cost analysis?" }]) } },
        { delay: 15000, fn: () => { setMessages([]); runSequence(); } } // Loop
      ];

      steps.forEach(({ delay, fn }) => {
        const id = setTimeout(() => {
          if (mounted) fn();
        }, delay);
        timeoutIds.push(id);
      });
    };

    runSequence();

    return () => {
      mounted = false;
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 relative hover:translate-y-[-5px] transition-transform duration-500 min-h-[500px] flex flex-col ring-1 ring-black/5 dark:ring-white/5">
      <div className="absolute -top-4 -right-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide uppercase">Live Demo</div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-white">John Smith</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Online • Lead Score: 85
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">ID: #8823</div>
      </div>

      {/* Messages Area */}
      <div className="space-y-6 flex-grow relative overflow-y-auto no-scrollbar" ref={scrollRef}>
        {messages.length === 0 && !isTyping && (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 text-sm animate-pulse">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mb-3"></div>
            Waiting for incoming lead...
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`p-4 rounded-2xl text-[15px] max-w-[85%] shadow-sm animate-fade-in leading-relaxed ${msg.role === 'user'
            ? 'bg-slate-100 dark:bg-slate-800 rounded-tl-none text-slate-800 dark:text-slate-200 mr-auto'
            : 'bg-brand-600 dark:bg-brand-600 rounded-tr-none text-white ml-auto'}`}>
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div className="ml-auto bg-brand-600 dark:bg-brand-600 p-4 rounded-2xl rounded-tr-none w-20 flex items-center justify-center gap-1.5 shadow-sm animate-fade-in">
            <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></span>
            <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></span>
          </div>
        )}
      </div>

      {/* Bottom Status */}
      <div className="pt-6 mt-6 border-t border-slate-50 dark:border-slate-800">
        <div className="flex justify-between text-xs font-semibold mb-2 text-slate-500 dark:text-slate-400">
          <span>Lead Quality</span>
          <span className="text-green-600 dark:text-green-400">High Intent (85%)</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-green-600 w-[85%] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};