
// import { Button, Select, TextInput } from 'flowbite-react';
// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import PostCard from '../components/PostCard';

// export default function Search() {
//     const [sidebarData, setSidebarData] = useState({
//         searchTerm: '',
//         sort: 'desc',
//         category: 'uncategorized',
//     });

//     console.log(sidebarData);
//     const [posts, setPosts] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [showMore, setShowMore] = useState(false);

//     const location = useLocation();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const urlParams = new URLSearchParams(location.search);
//         const searchTermFromUrl = urlParams.get('searchTerm');
//         const sortFromUrl = urlParams.get('sort');
//         const categoryFromUrl = urlParams.get('category');
        
//         if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
//             setSidebarData({
//                 ...sidebarData,
//                 searchTerm: searchTermFromUrl || '',
//                 sort: sortFromUrl || 'desc',
//                 category: categoryFromUrl || 'uncategorized',
//             });
//         }

//         const fetchPosts = async () => {
//             setLoading(true);
//             const searchQuery = urlParams.toString();
//             const res = await fetch(`/api/posts/post-list?${searchQuery}`, {
//                 credentials: 'include'
//             });
//             if (!res.ok) {
//                 setLoading(false);
//                 return;
//             }
//             if (res.ok) {
//                 const data = await res.json();
//                 setPosts(data.posts);
//                 setLoading(false);
//                 if (data.posts.length === 8) {
//                     setShowMore(true);
//                 } else {
//                     setShowMore(false);
//                 }
//             }
//         };
//         fetchPosts();
//     }, [location.search]);

//     const handleChange = (e) => {
//         if (e.target.id === 'searchTerm') {
//             setSidebarData({ ...sidebarData, searchTerm: e.target.value });
//         }
//         if (e.target.id === 'sort') {
//             const order = e.target.value || 'desc';
//             setSidebarData({ ...sidebarData, sort: order });
//         }
//         if (e.target.id === 'category') {
//             const category = e.target.value || 'uncategorized';
//             setSidebarData({ ...sidebarData, category });
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const urlParams = new URLSearchParams(location.search);
//         urlParams.set('searchTerm', sidebarData.searchTerm);
//         urlParams.set('sort', sidebarData.sort);
//         urlParams.set('category', sidebarData.category);
//         const searchQuery = urlParams.toString();
//         navigate(`/search?${searchQuery}`);
//     };

//     const handleShowMore = async () => {
//         const numberOfPosts = posts.length;
//         const startIndex = numberOfPosts;
//         const urlParams = new URLSearchParams(location.search);
//         urlParams.set('startIndex', startIndex);
//         const searchQuery = urlParams.toString();
        
//         const res = await fetch(`/api/posts/post-list?${searchQuery}`, {
//             credentials: 'include'
//         });
        
//         if (!res.ok) {
//             return;
//         }
//         if (res.ok) {
//             const data = await res.json();
//             setPosts([...posts, ...data.posts]);
//             if (data.posts.length === 8) {
//                 setShowMore(true);
//             } else {
//                 setShowMore(false);
//             }
//         }
//     };

