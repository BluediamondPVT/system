import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'SALES' | 'ACCOUNT';
export const USER_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'SALES', 'ACCOUNT'];

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
  findByCredentials(emailOrUsername: string): Promise<IUser | null>;
}

const UserSchema = new Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    username: {
      type: String,
      trim: true,
      default: function (this: IUser) {
        return this.email ? this.email.split('@')[0] : undefined;
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: USER_ROLES,
        message: '{VALUE} is not a valid role. Allowed roles: ' + USER_ROLES.join(', '),
      },
      default: 'SALES',
      required: true,
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

// Pre-save hook to hash password with bcryptjs before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare candidate password against hashed password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    throw new Error(
      'Password hash was not selected in the query. Use .select("+password") or findByCredentials().'
    );
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Static helper to find a user by email or username with password selected
UserSchema.statics.findByCredentials = function (
  emailOrUsername: string
): Promise<IUser | null> {
  const normalized = emailOrUsername.trim();
  return this.findOne({
    $or: [
      { email: normalized.toLowerCase() },
      { username: normalized },
    ],
  }).select('+password');
};

// Exclude password and __v in JSON outputs
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete (ret as { __v?: number }).__v;
    return ret;
  },
});

const User: IUserModel =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
