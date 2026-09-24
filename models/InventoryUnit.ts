import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInventoryUnit extends Document {
  projectSlug: string;
  projectId?: mongoose.Types.ObjectId;
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
  bookedDetails?: {
    buyerName?: string;
    agreementValue?: number;
    bookingDate?: Date;
    allotmentLetterUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const InventoryUnitSchema = new Schema<IInventoryUnit>(
  {
    projectSlug: {
      type: String,
      required: [true, 'Project slug is required'],
      index: true,
      trim: true,
      lowercase: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: false,
    },
    wing: {
      type: String,
      required: [true, 'Wing is required'],
      trim: true,
      default: 'Wing A',
    },
    floor: {
      type: Number,
      required: [true, 'Floor number is required'],
      min: 1,
    },
    unitNumber: {
      type: String,
      required: [true, 'Unit number is required'],
      trim: true,
    },
    typology: {
      type: String,
      enum: ['1BHK', '2BHK', '3BHK', 'JODI'],
      default: '2BHK',
      required: true,
    },
    carpetAreaSqft: {
      type: Number,
      required: [true, 'Carpet area in sqft is required'],
      min: 100,
    },
    basePricePerSqft: {
      type: Number,
      required: [true, 'Base price per sqft is required'],
      min: 1000,
    },
    status: {
      type: String,
      enum: ['Available', 'Hold', 'Booked', 'JV'],
      default: 'Available',
      required: true,
      index: true,
    },
    tokenHolder: {
      type: String,
      trim: true,
      default: null,
    },
    tokenDate: {
      type: String,
      trim: true,
      default: null,
    },
    tokenAmount: {
      type: Number,
      default: null,
    },
    tokenPhone: {
      type: String,
      trim: true,
      default: null,
    },
    heldBy: {
      type: String,
      trim: true,
      default: null,
    },
    bookedDetails: {
      buyerName: { type: String, trim: true },
      agreementValue: { type: Number },
      bookingDate: { type: Date },
      allotmentLetterUrl: { type: String, trim: true },
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index so no duplicate flat numbers exist within the same wing of a project
InventoryUnitSchema.index({ projectSlug: 1, wing: 1, unitNumber: 1 }, { unique: true });
InventoryUnitSchema.index({ projectSlug: 1, wing: 1, floor: 1 });

const InventoryUnit: Model<IInventoryUnit> =
  mongoose.models.InventoryUnit ||
  mongoose.model<IInventoryUnit>('InventoryUnit', InventoryUnitSchema);

export default InventoryUnit;
