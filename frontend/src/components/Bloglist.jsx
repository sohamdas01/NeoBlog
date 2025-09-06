

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "motion/react"
import BlogCard from './BlogCard'
import Loader from './Loader'
import { blogCategories } from '../assets/asset' // Import  categories

const Bloglist = () => {
    const [menu, setMenu] = useState("All")
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState('')
    const [categories, setCategories] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [currentStartIndex, setCurrentStartIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const POSTS_PER_PAGE = 8

    
    useEffect(() => {
        const uniqueCategories = ["All", ...blogCategories.filter(cat => cat !== "All")]
        setCategories(uniqueCategories)
    }, [])

    // Fetch posts from  backend API
    const fetchPosts = async (startIndex = 0, isLoadMore = false, selectedCategory = null) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true)
            } else {
                setLoading(true)
                setIsTransitioning(true)
            }
            setError('')
            
            // Build query parameters
            const params = new URLSearchParams({
                startIndex: startIndex.toString(),
                limit: POSTS_PER_PAGE.toString(),
                isPublished: 'true' // Only show published posts
            })
            
            // Add category filter if not "All"
            const categoryToFilter = selectedCategory || menu
            if (categoryToFilter !== "All") {
                params.append('category', categoryToFilter)
            }

            const response = await fetch(`/api/posts/public/post-list?${params}`)

            if (response.ok) {
                const data = await response.json()
                console.log('Fetched posts:', data)
                
                if (data.posts && Array.isArray(data.posts)) {
                    if (isLoadMore) {
                        setPosts(prev => [...prev, ...data.posts])
                    } else {
                        
                        setTimeout(() => {
                            setPosts(data.posts)
                            setIsTransitioning(false)
                        }, 150)
                    }
                    
                    // Check if there are more posts to load
                    setHasMore(data.posts.length === POSTS_PER_PAGE)
                    setCurrentStartIndex(startIndex + data.posts.length)
                } else {
                    if (!isLoadMore) {
                        setTimeout(() => {
                            setPosts([])
                            setIsTransitioning(false)
                        }, 150)
                    }
                    setHasMore(false)
                }
            } else {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP Error: ${response.status}`)
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
            setError('Failed to load blog posts: ' + error.message)
            if (!isLoadMore) {
                setTimeout(() => {
                    setPosts([])
                    setIsTransitioning(false)
                }, 150)
            }
            setHasMore(false)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    // Handle category change with smooth transition
    const handleCategoryChange = (newCategory) => {
        if (newCategory === menu) return // Prevent unnecessary calls
        
        setMenu(newCategory)
        setCurrentStartIndex(0)
        setHasMore(true)
        fetchPosts(0, false, newCategory)
    }

    // Handle load more
    const handleLoadMore = () => {
        fetchPosts(currentStartIndex, true)
    }

    // Fetch posts when component mounts
    useEffect(() => {
        fetchPosts()
    }, [])

    // Filter posts based on selected category
    const filteredPosts = posts.filter(post => 
        menu === "All" ? true : post.category === menu
    )

    if (loading && !isTransitioning) {
        return <Loader />
    }

    if (error && posts.length === 0 && !loading) {
        return (
            <div className="text-center py-16">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Posts</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchPosts()}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Blog categories with smooth animation */}
            <div className='flex justify-center gap-2 sm:gap-4 my-10 relative flex-wrap px-4'>
                {categories.map((item) => (
                    <div key={item} className='relative'>
                        <motion.button 
                            onClick={() => handleCategoryChange(item)} 
                            className={`cursor-pointer capitalize px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                menu === item 
                                    ? 'text-white bg-primary shadow-lg scale-105' 
                                    : 'text-gray-600 hover:text-primary hover:bg-primary/10 hover:scale-102'
                            }`}
                            whileHover={{ scale: menu === item ? 1.05 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            layout
                        >
                            {item}
                        </motion.button>
                    </div>
                ))}
            </div>

            {/* Posts count indicator with animation */}
            <motion.div 
                className="text-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <p className="text-gray-600">
                    {menu === "All" 
                        ? `Showing ${filteredPosts.length} posts` 
                        : `Showing ${filteredPosts.length} posts in ${menu}`
                    }
                </p>
            </motion.div>

            {/* Blog posts grid with stagger animation */}
            <AnimatePresence mode="wait">
                {isTransitioning ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-16"
                    >
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading {menu} posts...</p>
                    </motion.div>
                ) : filteredPosts.length > 0 ? (
                    <motion.div
                        key={menu}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <motion.div 
                            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-8 mx-8 sm:mx-16 xl:mx-40'
                            layout
                        >
                            {filteredPosts.map((blog, index) => (
                                <motion.div
                                    key={blog._id}
                                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ 
                                        duration: 0.5, 
                                        delay: index * 0.1,
                                        ease: "easeOut"
                                    }}
                                    layout
                                >
                                    <BlogCard blog={blog} />
                                </motion.div>
                            ))}
                        </motion.div>
                        
                        {/* See More Button with animation */}
                        {hasMore && (
                            <motion.div 
                                className="text-center mb-24"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: filteredPosts.length * 0.1 + 0.2 }}
                            >
                                <motion.button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {loadingMore ? (
                                        <motion.div 
                                            className="flex items-center gap-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Loading More...
                                        </motion.div>
                                    ) : (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            See More Posts
                                        </motion.span>
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="text-center py-16 mb-24"
                    >
                        <motion.div 
                            className="text-4xl mb-4"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                            📂
                        </motion.div>
                        <motion.h3 
                            className="text-xl font-semibold text-gray-700 mb-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {menu === "All" ? "No Blog Posts Yet" : `No Posts in ${menu}`}
                        </motion.h3>
                        <motion.p 
                            className="text-gray-500"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {menu === "All" 
                                ? "Create your first blog post to see it here!" 
                                : "Try selecting a different category or create posts in this category."
                            }
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error display for load more */}
            {error && posts.length > 0 && (
                <motion.div 
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-red-600 mb-2">Error loading more posts: {error}</p>
                    <button
                        onClick={handleLoadMore}
                        className="text-primary underline hover:no-underline transition-colors"
                    >
                        Try Again
                    </button>
                </motion.div>
            )}
        </div>
    )
}

export default Bloglist
