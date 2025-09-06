import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // null for root comments, ObjectId for replies
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }],
    edited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ parentComment: 1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;