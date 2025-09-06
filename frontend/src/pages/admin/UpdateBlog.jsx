
import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import { asset, blogCategories } from '../../assets/asset'

const UpdateBlog = () => {
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const { user } = useSelector((state) => state.user)
  const [image, setImage] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('startup')
  const [ispublished, setIspublished] = useState(false)
  const [publishError, setPublishError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { postId } = useParams()
  const navigate = useNavigate()

  // Load existing blog
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(`/api/posts/post-list?postId=${postId}`, {
          credentials: 'include'
        })
        const data = await response.json()

        if (response.ok) {
          const blog = data.posts[0]
          setTitle(blog.title || '')
          setSubTitle(blog.subTitle || '')
          setCategory(blog.category || 'startup')
          setIspublished(blog.isPublished || false)
          setExistingImage(blog.image || null)

          // Wait for Quill to be initialized
          setTimeout(() => {
            if (quillRef.current) {
              quillRef.current.root.innerHTML = blog.description || ''
            }
          }, 100)
        } else {
          setPublishError(data.message || 'Error fetching blog details')
        }
      } catch (error) {
        setPublishError('Error fetching blog details: ' + error.message)
      }
    }

    fetchBlogDetails()
  }, [postId])

  //  Initialize Quill
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  // Handle submit
  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!user) {
      setPublishError('You must be logged in to update a post')
      return
    }
    if (!user.isAdmin) {
      setPublishError('Only admins can update posts')
      return
    }

    try {
      setLoading(true)
      setPublishError(null)

      const formData = new FormData()
      formData.append('title', title)
      formData.append('subTitle', subTitle)
      formData.append('description', quillRef.current.root.innerHTML)
      formData.append('category', category)
      formData.append('isPublished', ispublished.toString()) // Convert to string
      
      // Only append image if user selected a new one
      if (image) {
        formData.append('file', image)
      }

      console.log('Updating post with ID:', postId)
      console.log('User ID:', user._id || user.id)

      const res = await fetch(`/api/posts/update-post/${postId}/${user._id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        console.log('Blog updated successfully:', data)
        navigate('/admin/listBlog') // redirect back to blog list
      } else {
        console.error('Update failed:', data)
        setPublishError(data.message || 'Error updating blog')
      }
    } catch (error) {
      console.error('Submit error:', error)
      setPublishError('Error submitting form: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll">
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        {publishError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
            {publishError}
          </div>
        )}

        <p className="text-primary">Upload new thumbnail </p>
        <label htmlFor="image" className="cursor-pointer">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : existingImage || asset.upload
            }
            alt="Blog thumbnail"
            className="w-40 h-28 object-cover rounded border-2 border-dashed border-gray-300 hover:border-gray-400"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            accept="image/*"
          />
        </label>

        <p className="mt-4 text-primary">Blog Title</p>
        <input
          type="text"
          placeholder="Enter Title"
          required
          value={title}
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
        />

        <p className="mt-4 text-primary">Blog subTitle</p>
        <input
          type="text"
          placeholder="Enter subTitle"
          required
          value={subTitle}
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubTitle(e.target.value)}
        />

        <p className="mt-4 text-primary">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef} className="min-h-[200px]"></div>
        </div>

        <p className="mt-4 text-primary">Blog Category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
          required
        >
          <option value="">Select Category</option>
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="mt-4">
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={ispublished}
            className="scale-125 cursor-pointer"
            onChange={(e) => setIspublished(e.target.checked)}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Blog'}
        </button>
      </div>
    </form>
  )
}

export default UpdateBlog