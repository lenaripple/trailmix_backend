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
  rating: {
    type: Number
  },
  membersCount: {
    type: Number,
    default: 0,
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
  },
  toJSON(){
    return {
      _id: this._id,
      _title: this.title,
      user: this.user,
      date: this.date,
      location: this.location,
      description: this.description,
      rating: this.rating,
      slug: this.slug,
      createdAt: this.createdAt,
    };
  },
};

PostSchema.statics = {
  createPost(args, user){
    return this.create({...args, user});
  },
  list({ skip= 0} = {}){
    return this.find()
      .sort({ createdAt: -1})
      .skip(skip)
      .populate('user');
  },
  incMembersCount(postId){
    return this.findByIdAndUpdate(postId, { $inc:{ membersCount: 1 }});
  },
  decMembersCount(postId){
    return this.findByIdAndUpdate(postId, { $inc:{ membersCount: -1 }});
  }
};

export default mongoose.model('Post', PostSchema)
;
