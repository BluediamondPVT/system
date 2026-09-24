'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/mongodb';
import InventoryUnit from '@/models/InventoryUnit';
import { InventoryUnit as ClientInventoryUnit, generateInitialInventory } from '@/lib/ashapura-data';
import { getSessionUser } from '@/lib/session';

interface MongoInventoryDoc {
  _id: { toString(): string } | string;
  projectSlug: string;
  wing: string;
  floor: number;
  unitNumber: string;
  typology: '1BHK' | '2BHK' | '3BHK' | 'JODI';
  carpetAreaSqft: number;
  basePricePerSqft: number;
  status: 'Available' | 'Hold' | 'Booked' | 'JV';
  tokenHolder?: string | null;
  tokenDate?: string | null;
  tokenAmount?: number | null;
  tokenPhone?: string | null;
  heldBy?: string | null;
}

/**
 * Fetch inventory matrix for a project & optional wing from MongoDB Atlas.
 * Falls back to generated units if database collection is empty for that project.
 */
export async function getInventoryByProjectAction(
  projectSlug: string,
  wing?: string
): Promise<{ success: boolean; units: ClientInventoryUnit[]; error?: string }> {
  try {
    await connectToDatabase();

    const normalizedSlug = (projectSlug || 'meghmala-crysta').toLowerCase().trim();
    const query: Record<string, unknown> = { projectSlug: normalizedSlug };

    if (wing) {
      query.wing = wing;
    }

    const docs = await InventoryUnit.find(query)
      .sort({ floor: -1, unitNumber: 1 })
      .lean();

    if (!docs || docs.length === 0) {
      // If DB has no units yet for meghmala-crysta, fallback to standard 15 floors matrix
      if (normalizedSlug === 'meghmala-crysta') {
        const fallback = generateInitialInventory().map((u) => ({
          ...u,
          wing: wing || 'Wing A',
        }));
        return { success: true, units: fallback };
      }
      return { success: true, units: [] };
    }

    const units: ClientInventoryUnit[] = (docs as unknown as MongoInventoryDoc[]).map((d) => ({
      id: d._id.toString(),
      projectId: d.projectSlug,
      wing: d.wing,
      floor: d.floor,
      unitNumber: d.unitNumber,
      typology: d.typology === 'JODI' ? '3BHK' : d.typology,
      carpetAreaSqft: d.carpetAreaSqft,
      basePricePerSqft: d.basePricePerSqft,
      status: d.status,
      tokenHolder: d.tokenHolder || undefined,
      tokenDate: d.tokenDate || undefined,
    }));

    return { success: true, units };
  } catch (error: unknown) {
    console.error('Error in getInventoryByProjectAction:', error);
    // Graceful fallback so UI doesn't crash on connection drop
    const fallback = generateInitialInventory().map((u) => ({
      ...u,
      wing: wing || 'Wing A',
    }));
    return { success: true, units: fallback };
  }
}

/**
 * Lock / Hold a unit with Token advance details in MongoDB Atlas.
 */
