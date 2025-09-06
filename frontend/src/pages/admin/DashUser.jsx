
import React from 'react'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import UserTable from '../../components/admin/UserTable'

export const DashUser = () => {
  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/users/get-users`, {
        credentials: 'include' // Add credentials for authentication
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
        if(data.users.length < 8) {
          setShowMore(false);
        }
      } else {
        setError(data.message || 'Failed to fetch users')
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError('Error fetching users: ' + error.message)
    } finally {
      setLoading(false)
    }
   }

   const handleShowMore = async() => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/users/get-users?startIndex=${startIndex}`, {
        credentials: 'include'
      });
      const data = await res.json();
      
      if(res.ok){
        setUsers((prevUsers) => [...prevUsers, ...data.users]);
        if(data.users.length < 8){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching more users:", error);
    }
   };

   useEffect(() => {
     // Only fetch if user is admin
     if (user && user.isAdmin) {
       fetchUsers()
     }
   }, [user])

   // ✅ Show access denied for non-admin users
   if (!user || !user.isAdmin) {
     return (
       <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
         <div className="bg-red-100 border border-red-300 rounded p-4 text-red-700">
           Access denied. Only administrators can view users.
         </div>
       </div>
     )
   }

   return (
     <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
       <h1 className="text-2xl font-bold mb-4">All Users</h1>
       
       {/* Error Display */}
       {error && (
         <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
           {error}
         </div>
       )}

       {/* Loading State */}
       {loading && (
         <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded text-blue-700">
           Loading users...
         </div>
       )}

       <div className='relative mt-4 h-4/5 max-w-4xl overflow-x-auto shadow rounded-lg bg-white dark:bg-blue-500 dark:border-gray-700'>
         <table className='w-full text-sm text-gray-700'>
           <thead className='text-xs text-gray-600 text-left uppercase bg-gray-50'>
             <tr>
               <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
               <th scope='col' className='px-2 py-4'>User Image</th>
               <th scope='col' className='px-2 py-4'>Username</th>
               <th scope='col' className='px-2 py-4'>Email</th>
               <th scope='col' className='px-2 py-4 max-sm:hidden'>Date Created</th>
               <th scope='col' className='px-2 py-4 max-sm:hidden'>Admin</th>
               <th scope='col' className='px-2 py-4'>Actions</th>
             </tr>
           </thead>
           <tbody>
             {users.length === 0 && !loading ? (
               <tr>
                 <td colSpan="7" className="text-center py-4 text-red-600">
                   No users found
                 </td>
               </tr>
             ) : (
               users.map((singleUser, index) => (
                 <UserTable 
                   key={singleUser._id} 
                   users={singleUser} //  Pass single user object
                   fetchUsers={fetchUsers} 
                   index={index + 1} 
                 />
               ))
             )}
           </tbody>
         </table>
         
         {showMore && users.length > 0 && (
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