import Post from './post.model';
import User from '../users/user.model';

export async function createPost(req, res){
  try {
    const post = await Post.createPost(req.body, req.user._id);
    return res.status(201).json(post);
  } catch (error){
    return res.status(400).json(error);
  }
};
export async function getPostById(req, res){
  try {
    const post = await Post.findById(req.params.id).populate('user');
    return res.status(201).json(post);
  } catch (error){
    return res.status(500).json(error);
  }
};

export async function getPostsList(req, res){
  try {
    const posts = await Post.list();
    return res.status(201).json(posts);
  } catch (error){
    return res.status(500).json(error);
  }
};

export async function updatePost(req, res){
  try {
    const post = await Post.findById(req.params.id);
    if (!post.user.equals(req.user._id)){
      return res.sendStatus(403);
    }
    Object.keys(req.body).forEach(key => {
      post[key] = req.body[key];
    })
    return res.status(200).json(await post.save());
  } catch (error){
    return res.status(500).json(error);
  }
};

export async function deletePost(req, res){
  try {
    const post = await Post.findById(req.params.id);
    if (!post.user.equals(req.user._id)){
      return res.sendStatus(403);
    }
    await post.remove();
    return res.sendStatus(200);
  } catch(error){
    return res.status(500).json(error);
  }
};

export async function saveTrip(req,res){
  try {
    const user = await User.findById(req.user._id);
    await user._savedTrips.posts(req.params.id);
    return res.sendStatus(200);
  } catch (error){
    return res.status(500).json(error);
  }
};
