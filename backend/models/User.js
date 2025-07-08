const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  authType: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
});

// ✅ Conditional password validation only for local auth
userSchema.pre('validate', function (next) {
  // If password is missing, assume it's OAuth unless specified
  if (!this.password) {
    if (!this.authType) {
      this.authType = 'google'; // Default to google if not set
    }

    if (this.authType === 'local') {
      this.invalidate('password', 'Password is required for local authentication');
    }
  }

  next();
});
module.exports = mongoose.model('User', userSchema);
