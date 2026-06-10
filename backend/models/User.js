const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
 
/**
 * User Schema
 * Supports two roles: 'farmer' and 'buyer'
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'admin'],
      required: true,
      default: 'farmer',
    },
    companyName: { type: String, trim: true }, // For buyers
    phone: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: [500, 'Bio cannot exceed 500 characters'] },
    location: { type: String, trim: true },
    profileImage: { type: String }, // Base64 or URL
    language: { type: String, enum: ['en', 'hi'], default: 'en' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
 
// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
 
// Instance method: compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
 
// Remove sensitive fields when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
 
module.exports = mongoose.model('User', userSchema);
 