export async function holdUnitAction(data: {
  unitIdOrNumber: string;
  projectSlug: string;
  wing: string;
  tokenHolder: string;
  tokenAmount?: number;
  tokenPhone?: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const session = await getSessionUser();
    if (!session) {
      return { success: false, error: 'Unauthorized: Please log in to hold units.' };
    }
    if (session.role === 'ACCOUNT') {
      return { success: false, error: 'Unauthorized: Accounts desk has read-only access to inventory.' };
    }

    await connectToDatabase();

    const normalizedSlug = data.projectSlug.toLowerCase().trim();
    const tokenDateStr = 'Today, ' + new Date().toLocaleDateString('en-GB');

    // Query either by MongoDB _id or by [projectSlug, wing, unitNumber]
    const filter =
      data.unitIdOrNumber.length === 24 && /^[0-9a-fA-F]{24}$/.test(data.unitIdOrNumber)
        ? { _id: data.unitIdOrNumber }
        : {
            projectSlug: normalizedSlug,
            wing: data.wing,
            unitNumber: data.unitIdOrNumber.replace('unit-', ''),
          };

    const updated = await InventoryUnit.findOneAndUpdate(
      filter,
      {
        $set: {
          status: 'Hold',
          tokenHolder: data.tokenHolder.trim() || 'Direct Token Advance',
          tokenDate: tokenDateStr,
          tokenAmount: data.tokenAmount || 100000,
          tokenPhone: data.tokenPhone || null,
          heldBy: session.email,
        },
      },
      { new: true }
    );

    if (!updated) {
      // If unit was not in MongoDB yet, try upserting with default architecture
      const unitNum = data.unitIdOrNumber.replace('unit-', '');
      const floorNum = parseInt(unitNum.slice(0, -2)) || 1;

      await InventoryUnit.create({
        projectSlug: normalizedSlug,
        wing: data.wing,
        floor: floorNum,
        unitNumber: unitNum,
        typology: '2BHK',
        carpetAreaSqft: 740,
        basePricePerSqft: 23500,
        status: 'Hold',
        tokenHolder: data.tokenHolder.trim() || 'Direct Token Advance',
        tokenDate: tokenDateStr,
        tokenAmount: data.tokenAmount || 100000,
        tokenPhone: data.tokenPhone || null,
        heldBy: session.email,
      });
    }

    revalidatePath('/dashboard/inventory');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: `Flat #${data.unitIdOrNumber.replace('unit-', '')} locked with token advance for ${data.tokenHolder}.`,
    };
  } catch (error: unknown) {
    console.error('Error in holdUnitAction:', error);
    const message = error instanceof Error ? error.message : 'Failed to hold unit';
    return { success: false, error: message };
  }
}

/**
 * Release a previously held flat back to Available inventory in MongoDB Atlas.
 */
export async function releaseUnitAction(data: {
  unitIdOrNumber: string;
  projectSlug: string;
  wing: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const session = await getSessionUser();
    if (!session) {
      return { success: false, error: 'Unauthorized: Please log in to release unit holds.' };
    }
    if (session.role === 'ACCOUNT') {
      return { success: false, error: 'Unauthorized: Accounts desk has read-only access to inventory.' };
    }

    await connectToDatabase();

    const normalizedSlug = data.projectSlug.toLowerCase().trim();

    const filter =
      data.unitIdOrNumber.length === 24 && /^[0-9a-fA-F]{24}$/.test(data.unitIdOrNumber)
        ? { _id: data.unitIdOrNumber }
        : {
            projectSlug: normalizedSlug,
            wing: data.wing,
            unitNumber: data.unitIdOrNumber.replace('unit-', ''),
          };

    const updated = await InventoryUnit.findOneAndUpdate(
      filter,
      {
        $set: {
          status: 'Available',
          tokenHolder: null,
          tokenDate: null,
          tokenAmount: null,
          tokenPhone: null,
          heldBy: null,
          bookedDetails: null,
        },
      },
      { new: true }
    );

    if (!updated) {
      return { success: false, error: 'Unit record not found in database.' };
    }

    revalidatePath('/dashboard/inventory');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: `Flat #${data.unitIdOrNumber.replace('unit-', '')} hold released. Flat is now Available.`,
    };
  } catch (error: unknown) {
    console.error('Error in releaseUnitAction:', error);
    const message = error instanceof Error ? error.message : 'Failed to release unit';
    return { success: false, error: message };
  }
}

/**
 * Mark a flat as Booked / Sold with buyer agreement details in MongoDB Atlas.
 */
