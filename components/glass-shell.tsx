'use client';

import React from 'react';
import { GlassDock } from '@/components/glass-dock';
import { TopHeader } from '@/components/top-header';
import { ProjectProvider } from '@/lib/project-context';
import { AshapuraProject } from '@/lib/ashapura-data';
import { JWTPayloadData } from '@/lib/auth';

interface GlassShellProps {
  session: JWTPayloadData;
  initialProjects?: AshapuraProject[];
  children: React.ReactNode;
}

export function GlassShell({ session, initialProjects, children }: GlassShellProps) {
  return (
    <ProjectProvider initialProjects={initialProjects} userRole={session.role}>
      <div className="h-screen w-screen overflow-hidden p-0 m-0 flex flex-row font-sans select-none relative">
        {/* Flush Left Sidebar Dock (Edge-to-Edge, Zero Outer Padding) */}
        <GlassDock role={session.role} userEmail={session.email} />

        {/* Right Content Area: Fixed Top Header + Scrollable Content */}
        <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden bg-black/25 backdrop-blur-xl">
          {/* Fixed Top Header Bar (Pinned, never scrolls away) */}
          <div className="px-3 pt-3 sm:px-5 sm:pt-4 lg:px-6 lg:pt-5 pb-2 shrink-0 z-40 relative">
            <TopHeader userEmail={session.email} role={session.role} />
          </div>

          {/* Main Content Scroll Area */}
          <main className="flex-1 overflow-y-auto px-3 pt-1 pb-4 sm:px-5 sm:pb-6 lg:px-6 lg:pb-8 space-y-5 custom-glass-scroll min-w-0">
            {children}
          </main>
        </div>
      </div>
    </ProjectProvider>
  );
}
