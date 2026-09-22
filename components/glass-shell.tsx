'use client';

import React from 'react';
import { GlassDock } from '@/components/glass-dock';
import { TopHeader } from '@/components/top-header';
import { ProjectProvider } from '@/lib/project-context';
import { JWTPayloadData } from '@/lib/auth';

interface GlassShellProps {
  session: JWTPayloadData;
  children: React.ReactNode;
}

export function GlassShell({ session, children }: GlassShellProps) {
  return (
    <ProjectProvider>
      <div className="h-screen w-screen overflow-hidden p-0 m-0 flex flex-row font-sans select-none relative">
        {/* Flush Left Sidebar Dock (Edge-to-Edge, Zero Outer Padding) */}
        <GlassDock role={session.role} userEmail={session.email} />

        {/* Main Content Scroll Area (Edge-to-Edge, Zero Outer Padding) */}
        <main className="flex-1 h-screen overflow-y-auto px-3 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5 space-y-5 custom-glass-scroll bg-black/25 backdrop-blur-xl">
          <TopHeader userEmail={session.email} role={session.role} />
          {children}
        </main>
      </div>
    </ProjectProvider>
  );
}
