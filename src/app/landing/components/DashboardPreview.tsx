"use client";

import React from 'react';
import Link from 'next/link';

const gradText = "bg-gradient-to-r from-indigo-300 via-indigo-400 to-blue-300 bg-clip-text text-transparent";
const gradCTA = "bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400";

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative py-20 border-t border-white/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Your <span className={gradText}>Dashboard</span>
              <br />
              Track progress, unlock insights
            </h2>
            <p className="mt-4 text-slate-300/90">
              Once you complete your assessment, access your personalized dashboard with 
              detailed insights, growth recommendations, and your daily chapter progression.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-100">Strengths & Growth Areas</h4>
                  <p className="text-sm text-slate-300/90">Detailed analysis of your personality dimensions with actionable insights</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-100">Personalized Goals</h4>
                  <p className="text-sm text-slate-300/90">AI-generated development goals based on your Human Framework profile</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-100">Progress Tracking</h4>
                  <p className="text-sm text-slate-300/90">Monitor your journey through daily chapters and achievement milestones</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition font-medium"
              >
                Explore Dashboard Preview →
              </Link>
            </div>
          </div>
          <div className="relative">
            {/* Dashboard mockup */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Your Profile</h3>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" />
              </div>
              
              <div className="space-y-4">
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Primary Type</span>
                    <span className="text-sm text-slate-400">Reformer</span>
                  </div>
                </div>
                
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Color Alignment</span>
                    <span className="text-sm text-slate-400">Sunglow</span>
                  </div>
                </div>
                
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <div className="mb-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Current Goals</span>
                      <span className="text-xs text-slate-400">3/5 Complete</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full" style={{width: '60%'}} />
                  </div>
                </div>
                
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <span className="text-sm font-medium">Today's Chapter</span>
                  <p className="text-xs text-slate-400 mt-1">Exploring Inner Harmony</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}