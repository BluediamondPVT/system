'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { AshapuraProject, ASHAPURA_PROJECTS } from '@/lib/ashapura-data';
import { getSessionUser } from '@/lib/session';

interface MongoProjectDoc {
  _id: { toString(): string } | string;
  slug: string;
  name: string;
  tag?: 'CHSL' | 'SRA' | 'JV' | 'Free-Sale';
  location: string;
  zone: string;
  floorsAndWings: string;
  totalFloors: number;
  wings: string[];
  basePricePerSqft: number;
  rehabMembers?: number;
  freeSaleUnits: number;
  reraNumber: string;
  status: 'Ongoing' | 'Upcoming' | 'Completed';
  description: string;
  isActive: boolean;
  createdAt?: Date | string;
}

/**
 * Fetch all active projects from MongoDB with graceful fallback to ASHAPURA_PROJECTS.
 */
export async function getAllProjectsAction(): Promise<{
  success: boolean;
  projects: AshapuraProject[];
  error?: string;
}> {
  try {
    await connectToDatabase();
    const docs = await Project.find({ isActive: true })
      .sort({ createdAt: 1 })
      .lean<MongoProjectDoc[]>();

    if (!docs || docs.length === 0) {
      // If collection is not seeded yet, return the default 10 projects
      return { success: true, projects: ASHAPURA_PROJECTS };
    }

    const projects: AshapuraProject[] = docs.map((d) => ({
      id: d.slug || (typeof d._id === 'string' ? d._id : d._id.toString()),
      name: d.name,
      tag: d.tag,
      location: d.location,
      zone: d.zone || 'Western Suburbs',
      floorsAndWings: d.floorsAndWings,
      totalFloors: d.totalFloors,
      wings: d.wings && d.wings.length > 0 ? d.wings : ['Wing A'],
      basePricePerSqft: d.basePricePerSqft,
      rehabMembers: d.rehabMembers || 0,
      freeSaleUnits: d.freeSaleUnits,
      reraNumber: d.reraNumber,
      status: d.status,
      description: d.description || '',
    }));

    return { success: true, projects };
  } catch (error: unknown) {
    console.error('Error in getAllProjectsAction:', error);
    // Graceful fallback so dashboard never breaks
    return { success: true, projects: ASHAPURA_PROJECTS };
  }
}

/**
 * Create a new real estate project. Only SUPER_ADMIN authorized.
 */
export async function createProjectAction(data: {
  name: string;
  tag?: 'CHSL' | 'SRA' | 'JV' | 'Free-Sale';
  location: string;
  zone?: string;
  floorsAndWings: string;
  totalFloors: number;
  wings?: string[];
  basePricePerSqft: number;
  rehabMembers?: number;
  freeSaleUnits: number;
  reraNumber?: string;
  status?: 'Ongoing' | 'Upcoming' | 'Completed';
  description?: string;
}): Promise<{ success: boolean; message?: string; error?: string; project?: AshapuraProject }> {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admin can create new projects.' };
    }

    if (!data.name || !data.location || !data.floorsAndWings || !data.basePricePerSqft) {
      return { success: false, error: 'Please provide all mandatory project fields.' };
    }

    await connectToDatabase();

    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existing = await Project.findOne({ slug });
    if (existing) {
      return { success: false, error: `A project with name or slug "${slug}" already exists.` };
    }

    const newProject = new Project({
      slug,
      name: data.name.trim(),
      tag: data.tag || 'Free-Sale',
      location: data.location.trim(),
      zone: data.zone || 'Western Suburbs',
      floorsAndWings: data.floorsAndWings.trim(),
      totalFloors: Number(data.totalFloors),
      wings: data.wings && data.wings.length > 0 ? data.wings : ['Wing A'],
      basePricePerSqft: Number(data.basePricePerSqft),
      rehabMembers: Number(data.rehabMembers) || 0,
      freeSaleUnits: Number(data.freeSaleUnits),
      reraNumber: data.reraNumber || 'Awaiting MahaRERA',
      status: data.status || 'Ongoing',
      description: data.description || '',
      isActive: true,
    });

    await newProject.save();

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/inventory');

    return {
      success: true,
      message: `Project "${newProject.name}" created successfully in database.`,
      project: {
        id: newProject.slug,
        name: newProject.name,
        tag: newProject.tag,
        location: newProject.location,
        zone: newProject.zone,
        floorsAndWings: newProject.floorsAndWings,
        totalFloors: newProject.totalFloors,
        wings: newProject.wings,
        basePricePerSqft: newProject.basePricePerSqft,
        rehabMembers: newProject.rehabMembers,
        freeSaleUnits: newProject.freeSaleUnits,
        reraNumber: newProject.reraNumber,
        status: newProject.status,
        description: newProject.description,
      },
    };
  } catch (error: unknown) {
    console.error('Error creating project:', error);
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return { success: false, error: message };
  }
}

/**
 * Update an existing project's commercial terms, pricing, or status.
 */
export async function updateProjectAction(
  idOrSlug: string,
  data: Partial<AshapuraProject>
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Only Super Admin can update projects.' };
    }

    await connectToDatabase();
    const project = await Project.findOne({
      $or: [{ slug: idOrSlug }, { _id: idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? idOrSlug : null }],
    });

    if (!project) {
      return { success: false, error: 'Project not found.' };
    }

    if (data.name) project.name = data.name;
    if (data.tag) project.tag = data.tag;
    if (data.location) project.location = data.location;
    if (data.floorsAndWings) project.floorsAndWings = data.floorsAndWings;
    if (data.totalFloors) project.totalFloors = data.totalFloors;
    if (data.wings) project.wings = data.wings;
    if (data.basePricePerSqft) project.basePricePerSqft = data.basePricePerSqft;
    if (data.rehabMembers !== undefined) project.rehabMembers = data.rehabMembers;
    if (data.freeSaleUnits !== undefined) project.freeSaleUnits = data.freeSaleUnits;
    if (data.reraNumber) project.reraNumber = data.reraNumber;
    if (data.status) project.status = data.status;
    if (data.description) project.description = data.description;

    await project.save();

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/inventory');

    return {
      success: true,
      message: `Project "${project.name}" updated successfully.`,
    };
  } catch (error: unknown) {
    console.error('Error updating project:', error);
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return { success: false, error: message };
  }
}
