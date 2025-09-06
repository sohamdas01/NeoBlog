

import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";

// Add a new comment
export const addComment = async (req, res) => {
  try {
    const { postId, content, parentComment } = req.body;
    const userId = req.user.id;

    if (!postId || !content) {
      return res.status(400).json({ message: "Post ID and content are required" });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // If it's a reply, check if parent comment exists
    if (parentComment) {
      const parentExists = await Comment.findById(parentComment);
      if (!parentExists) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
    }

    const newComment = new Comment({
      postId,
      userId,
      content: content.trim(),
      parentComment: parentComment || null,
      // Auto-approve if user is admin, otherwise require approval
      isApproved: req.user.isAdmin || false
    });

    await newComment.save();

    // If it's a reply, add to parent's replies array
    if (parentComment) {
      await Comment.findByIdAndUpdate(
        parentComment,
        { $push: { replies: newComment._id } }
      );
    }

    // Populate user info for response
    await newComment.populate('userId', 'username profilePicture');

    const message = req.user.isAdmin 
      ? "Comment posted successfully!"
      : "Comment added successfully. It will be visible after admin approval.";

    res.status(201).json({
      message,
      comment: newComment
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// Update comment 
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only comment owner or admin can edit
    if (comment.userId.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    comment.content = content.trim();
    comment.edited = true;
    comment.editedAt = new Date();
    
    // If edited by admin, keep approved status. If edited by user, may need re-approval
    if (req.user.isAdmin) {
      comment.isApproved = true; // Admin edits remain approved
    } else {
      comment.isApproved = false; // User edits need re-approval
    }

    await comment.save();
    await comment.populate('userId', 'username profilePicture');

    res.status(200).json({
      message: "Comment updated successfully",
      comment
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Only get approved comments for public view, unless user is admin
    const filter = { 
      postId,
      parentComment: null // Only root comments, replies are populated separately
    };
    
    if (!req.user?.isAdmin) {
      filter.isApproved = true;
    }

    const comments = await Comment.find(filter)
      .populate('userId', 'username profilePicture')
      .populate({
        path: 'replies',
        populate: {
          path: 'userId',
          select: 'username profilePicture'
        },
        // Filter replies based on approval status unless user is admin
        ...(req.user?.isAdmin ? {} : { match: { isApproved: true } })
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalComments = await Comment.countDocuments(filter);

    res.status(200).json({
      comments,
      totalComments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit)
    });
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).json({ message: "Error getting comments", error: error.message });
  }
};

// Get all comments for admin
export const getAllComments = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.direction === "desc" ? -1 : 1;
    const filter = req.query.filter || 'all'; // 'approved', 'pending', 'all'

    let queryFilter = {};
    if (filter === 'approved') {
      queryFilter.isApproved = true;
    } else if (filter === 'pending') {
      queryFilter.isApproved = false;
    }

    const comments = await Comment.find(queryFilter)
      .populate('userId', 'username profilePicture email')
      .populate('postId', 'title')
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments(queryFilter);

    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments
    });
  } catch (error) {
    console.error("Error getting all comments:", error);
    res.status(500).json({ message: "Error getting comments", error: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only comment owner or admin can delete
    if (comment.userId.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // Delete all replies first
    await Comment.deleteMany({ parentComment: commentId });

    // Remove from parent's replies array if it's a reply
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(
        comment.parentComment,
        { $pull: { replies: commentId } }
      );
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};

// Approve/Reject comment (Admin only)
export const moderateComment = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const { commentId } = req.params;
    const { isApproved } = req.body;

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { isApproved },
      { new: true }
    ).populate('userId', 'username profilePicture');

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({
      message: `Comment ${isApproved ? 'approved' : 'rejected'} successfully`,
      comment
    });
  } catch (error) {
    console.error("Error moderating comment:", error);
    res.status(500).json({ message: "Error moderating comment", error: error.message });
  }
};

// Like/Unlike comment
export const toggleLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      message: hasLiked ? "Comment unliked" : "Comment liked",
      likes: comment.likes.length,
      hasLiked: !hasLiked
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error toggling like", error: error.message });
  }
};