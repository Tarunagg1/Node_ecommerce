const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [3, "name can't lesser the 64 characters"],
    maxLength: [64, "name can't exceed 64 characters"]
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    maxLength: [128, "name can't exceed 128 characters"],
    index: true
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

/**
 * Validates unique email
 */

// userSchema.path('email').validate(async (email) => {
//   const emailCount = await mongoose.models.users.countDocuments({ email })
//   return !emailCount
// }, 'Email already exists')

/**
 * Encrypts password if value is changed
*/
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next()
  this.password = await bcrypt.hash(this.password, 10)
  return next()
})

userSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password)
  return result
}

const userModel = mongoose.model('user', userSchema)
module.exports = userModel
