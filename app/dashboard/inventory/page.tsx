'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useProject } from '@/lib/project-context';
import { InventoryUnit } from '@/lib/ashapura-data';
import {
  getInventoryByProjectAction,
  holdUnitAction,
  releaseUnitAction,
  bookUnitAction,
} from '@/app/actions/inventory';
import { InventoryHeader } from '@/components/inventory/inventory-header';
import { InventoryStatCards } from '@/components/inventory/inventory-stat-cards';
import { InventoryFilterBar } from '@/components/inventory/inventory-filter-bar';
import { InventoryGrid } from '@/components/inventory/inventory-grid';
import { UnitActionModal } from '@/components/inventory/unit-action-modal';
import { AddUnitModal } from '@/components/add-unit-modal';

export default function InventoryMatrixPage() {
  const {
    activeProject,
    updateUnitStatus,
    userRole,
  } = useProject();

  // Dynamic wings from active project
  const availableWings = useMemo(() => {
    return activeProject.wings && activeProject.wings.length > 0
      ? activeProject.wings
      : ['Wing A', 'Wing B'];
  }, [activeProject.wings]);

  const [selectedWing, setSelectedWing] = useState<string>('');
  const activeWing =
    selectedWing && availableWings.includes(selectedWing)
      ? selectedWing
      : availableWings[0] || 'Wing A';

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'FREE_SALE' | 'JV'>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<InventoryUnit | null>(null);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);

  // Live database units state
  const [dbUnits, setDbUnits] = useState<InventoryUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch live units strictly from MongoDB Atlas
  useEffect(() => {
    let isCancelled = false;

    async function loadUnits() {
      setLoading(true);
      try {
        const res = await getInventoryByProjectAction(activeProject.id, activeWing);
        if (!isCancelled) {
          if (res.success && res.units) {
            setDbUnits(res.units);
          } else {
            setDbUnits([]);
          }
        }
      } catch (err) {
        console.error('Failed to load inventory from DB:', err);
        if (!isCancelled) {
          setDbUnits([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadUnits();

    return () => {
      isCancelled = true;
    };
  }, [activeProject.id, activeWing]);

  // Effective units array strictly from database
  const displayUnits = dbUnits;

  // Live counts
  const availableCount = displayUnits.filter((u) => u.status === 'Available').length;
  const holdCount = displayUnits.filter((u) => u.status === 'Hold').length;
  const bookedCount = displayUnits.filter((u) => u.status === 'Booked').length;
  const jvCount = displayUnits.filter((u) => u.status === 'JV').length;
  const totalCount = displayUnits.length;
  const freeSaleCount = availableCount + holdCount + bookedCount;

  // Floors: highest floor down to 1
  const floors = Array.from(new Set(displayUnits.map((u) => u.floor))).sort(
    (a, b) => b - a
  );

  // Maximum unit count per floor (e.g. 4 or 5 units per floor)
  const maxUnitsPerFloor =
    displayUnits.length > 0
      ? Math.max(4, ...displayUnits.map((u) => parseInt(u.unitNumber.slice(-2)) || 1))
      : 4;
  const unitColumnIndices = Array.from({ length: maxUnitsPerFloor }, (_, i) => i + 1);

  // Helper to fetch unit by floor and unit index
  const getUnit = (floor: number, unitIdx: number) => {
    const unitNum = `${floor}${unitIdx < 10 ? '0' + unitIdx : unitIdx}`;
    return displayUnits.find((u) => u.floor === floor && u.unitNumber === unitNum);
  };

  // 1. Hold Unit Action (Token Advance)
  const handleHoldToken = async (name: string, amount: number, phone?: string) => {
    if (!selectedUnit) return;
    const holderName = name.trim() || 'Direct Token Advance';
    setActionLoading(true);

    try {
      const res = await holdUnitAction({
        unitIdOrNumber: selectedUnit.unitNumber,
        projectSlug: activeProject.id,
        wing: activeWing,
        tokenHolder: holderName,
        tokenAmount: amount,
        tokenPhone: phone?.trim() || undefined,
      });

      if (!res.success) {
        toast.error(res.error || 'Failed to hold unit');
        return;
      }

      const dateStr = 'Today, ' + new Date().toLocaleDateString('en-GB');
      toast.success(res.message || `Flat #${selectedUnit.unitNumber} locked on Hold.`);

      setDbUnits((prev) =>
        prev.map((u) =>
          u.unitNumber === selectedUnit.unitNumber
            ? { ...u, status: 'Hold', tokenHolder: holderName, tokenDate: dateStr }
            : u
        )
      );
      updateUnitStatus(selectedUnit.id, 'Hold', holderName);
      setSelectedUnit(null);
    } catch (err: unknown) {
      console.error('Error holding unit:', err);
      toast.error('Network error updating unit in database.');
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Release Hold Action
  const handleReleaseHold = async () => {
    if (!selectedUnit) return;
    setActionLoading(true);

    try {
      const res = await releaseUnitAction({
        unitIdOrNumber: selectedUnit.unitNumber,
        projectSlug: activeProject.id,
        wing: activeWing,
      });

      if (!res.success) {
        toast.error(res.error || 'Failed to release unit hold');
        return;
      }

      toast.success(res.message || `Flat #${selectedUnit.unitNumber} is now Available.`);

      setDbUnits((prev) =>
        prev.map((u) =>
          u.unitNumber === selectedUnit.unitNumber
            ? { ...u, status: 'Available', tokenHolder: undefined, tokenDate: undefined }
            : u
        )
      );
      updateUnitStatus(selectedUnit.id, 'Available');
      setSelectedUnit(null);
    } catch (err: unknown) {
      console.error('Error releasing unit hold:', err);
      toast.error('Network error releasing hold.');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Confirm Booking / Mark as Sold Action
  const handleConfirmBooking = async (buyerName: string) => {
    if (!selectedUnit) return;
    const buyer = (buyerName.trim() || selectedUnit.tokenHolder || 'Registered Buyer Allottee').trim();
    setActionLoading(true);

    try {
      const agVal = selectedUnit.carpetAreaSqft * selectedUnit.basePricePerSqft;
      const res = await bookUnitAction({
        unitIdOrNumber: selectedUnit.unitNumber,
        projectSlug: activeProject.id,
        wing: activeWing,
        buyerName: buyer,
        agreementValue: agVal,
      });

      if (!res.success) {
        toast.error(res.error || 'Failed to book unit');
        return;
      }

      toast.success(res.message || `Flat #${selectedUnit.unitNumber} officially Booked & Sold!`);

      setDbUnits((prev) =>
        prev.map((u) =>
          u.unitNumber === selectedUnit.unitNumber
            ? { ...u, status: 'Booked', tokenHolder: buyer }
            : u
        )
      );
      updateUnitStatus(selectedUnit.id, 'Booked', buyer);
      setSelectedUnit(null);
    } catch (err: unknown) {
      console.error('Error booking unit:', err);
      toast.error('Network error booking unit.');
    } finally {
      setActionLoading(false);
    }
  };

  // 4. Cancel Booking Action (Admin/SuperAdmin)
  const handleCancelBooking = async () => {
    if (!selectedUnit) return;
    setActionLoading(true);

    try {
      const res = await releaseUnitAction({
        unitIdOrNumber: selectedUnit.unitNumber,
        projectSlug: activeProject.id,
        wing: activeWing,
      });

      if (!res.success) {
        toast.error(res.error || 'Failed to cancel booking');
        return;
      }

      toast.success(`Booking cancelled. Flat #${selectedUnit.unitNumber} is now Available.`);

      setDbUnits((prev) =>
        prev.map((u) =>
          u.unitNumber === selectedUnit.unitNumber
            ? { ...u, status: 'Available', tokenHolder: undefined, tokenDate: undefined }
            : u
        )
      );
      updateUnitStatus(selectedUnit.id, 'Available');
      setSelectedUnit(null);
    } catch (err: unknown) {
      console.error('Error cancelling booking:', err);
      toast.error('Network error cancelling booking.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Dynamic Wings & Add Flat */}
      <InventoryHeader
        projectName={activeProject.name}
        projectTag={activeProject.tag}
        location={activeProject.location}
        totalFloors={activeProject.totalFloors}
        freeSaleUnits={activeProject.freeSaleUnits}
        availableWings={availableWings}
        activeWing={activeWing}
        onSelectWing={setSelectedWing}
        userRole={userRole}
        onOpenAddUnit={() => setIsAddUnitOpen(true)}
      />

      {/* 2. Four Aggregate Stat Cards (Role-Tailored) */}
      <InventoryStatCards
        availableCount={availableCount}
        holdCount={holdCount}
        bookedCount={bookedCount}
        jvCount={jvCount}
        userRole={userRole}
      />

      {/* 3. Filter Bar & MongoDB Sync Loader */}
      <InventoryFilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalCount={totalCount}
        freeSaleCount={freeSaleCount}
        jvCount={jvCount}
        loading={loading}
      />

      {/* 4. Floor-by-Floor Architectural Grid */}
      <InventoryGrid
        floors={floors}
        unitColumnIndices={unitColumnIndices}
        getUnit={getUnit}
        statusFilter={statusFilter}
        onSelectUnit={setSelectedUnit}
        activeWing={activeWing}
        projectName={activeProject.name}
        userRole={userRole}
        onOpenAddUnit={() => setIsAddUnitOpen(true)}
      />

      {/* 5. Flat Action / Sales Booking Modal */}
      <UnitActionModal
        unit={selectedUnit}
        isOpen={Boolean(selectedUnit)}
        onClose={() => setSelectedUnit(null)}
        projectName={activeProject.name}
        userRole={userRole}
        actionLoading={actionLoading}
        onHoldToken={handleHoldToken}
        onReleaseHold={handleReleaseHold}
        onConfirmBooking={handleConfirmBooking}
        onCancelBooking={handleCancelBooking}
      />

      {/* 6. Add Flat Modal (SUPER_ADMIN & ADMIN only) */}
      <AddUnitModal
        isOpen={isAddUnitOpen}
        onClose={() => setIsAddUnitOpen(false)}
        projectSlug={activeProject.id}
        projectName={activeProject.name}
        currentWing={activeWing}
        availableWings={availableWings}
        baseRate={activeProject.basePricePerSqft}
        userRole={userRole}
        onUnitCreated={(newUnit) => {
          setDbUnits((prev) => [newUnit, ...prev]);
        }}
      />
    </div>
  );
}
