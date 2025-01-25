import mongoose, { Document, Schema, Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export interface userDocument extends Document {
  _id: string;
  email: string;
  fullName: string;
  contactNumber: string;
  password: string;
  role: string;
  isDeleted: boolean;
  profileImage?: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  provider: string;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
  // generateAccessToken(): string;
  // generateRefreshToken(): string;
}
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  DEVELOPER = "developer",
}
export enum Provider {
  GOOGLE = "google",
  FACEBOOK = "facebook",
}

const userSchema = new Schema<userDocument>(
  {
    email: {
      unique: true,
      index: true,
      type: String,
    },
    fullName: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    provider: {
      type: String,
      enum: Object.values(Provider),
    },
    providerId: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiry: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//This method is used to convert the password to hash code
userSchema.pre<userDocument>("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  } else {
    try {
      user.password = await bcrypt.hash(user.password, 12);
      next();
    } catch (err: any) {
      next(err as Error);
    }
  }
});

//This function is used to compare the password with the database password
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const user = this as userDocument;
  return await bcrypt.compare(password, user.password);
};

//This function is used to generate the accessToken
// userSchema.methods.generateAccessToken = function (): string {
//   const user = this as userDocument;
//   const secret = process.env.ACCESS_TOKEN;
//   if (!secret) {
//     throw new Error("access token is not defined");
//   }
//   return jwt.sign(
//     {
//       userId: user._id,
//       email: user.email,
//       fullName: user.fullName,
//     },
//     secret,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h", //"expire in 1 hour"
//     }
//   );
// };

// //This method is used to generate the refreshToken
// userSchema.methods.generateRefreshToken = function (): string {
//   const user = this as userDocument;
//   const secret = process.env.REFRESH_TOKEN;
//   if (!secret) {
//     throw new Error("Refresh token is not defined");
//   }
//   return jwt.sign(
//     {
//       userId: user._id,
//       email: user.email,
//       fullName: user.fullName,
//     },
//     secret,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d", //expire in 10 days
//     }
//   );
// };

export const User = mongoose.model<userDocument>("User", userSchema);
