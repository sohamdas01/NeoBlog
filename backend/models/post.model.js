import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
  },
  subTitle: { 
    type: String,
   
  },
  description:{
    type: String,
   
  },
  category: {
    type: String,
    required: true
  },
  image:{
    type: String,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  }
},{timestamps: true});

const Post = mongoose.model("Post", postSchema);

export default Post;
