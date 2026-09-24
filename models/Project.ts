import mongoose, { Document, Model, Schema } from 'mongoose';

export type ProjectTag = 'CHSL' | 'SRA' | 'JV' | 'Free-Sale';
export type ProjectStatus = 'Ongoing' | 'Upcoming' | 'Completed';

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  tag?: ProjectTag;
  location: string;
  zone: string;
  floorsAndWings: string;
  totalFloors: number;
  wings: string[];
  basePricePerSqft: number;
  rehabMembers?: number;
  freeSaleUnits: number;
  reraNumber: string;
  status: ProjectStatus;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IProjectModel = Model<IProject>;

const ProjectSchema = new Schema<IProject, IProjectModel>(
  {
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    tag: {
      type: String,
      enum: ['CHSL', 'SRA', 'JV', 'Free-Sale'],
      default: 'Free-Sale',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    zone: {
      type: String,
      default: 'Western Suburbs',
    },
    floorsAndWings: {
      type: String,
      required: true,
    },
    totalFloors: {
      type: Number,
      required: true,
      min: 1,
    },
    wings: {
      type: [String],
      default: ['Wing A'],
    },
    basePricePerSqft: {
      type: Number,
      required: true,
      min: 0,
    },
    rehabMembers: {
      type: Number,
      default: 0,
    },
    freeSaleUnits: {
      type: Number,
      required: true,
      min: 0,
    },
    reraNumber: {
      type: String,
      default: 'Awaiting MahaRERA',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Ongoing', 'Upcoming', 'Completed'],
      default: 'Ongoing',
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project: IProjectModel =
  (mongoose.models.Project as IProjectModel) ||
  mongoose.model<IProject, IProjectModel>('Project', ProjectSchema);

export default Project;
