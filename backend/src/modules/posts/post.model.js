import mongoose, {Schema} from 'mongoose';
import slug from 'slug';
import uniqueValidator from 'mongoose-unique-validator';

const PostSchema = new Schema({
  title:{
    type: String,
    trim: true,
    required: [true, 'Title is required'],
    minlength:[3, 'Title must be at least three characters'],
    unique: true,
  },
  date:{
    type: Date,
    trim: true,
    required: [true, 'Date is required'],
  },
  location:{
    type: String,
    trim: true,
  },
  description:{
    type: String,
    trim: true,
    required: [true, 'Description is required'],
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
  },
  extra:{
    type: String,
    trim: true,
  },
  user: {
    type:Schema.Types.ObjectId,
    ref: 'User',
  },
}, {timestamps: true});

PostSchema.plugin(uniqueValidator, {
  message: `{VALUE} already taken.`
});

PostSchema.pre('validate', function (next){
  this._slugify();
  next();
});

PostSchema.methods = {
  _slugify(){
    this.slug = slug(this.title)
  }
};

PostSchema.statics = {
  createPost(args, user){
    return this.create({...args, user});
  }
};

export default mongoose.model('Post', PostSchema)
;
