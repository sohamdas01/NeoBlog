
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [lastMonthUsers, setLastMonthUsers] = useState(0)
  const [lastMonthPosts, setLastMonthPosts] = useState(0)
  const [lastMonthComments, setLastMonthComments] = useState(0)

  const { user } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data logic
        const response = await fetch(`/api/users/get-users?limit=7`, {
          credentials: 'include',
        })
        const data = await response.json()
        if (response.ok) {
          setUsers(data.users)
          setTotalUsers(data.totalUsers)
          setLastMonthUsers(data.lastMonth)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts/post-list?limit=7`, {
          credentials: 'include',
        })
        const data = await response.json()
        if (response.ok) {
          setPosts(data.posts)
          setTotalPosts(data.totalPost)
          setLastMonthPosts(data.lastMonthPost)
        }
      } catch (error) {
        console.error("Error fetching post data:", error)
      }
    }

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/admin/all?limit=7`, {
          credentials: 'include',
        })
        const data = await response.json()
        if (response.ok) {
          setComments(data.comments)
          setTotalComments(data.totalComments)
          setLastMonthComments(data.lastMonthComments)
        }
      } catch (error) {
        console.error("Error fetching comment data:", error)
      }
    };
    if (user.isAdmin) {
      fetchUserData()
      fetchPosts()
      fetchComments()
    }
  }, [user])


  return (
    
<div className="p-6 md:mx-auto max-w-7xl bg-gray-50 dark:bg-slate-950 min-h-screen">
      {/* Top Stats */}
      <div className="grid gap-6 md:grid-cols-3 grid-cols-1 mb-10">
        {/* Users */}
        <div className="flex flex-col p-6 bg-white dark:bg-slate-900 gap-4 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm uppercase">Total Users</h3>
              <p className="text-4xl font-extrabold text-gray-800 dark:text-white">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-5xl p-3 shadow-md" />
          </div>
          <div className="flex gap-2 text-sm items-center">
            <span className="text-green-600 flex items-center font-semibold">
              <HiArrowNarrowUp className="mr-1" /> {lastMonthUsers}
            </span>
            <span className="text-gray-500">Last month</span>
          </div>
        </div>

        {/* Comments */}
        <div className="flex flex-col p-6 bg-white dark:bg-slate-900 gap-4 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm uppercase">Total Comments</h3>
              <p className="text-4xl font-extrabold text-gray-800 dark:text-white">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-5xl p-3 shadow-md" />
          </div>
          <div className="flex gap-2 text-sm items-center">
            <span className="text-green-600 flex items-center font-semibold">
              <HiArrowNarrowUp className="mr-1" /> {lastMonthComments}
            </span>
            <span className="text-gray-500">Last month</span>
          </div>
        </div>

        {/* Posts */}
        <div className="flex flex-col p-6 bg-white dark:bg-slate-900 gap-4 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 text-sm uppercase">Total Posts</h3>
              <p className="text-4xl font-extrabold text-gray-800 dark:text-white">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full text-5xl p-3 shadow-md" />
          </div>
          <div className="flex gap-2 text-sm items-center">
            <span className="text-green-600 flex items-center font-semibold">
              <HiArrowNarrowUp className="mr-1" /> {lastMonthPosts}
            </span>
            <span className="text-gray-500">Last month</span>
          </div>
        </div>
      </div>

      {/*  Tables  */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
        {/* Users Table */}
        <div className="flex flex-col w-full shadow-xl rounded-2xl bg-white dark:bg-slate-900 overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
            <h1 className="font-semibold text-lg">Recent Users</h1>
            <Link
              to="/admin/dashUser"
              className="px-3 py-1 text-sm font-medium rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 shadow-md"
            >
              See all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[300px] text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">User Image</th>
                  <th className="px-4 py-2 text-left">Username</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {users?.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-2">
                      <img
                        src={e.profilePicture}
                        alt="user"
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-2 font-medium">{e.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments Table */}
        <div className="flex flex-col w-full shadow-xl rounded-2xl bg-white dark:bg-slate-900 overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
            <h1 className="font-semibold text-lg">Recent Comments</h1>
            <Link
              to="/admin/comments"
              className="px-3 py-1 text-sm font-medium rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 shadow-md"
            >
              See all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[300px] text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Comment</th>
                  <th className="px-4 py-2 text-left">Likes</th>
                  <th className="px-4 py-2 text-left">Blog</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {comments?.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-2 max-w-xs truncate">{e.content}</td>
                    <td className="px-4 py-2 font-medium">{e.likes.length}</td>
                    <td className="px-4 py-2 font-medium">{e.postId.title || 'Deleted Post'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Posts Table */}
        <div className="flex flex-col w-full shadow-xl rounded-2xl bg-white dark:bg-slate-900 overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
            <h1 className="font-semibold text-lg">Recent Posts</h1>
            <Link
              to="/admin/listBlog"
              className="px-3 py-1 text-sm font-medium rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 shadow-md"
            >
              See all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[300px] text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Image</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {posts?.map((e) => (
                  <tr key={e._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-2">
                      <img
                        src={e.image}
                        alt="post"
                        className="w-16 h-12 rounded-lg object-cover border-2 border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2 max-w-xs truncate font-medium">{e.title}</td>
                    <td className="px-4 py-2">{e.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
   

)
}
export default Dashboard