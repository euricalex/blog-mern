import mongoose from "mongoose";

const PostShema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        text: {
          type: String,
        },
        // Другие поля комментария, если необходимо
      }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
      },
    imageURL: String,
   
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Post", PostShema);
