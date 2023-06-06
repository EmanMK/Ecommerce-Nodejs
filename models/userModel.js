const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      uniqe: true,
      lwoercase: true,
    },
    phone: String,
    profileImage: String,
    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [4, 'too short password'],
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetCode:{
      type:String
    },
    passwordResetExpires:{
      type:Date
    },
    passwordResetVerified:{
      type:Boolean
    },
    active: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  }
});

const setImageUrl = (doc) => {
  if (doc.profileImage) {
    if(!doc.profileImage.startsWith("http")){
      const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
      doc.profileImage = imageUrl;
    }
  }
};
userSchema.post('init', (doc) => {
  setImageUrl(doc);
});
userSchema.post('save', (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model('User', userSchema);
