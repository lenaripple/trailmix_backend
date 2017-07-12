import Post from './post.model';

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
}
