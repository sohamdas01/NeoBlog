

import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
    return (
        <div className='w-full max-w-sm mx-auto bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:border-blue-300'>
            {/* Image Container */}
            <div className='relative overflow-hidden'>
                <Link to={`/post/${post._id}`}>
                    <img
                        src={post.image}
                        alt='post cover'
                        className='h-48 w-full object-cover group-hover:brightness-110 transition-all duration-300'
                    />
                </Link>
                
                {/* Category Badge */}
                <div className='absolute top-3 left-3'>
                    <span className='inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm'>
                        {post.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className='p-6'>
                {/* Title */}
                <Link to={`/post/${post._id}`}>
                    <h3 className='text-xl font-bold text-gray-800 line-clamp-2 leading-tight mb-3 group-hover:text-blue-600 transition-colors duration-300'>
                        {post.title}
                    </h3>
                </Link>
                
                {/* Date and Read Time */}
                <div className='flex items-center justify-between text-sm text-gray-500 mb-4'>
                    <span className='flex items-center'>
                        <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd' />
                        </svg>
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className='flex items-center'>
                        <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
                        </svg>
                        5 min read
                    </span>
                </div>

                {/* Read More Button */}
                <Link
                    to={`/post/${post._id}`}
                    className='block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                >
                    Read Full Article
                </Link>
            </div>
        </div>
    );
}