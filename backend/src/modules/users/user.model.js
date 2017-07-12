import mongoose, {Schema} from 'mongoose';
import validator from 'validator';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import { passwordReg } from './user.validation';
import constants from '../../config/constants';
import uniqueValidator from 'mongoose-unique-validator';


const UserSchema = new Schema(
  {
  email: {
    type:String,
    unique: true,
    required: [true, 'Please enter a valid email!'],
    trim: true,
    validate: {
      validator(email){
        return validator.isEmail(email);
      },
      message: '{VALUE} is not a valid email',
    }
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    minlength: [6, 'Password must be at least six characters'],
    validate: {
      validator(password){
        return passwordReg.test(password);
      },
      message: '{VALUE} is not a valid password'
    }
  }
});

UserSchema.pre('save', function(next){
  if (this.isModified('password')){
    this.password = this._hashPassword(this.password);
  }
  return next();
});

UserSchema.plugin(uniqueValidator, {
  message: `{VALUE} already taken.`
});

UserSchema.methods = {
  _hashPassword(password) {
    return hashSync(password);
  },
  authenticateUser(password){
    return compareSync(password, this.password);
  },
  createToken(){
    return jwt.sign(
      {
      _id: this._id,
      },
      constants.JWT_SECRET,
    );
  },
  toAuthJSON(){
    return {
      _id:this._id,
      username: this.username,
      token: `JWT ${this.createToken()}`,
    };
  },
  toJSON(){
    return {
      _id:this._id,
      username: this.username,
    };
  },
};

export default mongoose.model('User', UserSchema);
