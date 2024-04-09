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

export const getSelectedTags = async(req, res) => {
  try {
    const { tag } = req.params; // Получаем значение параметра tag из URL
const selectedTags = await PostShema.find({tags: tag}).populate('user').exec();
res.json(selectedTags)
  } catch(error) {
    res.status(500).json({ message: error.message });
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
          message: "Статья не найдена.",
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
  