export async function bookUnitAction(data: {
  unitIdOrNumber: string;
  projectSlug: string;
  wing: string;
  buyerName: string;
  agreementValue: number;
  allotmentLetterUrl?: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const session = await getSessionUser();
    if (!session) {
      return { success: false, error: 'Unauthorized: Please log in to book units.' };
    }
    if (session.role === 'ACCOUNT') {
      return { success: false, error: 'Unauthorized: Accounts desk has read-only access to inventory.' };
    }

    await connectToDatabase();

    const normalizedSlug = data.projectSlug.toLowerCase().trim();

    const filter =
      data.unitIdOrNumber.length === 24 && /^[0-9a-fA-F]{24}$/.test(data.unitIdOrNumber)
        ? { _id: data.unitIdOrNumber }
        : {
            projectSlug: normalizedSlug,
            wing: data.wing,
            unitNumber: data.unitIdOrNumber.replace('unit-', ''),
          };

    const updated = await InventoryUnit.findOneAndUpdate(
      filter,
      {
        $set: {
          status: 'Booked',
          tokenHolder: data.buyerName.trim(),
          bookedDetails: {
            buyerName: data.buyerName.trim(),
            agreementValue: data.agreementValue,
            bookingDate: new Date(),
            allotmentLetterUrl: data.allotmentLetterUrl || undefined,
          },
        },
      },
      { new: true }
    );

    if (!updated) {
      return { success: false, error: 'Unit record not found in database.' };
    }

    revalidatePath('/dashboard/inventory');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: `Flat #${data.unitIdOrNumber.replace('unit-', '')} successfully booked for ${data.buyerName}.`,
    };
  } catch (error: unknown) {
    console.error('Error in bookUnitAction:', error);
    const message = error instanceof Error ? error.message : 'Failed to book unit';
    return { success: false, error: message };
  }
}

/**
 * Create a new inventory flat / unit in MongoDB Atlas.
 * Authorized for SUPER_ADMIN and ADMIN.
 */
export async function createInventoryUnitAction(data: {
  projectSlug: string;
  wing: string;
  floor: number;
  unitNumber: string;
  typology: '1BHK' | '2BHK' | '3BHK' | 'JODI';
  carpetAreaSqft: number;
  basePricePerSqft: number;
  status?: 'Available' | 'Hold' | 'Booked' | 'JV';
}): Promise<{ success: boolean; message?: string; error?: string; unit?: ClientInventoryUnit }> {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return { success: false, error: 'Unauthorized: Only Super Admin and Admin can add new flats.' };
    }

    if (
      !data.projectSlug ||
      !data.wing ||
      !data.floor ||
      !data.unitNumber ||
      !data.carpetAreaSqft ||
      !data.basePricePerSqft
    ) {
      return {
        success: false,
        error: 'All flat specifications (Floor, Unit Number, Carpet, Price) are required.',
      };
    }

    await connectToDatabase();

    const normalizedSlug = data.projectSlug.toLowerCase().trim();
    const cleanUnitNumber = data.unitNumber.trim();

    // Check duplicate
    const existing = await InventoryUnit.findOne({
      projectSlug: normalizedSlug,
      wing: data.wing.trim(),
      unitNumber: cleanUnitNumber,
    });

    if (existing) {
      return {
        success: false,
        error: `Flat #${cleanUnitNumber} already exists in ${data.wing} of this project.`,
      };
    }

    const newUnit = await InventoryUnit.create({
      projectSlug: normalizedSlug,
      wing: data.wing.trim(),
      floor: Number(data.floor),
      unitNumber: cleanUnitNumber,
      typology: data.typology || '2BHK',
      carpetAreaSqft: Number(data.carpetAreaSqft),
      basePricePerSqft: Number(data.basePricePerSqft),
      status: data.status || 'Available',
    });

    revalidatePath('/dashboard/inventory');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: `Flat #${cleanUnitNumber} (${newUnit.typology}, ${newUnit.carpetAreaSqft} sqft) created successfully in MongoDB!`,
      unit: {
        id: newUnit._id.toString(),
        projectId: newUnit.projectSlug,
        wing: newUnit.wing,
        floor: newUnit.floor,
        unitNumber: newUnit.unitNumber,
        typology: newUnit.typology === 'JODI' ? '3BHK' : newUnit.typology,
        carpetAreaSqft: newUnit.carpetAreaSqft,
        basePricePerSqft: newUnit.basePricePerSqft,
        status: newUnit.status,
      },
    };
  } catch (error: unknown) {
    console.error('Error in createInventoryUnitAction:', error);
    const message = error instanceof Error ? error.message : 'Failed to create inventory unit';
    return { success: false, error: message };
  }
}

