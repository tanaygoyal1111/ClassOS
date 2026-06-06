import React from 'react';
import Link from 'next/link';
import { Zap, RefreshCw, LayoutTemplate, Sliders, Download, Cloud, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 overflow-x-hidden selection:bg-[#FF5A36]/20">
      
      {/* 1. Navbar (Simple & Clean) */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">C</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-black">ClassOS</span>
          </div>
          <div className="flex items-center gap-6">
            {!session ? (
              <>
                <Link href="/login" className="font-medium text-sm text-gray-600 hover:text-black transition-colors">
                  Login
                </Link>
                <Link href="/login" className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 shadow-sm">
                  Get Started
                </Link>
              </>
            ) : (
              <Link href="/dashboard" className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 shadow-sm flex items-center gap-2">
                Go to Dashboard
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-36 pb-20 md:py-24 px-6 relative max-w-7xl mx-auto mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center">
          
          {/* Left Col */}
          <div className="flex flex-col items-start pr-0 md:pr-10">
            <div className="bg-gray-100 text-gray-700 rounded-full px-4 py-1.5 text-sm font-medium border border-gray-200 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse"></div>
              AI-Powered Assessment Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mt-6 leading-[1.1]">
              Create Perfect Question Papers in <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Seconds</span>
            </h1>
            <p className="text-lg md:text-[19px] text-gray-500 mt-6 leading-relaxed max-w-lg">
              Transform your teaching workflow with AI-generated assessments. Upload content, set parameters, and get professionally structured question papers instantly.
            </p>
            <Link href={session ? "/dashboard" : "/login"} className="bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl text-lg font-semibold mt-8 transition-all active:scale-95 shadow-xl shadow-black/10 flex items-center gap-2">
              {session ? "Go to Dashboard" : "Get Started Free"}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            
            {/* Stats Row */}
            <div className="flex items-center gap-8 md:gap-12 mt-12 pt-10 border-t border-gray-100 w-full">
              <div>
                <p className="text-3xl font-black text-black">10K+</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Papers Generated</p>
              </div>
              <div>
                <p className="text-3xl font-black text-black">500+</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Active Teachers</p>
              </div>
              <div>
                <p className="text-3xl font-black text-black">98%</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Satisfaction Rate</p>
              </div>
            </div>
          </div>

          {/* Right Col (Visual Mockup) */}
          <div className="relative">
            {/* Abstract Background Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-gray-100 to-gray-50 rounded-full blur-3xl opacity-50 -z-10"></div>
            
            <div className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] p-8 bg-white border border-gray-100 relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Physics Mid-Term Exam</h3>
                  <p className="text-sm text-gray-500 font-medium">Class 12 • 50 Marks</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  { title: "Section A - MCQs", q: "10 Questions" },
                  { title: "Section B - Short Answer", q: "5 Questions" },
                  { title: "Section C - Long Answer", q: "3 Questions" }
                ].map((row, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100/50">
                    <span className="font-semibold text-gray-700 text-sm">{row.title}</span>
                    <span className="text-xs font-bold bg-gray-200/60 text-gray-600 px-3 py-1 rounded-md">{row.q}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-2">
                <span>Processing...</span>
                <span>Generating...</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-black w-2/3 h-full rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Features Section */}
      <section className="bg-white py-24 px-6 border-y border-gray-100 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Everything You Need to Create Perfect Assessments</h2>
            <p className="text-lg text-gray-500 mt-4 font-medium">Powerful AI technology combined with intelligent features to save you hours of work.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "AI-Powered Generation", desc: "Advanced AI creates contextually relevant questions from your uploaded content with proper difficulty distribution." },
              { icon: RefreshCw, title: "Real-Time Updates", desc: "WebSocket-powered live progress tracking. Watch your question paper being generated in real-time." },
              { icon: LayoutTemplate, title: "Smart Sectioning", desc: "Automatically organizes questions into logical sections with proper instructions and mark distribution." },
              { icon: Sliders, title: "Difficulty Balancing", desc: "Intelligent distribution of easy, moderate, and hard questions to ensure fair assessment." },
              { icon: Download, title: "Export to PDF", desc: "Download professionally formatted question papers ready for printing or digital distribution." },
              { icon: Cloud, title: "Cloud Storage", desc: "All your assessments stored securely with MongoDB. Access them anytime, anywhere." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black transition-colors">
                  <feature.icon className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="py-24 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">How It Works</h2>
            <p className="text-lg text-gray-500 mt-4 font-medium">Generate professional question papers in just three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { num: "01", title: "Upload & Configure", desc: "Upload your study material or enter topics. Set question types, count, marks, and difficulty preferences." },
              { num: "02", title: "AI Generation", desc: "Our advanced AI processes your content and generates contextually relevant questions with proper distribution." },
              { num: "03", title: "Review & Export", desc: "Review the generated paper, make adjustments if needed, and export to PDF for immediate use." }
            ].map((step, idx) => (
              <div key={idx} className="relative pt-12 text-center md:text-left">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 text-gray-200 text-[100px] font-black leading-none -z-10 select-none pointer-events-none">
                  {step.num}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA & Footer */}
      <section className="bg-white px-6">
        <div className="max-w-5xl mx-auto my-24 bg-[#0A0A0A] rounded-[2.5rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
          {/* Subtle Glow inside CTA */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight relative z-10">
            Ready to Transform Your <br className="hidden md:block" /> Assessment Creation?
          </h2>
          <p className="text-gray-400 mt-6 text-lg font-medium max-w-2xl mx-auto relative z-10">
            Join hundreds of educators who are saving time and creating better assessments with AI.
          </p>
          <Link href="/login" className="inline-block bg-white hover:bg-gray-100 text-black px-10 py-4 rounded-full font-bold text-lg mt-10 transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] relative z-10">
            Start Creating for Free
          </Link>
        </div>

        <footer className="max-w-7xl mx-auto pt-10 pb-8 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm leading-none">C</span>
                </div>
                <span className="font-extrabold text-lg tracking-tight text-black">ClassOS</span>
              </div>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Creating the future of educational assessments with AI technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-3 text-sm font-medium text-gray-500">
                <li><Link href="#" className="hover:text-black transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors">Use Cases</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-3 text-sm font-medium text-gray-500">
                <li><Link href="#" className="hover:text-black transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors">Tutorials</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm font-medium text-gray-500">
                <li><Link href="#" className="hover:text-black transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-black transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm font-medium text-gray-400 pt-8 border-t border-gray-100">
            © {new Date().getFullYear()} ClassOS. All rights reserved.
          </div>
        </footer>
      </section>

    </div>
  );
}