//     return (
//         <div className='flex flex-col md:flex-row'>
//             <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
//                 <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
//                     <div className='flex items-center gap-2'>
//                         <label className='whitespace-nowrap font-semibold'>
//                             Search Term:
//                         </label>
//                         <TextInput
//                             placeholder='Search'
//                             id='searchTerm'
//                             type='text'
//                             value={sidebarData.searchTerm || ''}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div className='flex items-center gap-2'>
//                         <label className='font-semibold'>Sort:</label>
//                         <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
//                             <option value='desc'>Latest</option>
//                             <option value='asc'>Oldest</option>
//                         </Select>
//                     </div>
//                     <div className='flex items-center gap-2'>
//                         <label className='font-semibold'>Category:</label>
//                         <Select
//                             onChange={handleChange}
//                             value={sidebarData.category}
//                             id='category'
//                         >
//                             <option value='All'>All</option>
//                             <option value='Technology'>Technology</option>
//                             <option value='Startup'>Startup</option>
//                             <option value='Business'>Business</option>
//                             <option value="Finance">Finance</option>
//                             <option value='Lifestyle'>Lifestyle</option>
//                             <option value='Miscellaneous'>Miscellaneous</option>
//                         </Select>
//                     </div>
//                     <Button type='submit' outline gradientDuoTone='purpleToPink'>
//                         Apply Filters
//                     </Button>
//                 </form>
//             </div>
//             <div className='w-full'>
//                 <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
//                     Posts results:
//                 </h1>
//                 <div className='p-7 flex flex-wrap gap-4'>
//                     {!loading && posts.length === 0 && (
//                         <p className='text-xl text-gray-500'>No posts found.</p>
//                     )}
//                     {loading && <p className='text-xl text-gray-500'>Loading...</p>}
//                     {!loading &&
//                         posts &&
//                         posts.map((post) => <PostCard key={post._id} post={post} />)}
//                     {showMore && (
//                         <button
//                             onClick={handleShowMore}
//                             className='text-teal-500 text-lg hover:underline p-7 w-full'
//                         >
//                             Show More
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        
        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl || '',
                sort: sortFromUrl || 'desc',
                category: categoryFromUrl || 'uncategorized',
            });
        }

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/posts/post-list?${searchQuery}`, {
                credentials: 'include'
            });
            if (!res.ok) {
                setLoading(false);
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);
                if (data.posts.length === 8) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        };
        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }
        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc';
            setSidebarData({ ...sidebarData, sort: order });
        }
        if (e.target.id === 'category') {
            const category = e.target.value || 'uncategorized';
            setSidebarData({ ...sidebarData, category });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        
        const res = await fetch(`/api/posts/post-list?${searchQuery}`, {
            credentials: 'include'
        });
        
        if (!res.ok) {
            return;
        }
        if (res.ok) {
            const data = await res.json();
            setPosts([...posts, ...data.posts]);
            if (data.posts.length === 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
            <div className='flex flex-col lg:flex-row max-w-7xl mx-auto'>
                {/* Sidebar */}
                <div className='lg:w-80 bg-white shadow-xl border-r border-blue-100 lg:min-h-screen'>
                    <div className='p-8'>
                        <h2 className='text-2xl font-bold text-blue-900 mb-8 flex items-center'>
                            <svg className='w-6 h-6 mr-2 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
                            </svg>
                            Search Filters
                        </h2>
                        
                        <form className='space-y-6' onSubmit={handleSubmit}>
                            {/* Search Term */}
                            <div className='space-y-2'>
                                <label className='block text-sm font-semibold text-blue-900'>
                                    Search Term
                                </label>
                                <div className='relative'>
                                    <input
                                        placeholder='Enter keywords...'
                                        id='searchTerm'
                                        type='text'
                                        value={sidebarData.searchTerm || ''}
                                        onChange={handleChange}
                                        className='w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/50 text-blue-900 placeholder-blue-400 transition-colors'
                                    />
                                    <svg className='absolute right-3 top-3.5 w-5 h-5 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Sort */}
                            <div className='space-y-2'>
                                <label className='block text-sm font-semibold text-blue-900'>Sort By</label>
                                <select 
                                    onChange={handleChange} 
                                    value={sidebarData.sort} 
                                    id='sort'
                                    className='w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/50 text-blue-900'
                                >
                                    <option value='desc'>Latest First</option>
                                    <option value='asc'>Oldest First</option>
                                </select>
                            </div>

                            {/* Category */}
                            <div className='space-y-2'>
                                <label className='block text-sm font-semibold text-blue-900'>Category</label>
                                <select
                                    onChange={handleChange}
                                    value={sidebarData.category}
                                    id='category'
                                    className='w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/50 text-blue-900'
                                >
                                    <option value='All'>All Categories</option>
                                    <option value='Technology'>Technology</option>
                                    <option value='Startup'>Startup</option>
                                    <option value='Business'>Business</option>
                                    <option value='Finance'>Finance</option>
                                    <option value='Lifestyle'>Lifestyle</option>
                                    <option value='Miscellaneous'>Miscellaneous</option>
                                </select>
                            </div>

                            {/* Apply Button */}
                            <button 
                                type='submit' 
                                className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center space-x-2'
                            >
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'></path>
                                </svg>
                                <span>Apply Filters</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Main Content */}
                <div className='flex-1 p-8'>
                    {/* Header */}
                    <div className='mb-8'>
                        <h1 className='text-3xl md:text-4xl font-bold text-blue-900 mb-2'>
                            Search Results
                        </h1>
                        <p className='text-blue-600'>
                            {!loading && posts.length > 0 && `Found ${posts.length} article${posts.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>

                    {/* Results */}
                    <div className='space-y-8'>
                        {!loading && posts.length === 0 && (
                            <div className='text-center py-16'>
                                <div className='max-w-md mx-auto'>
                                    <svg className='w-16 h-16 text-blue-300 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.006-5.324-2.291M15 17H9v-2.5a3.5 3.5 0 017 0V17z'></path>
                                    </svg>
                                    <h3 className='text-xl font-semibold text-blue-800 mb-2'>No posts found</h3>
                                    <p className='text-blue-600 mb-6'>Try adjusting your search criteria or browse all categories.</p>
                                    <button 
                                        onClick={() => {
                                            setSidebarData({searchTerm: '', sort: 'desc', category: 'All'});
                                            navigate('/search');
                                        }}
                                        className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {loading && (
                            <div className='text-center py-16'>
                                <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600'></div>
                                <p className='text-blue-600 mt-4 text-lg'>Loading articles...</p>
                            </div>
                        )}
                        
                        {!loading && posts && posts.length > 0 && (
                            <>
                                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
                                    {posts.map((post) => (
                                        <PostCard key={post._id} post={post} />
                                    ))}
                                </div>
                                
                                {showMore && (
                                    <div className='text-center pt-8'>
                                        <button
                                            onClick={handleShowMore}
                                            className='bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg'
                                        >
                                            Load More Articles
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}