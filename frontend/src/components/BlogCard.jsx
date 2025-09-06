

import React from 'react'
import { useNavigate } from 'react-router-dom'
import truncate from 'html-truncate' // npm install html-truncate
import moment from 'moment'
import { asset } from '../assets/asset'

const BlogCard = ({ blog }) => {
    const navigate = useNavigate()
        
    const {
        _id,
        title,
        subTitle,
        description,
        category,
        image,
        createdAt,
        userId,
        author
    } = blog

    // Create shortened description
    const shortHTML = truncate(description, 80)

    // Fallback for missing image
    const blogImage = image || asset.defaultBlogImage || 'https://via.placeholder.com/400x300?text=Blog+Post'

    return (
        <div 
            onClick={() => navigate(`/blog/${_id}`)}
            className='w-full h-full flex flex-col overflow-hidden shadow-md hover:scale-105 hover:shadow-primary/25 duration-200 cursor-pointer bg-white rounded-lg'
        >
            {/* Blog Image - Fixed height */}
            <div className="relative overflow-hidden h-48 flex-shrink-0">
                <img 
                    src={blogImage}
                    alt={title || "Blog post"} 
                    className='w-full h-full object-cover hover:scale-110 transition-transform duration-300'
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                    }}
                />
                                
                {/* Category badge */}
                <span className='absolute top-3 left-3 px-3 py-1 bg-primary text-white rounded-full text-xs font-medium capitalize'>
                    {category}
                </span>
            </div>

            {/* Content */}
            <div className='p-5 flex flex-col flex-grow'>
                {/* Title - Fixed height with line clamp */}
                <h5 className='mb-2 font-medium text-gray-900 text-lg leading-tight hover:text-primary transition-colors line-clamp-2 h-14 flex items-start'>
                    {title}
                </h5>

                {/* Subtitle if available */}
                <div className='mb-2 h-10 flex items-start'>
                    {subTitle && (
                        <p className='text-sm text-gray-700 line-clamp-2'>
                            {subTitle}
                        </p>
                    )}
                </div>

                {/* Description  */}
                <div 
                    className='mb-3 text-xs text-gray-600 line-clamp-3 h-12 flex-grow'
                    dangerouslySetInnerHTML={{ __html: shortHTML }}
                />

                {/* Footer content  */}
                <div className='mt-auto'>
                    {/*  Date */}
                    <div className='flex items-center justify-between text-xs text-gray-500 mb-3'>                       
                        {createdAt && (
                            <span className='text-gray-400'>
                                {moment(createdAt).format('MMM DD, YYYY')}
                            </span>
                        )}
                    </div>

                    {/* Read more indicator */}
                    <div className='text-primary text-sm font-medium hover:underline'>
                        Read More →
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogCard