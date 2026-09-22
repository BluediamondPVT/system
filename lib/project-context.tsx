'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  AshapuraProject,
  ASHAPURA_PROJECTS,
  InventoryUnit,
  generateInitialInventory,
  LeadProspect,
  INITIAL_LEADS,
  DemandNotice,
  INITIAL_DEMANDS,
} from '@/lib/ashapura-data';
import { toast } from 'sonner';

interface ProjectContextType {
  projects: AshapuraProject[];
  activeProject: AshapuraProject;
  setActiveProjectById: (id: string) => void;
  inventory: InventoryUnit[];
  updateUnitStatus: (unitId: string, status: 'Available' | 'Hold' | 'Booked' | 'JV', tokenHolder?: string) => void;
  leads: LeadProspect[];
  addLead: (lead: Omit<LeadProspect, 'id' | 'createdAt'>) => void;
  updateLeadStage: (id: string, stage: LeadProspect['stage']) => void;
  demands: DemandNotice[];
  addDemand: (demand: Omit<DemandNotice, 'id' | 'noticeCode' | 'dispatched'>) => void;
  sendNotice: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedQuotationUnit: InventoryUnit | null;
  setSelectedQuotationUnit: (unit: InventoryUnit | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects] = useState<AshapuraProject[]>(ASHAPURA_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>('meghmala-crysta');
  const [inventory, setInventory] = useState<InventoryUnit[]>(() => generateInitialInventory());
  const [leads, setLeads] = useState<LeadProspect[]>(INITIAL_LEADS);
  const [demands, setDemands] = useState<DemandNotice[]>(INITIAL_DEMANDS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedQuotationUnit, setSelectedQuotationUnit] = useState<InventoryUnit | null>(null);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[1] || projects[0];

  const setActiveProjectById = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      setActiveProjectId(id);
      toast.info(`Active site switched to: ${project.name}`);
    }
  };

  const updateUnitStatus = (
    unitId: string,
    status: 'Available' | 'Hold' | 'Booked' | 'JV',
    tokenHolder?: string
  ) => {
    setInventory((prev) =>
      prev.map((unit) => {
        if (unit.id === unitId) {
          return {
            ...unit,
            status,
            tokenHolder: tokenHolder || (status === 'Hold' ? 'Token Holder Allotted' : undefined),
            tokenDate: status === 'Hold' ? 'Today, ' + new Date().toLocaleDateString('en-GB') : undefined,
          };
        }
        return unit;
      })
    );
    toast.success(`Unit ${unitId.replace('unit-', '')} status updated to ${status}`);
  };

  const addLead = (leadData: Omit<LeadProspect, 'id' | 'createdAt'>) => {
    const newLead: LeadProspect = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: 'Today, ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setLeads((prev) => [newLead, ...prev]);
    toast.success(`New prospect ingested: ${leadData.name}`);
  };

  const updateLeadStage = (id: string, stage: LeadProspect['stage']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, stage } : l))
    );
    toast.info(`Lead status changed to [${stage}]`);
  };

  const addDemand = (
    demandData: Omit<DemandNotice, 'id' | 'noticeCode' | 'dispatched'>
  ) => {
    const nextCode = `D00${demands.length + 1}`;
    const newDemand: DemandNotice = {
      ...demandData,
      id: `demand-${Date.now()}`,
      noticeCode: nextCode,
      dispatched: false,
    };
    setDemands((prev) => [newDemand, ...prev]);
    toast.success(`Demand Notice ${nextCode} generated successfully`);
  };

  const sendNotice = (id: string) => {
    setDemands((prev) =>
      prev.map((d) => (d.id === id ? { ...d, dispatched: true } : d))
    );
    toast.success('Notice dispatched via registered SMS & Email Gateway');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProjectById,
        inventory,
        updateUnitStatus,
        leads,
        addLead,
        updateLeadStage,
        demands,
        addDemand,
        sendNotice,
        searchQuery,
        setSearchQuery,
        selectedQuotationUnit,
        setSelectedQuotationUnit,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
