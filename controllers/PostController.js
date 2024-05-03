import Post from "../modules/Post.js";
import PostShema from "../modules/Post.js";


export const getAll = async (req, res) => {
  try {
    const posts = await PostShema.find().sort({createdAt: -1}).populate("user").exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An articles is not gotten" });
  }
};

export const getPopular = async(req, res) => {
  try {
const popularPosts = await PostShema.find().sort({viewCount: -1});
res.json(popularPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getLastTags = async(req, res) => {
  try {
    const posts = await PostShema.find().limit(5).exec();
    const tags = posts.map(post => post.tags).flat().slice(0, 5);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An articles is not gotten" });
  }
}



export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedDoc = await PostShema.findByIdAndUpdate(
      { _id: postId },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('user'); 
    
    if (!updatedDoc) {
      return res.status(404).json({ message: "Article is not found" });
    }
    res.json(updatedDoc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An article is not gotten" });
  }
};






export const create = async (req, res) => {
  try {
    const doc = new PostShema({
      title: req.body.title,
      text: req.body.text,
      imageURL: req.body.imageURL,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An article is not created" });
  }
};

export const createComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      user: req.userId,
      text: text,
    };

    post.comments.push(comment);
    await post.save();

    res.json({ success: true, comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post.comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};


export const update = async (req, res) => {
    try {
      const postId = req.params.id;
  
       await PostShema.updateOne({
        _id: postId,
      }, {
        title: req.body.title,
        text: req.body.text,
        imageURL: req.body.imageURL,
        tags: req.body.tags.split(','),
        user: req.userId,
      });
   
  
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Article is not patched" });
    }
  };
  


  export const remove = async (req, res) => {
    try {
      const postId = req.params.id;
  
      const deleteDoc = await PostShema.findByIdAndDelete(postId);
      if (!deleteDoc) {
        return res.status(404).json({
          message: "Article not found.",
        });
      }
  
      res.json({
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Не удалось удалить статью.",
      });
    }
  };

  export const removeComment = async (req, res) => {
    try {
      const postId = req.params.postId; // Получаем идентификатор статьи из параметров маршрута
      const commentId = req.params.commentId; // Получаем идентификатор комментария из параметров маршрута
  
      const post = await PostShema.findById(postId); // Находим статью по идентификатору
  
      if (!post) {
        // Если статья не найдена, возвращаем сообщение об ошибке
        return res.status(404).json({ message: "Post not found" });
      }
  
      
     post.comments = post.comments.filter((comment) => comment._id.toString() !== commentId);

  
      await post.save(); 
  
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing comment:", error);
      res.status(500).json({ message: "Failed to remove comment" });
    }
  };
  