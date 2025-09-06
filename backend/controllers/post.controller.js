import fs from "fs";
import imagekit from "../utills/imagekit.js";
import Post from "../models/post.model.js";
import main from "../utills/gemini.js";
import Comment from "../models/comment.model.js";
export const createPost = async (req, res) => {
    // Logic for creating a post
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
    }
    try {
        const { title, subTitle, description, category, isPublished } = req.body;
        const image = req.file ? req.file.path : null;

        if (!title || !description || !category || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const uploadResponse = await imagekit.upload({
            file: fs.readFileSync(req.file.path), // Buffer of the file
            fileName: `${req.user.id}-${Date.now()}-${req.file.originalname}`, // Unique filename
            folder: "/profile_pictures", // Optional: specify folder in ImageKit
        });

        // Remove file from local storage after uploading to ImageKit
        fs.unlinkSync(req.file.path);

        const newPost = new Post({
            userId: req.user.id, // Assuming req.user contains the authenticated user's info
            title,
            subTitle,
            description,
            category,
            image: uploadResponse.url,
            isPublished
        });

        await newPost.save();

        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Error creating post", error: error.message });

    }
};

export const getAllPosts = async (req, res) => {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 8;
    const setDirection = req.query.direction === "desc" ? -1 : 1;

    try {
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: "i" } },
                    { description: { $regex: req.query.searchTerm, $options: "i" } }
                ]
            }),
            ...(req.query.isPublished && { isPublished: req.query.isPublished === "true" })
        }).sort({ createdAt: setDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPost = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        const lastMonthPost = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });
        res.status(200).json({ posts, totalPost, lastMonthPost });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
};



export const deletePost = async (req, res) => {
    const { postId } = req.params;

    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        // Delete all comments for this post first
        await Comment.deleteMany({ postId: postId });
        
        // Then delete the post
        const post = await Post.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post", error: error.message });
    }
};



export const updatePost = async (req, res) => {
    const { postId, userId } = req.params;

    // Fix authorization logic
    if (!req.user.isAdmin && req.user.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        let uploadResponse;

        // Handle image upload - only if new file is provided
        if (req.file) {
            uploadResponse = await imagekit.upload({
                file: fs.readFileSync(req.file.path),
                fileName: `${req.user.id}-${Date.now()}-${req.file.originalname}`,
                folder: "/profile_pictures",
            });

            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
        }

        // Prepare update data - only include fields that are provided
        const updateData = {};
        
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.subTitle !== undefined) updateData.subTitle = req.body.subTitle;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.category !== undefined) updateData.category = req.body.category;
        if (req.body.isPublished !== undefined) {
            // Convert string to boolean if needed
            updateData.isPublished = req.body.isPublished === 'true' || req.body.isPublished === true;
        }

        // Only update image if new one was uploaded
        if (uploadResponse) {
            updateData.image = uploadResponse.url;
        }

        const post = await Post.findByIdAndUpdate(
            postId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ 
            message: "Post updated successfully", 
            post 
        });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ 
            message: "Error updating post", 
            error: error.message 
        });
    }
};


export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        
        console.log('Fetching post with ID:', postId);
        
        // Validate postId
        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }

        // Simple find without population to avoid reference issues
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        console.log('Post found:', post.title);

        // Return the post with success flag
        res.status(200).json({
            success: true,
            post: post
        });

    } catch (error) {
        console.error("Error fetching post:", error);
        
        // Handle specific MongoDB errors
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format"
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const generateContent=async(req,res)=>{
    try{
        const { prompt } = req.body;
        const generatedText = await main(prompt+'Generate a blog content for this topic in simple text format');
        res.status(200).json({ success: true,  generatedText });
    }catch(error){
        console.error("Error generating content:", error);
        res.status(500).json({ message: "Error generating content", error: error.message });
    }
}

