import React, { useEffect, useState } from 'react'

import BlogTable from '../../components/admin/BlogTable'
import { useSelector } from 'react-redux'

const BlogList = () => {
  const { user } = useSelector((state) => state.user);
  const [blogs, setBlogs] = useState([])
  const [showMore, setShowMore] = useState(true)
  const fetchBlogs = async () => {
    try {
      const response = await fetch(`/api/posts/post-list`);
      const data = await response.json();
      if (response.ok) {
        setBlogs(data.posts);
        if(data.posts.length < 8) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }

  }

  const handleShowMore =async() => {
   const startIndex=blogs.length;
   try {
    const res=await fetch(`/api/posts/post-list?startIndex=${startIndex}`);
    const data=await res.json();
    if(res.ok){
      setBlogs((prevBlogs)=>[...prevBlogs,...data.posts]);
      if(data.posts.length < 8){
        setShowMore(false);
      }
    }
   } catch (error) {
    console.error("Error fetching more blogs:", error);
    
   }
  };

  useEffect(() => {
    fetchBlogs()
  }, [user._id])

  return (
    <div className='flex-1  pt-5 px-5 sm:pt-12 sm:pl-16 '>
      <h1>All Blogs</h1>
      <div className='relative  mt-4 h-4/5 max-w-4xl overflow-x-auto shadow rounded-lg  bg-white dark:bg-blue-500 dark:border-gray-700'>
        <table className='w-full text-sm text-gray-700'>
          <thead className='text-xs text-gray-600 text-left uppercase'>
            <tr>
              <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
              <th scope='col' className='px-2 py-4 '>Blog Image</th>
              <th scope='col' className='px-2 py-4 '>Blog Title</th>
              <th scope='col' className='px-2 py-4 '>Category</th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'>Date</th>
              <th scope='col' className='px-2 py-4  max-sm:hidden'>Status</th>
              <th scope='col' className='px-2 py-4 '>Actions</th>
            </tr>
          </thead>
          <tbody>
          
         

             {blogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-red-600">You Have Not Published A Single Blog</td>
              </tr>
            ) : (
              blogs.map((blog, index) => (
                <BlogTable key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1} />
              ))
            )} 

          </tbody>
        </table>
        {showMore && (
          <div className='flex justify-center my-3'>
            <button
              onClick={handleShowMore}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
            >
              Show More
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default BlogList