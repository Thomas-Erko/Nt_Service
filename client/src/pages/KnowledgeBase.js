import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function KnowledgeBase() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log('Fetching blog posts...');
      const response = await fetch('/api/blog/posts');
      const data = await response.json();
      
      if (data.success) {
        console.log('Blog posts fetched:', data.data.length);
        setPosts(data.data);
      } else {
        setError(data.message || 'Failed to fetch posts');
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading knowledge base...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchPosts}
            className="mt-4 px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-100 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Knowledge Base</h1>
          <p className="text-lg text-gray-600">
            Articles, teachings, and resources for the Ethiopian Orthodox Tewahedo Church community
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/knowledge-base/${post.fileId}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-green-800 mb-2">
                    {post.title}
                  </h2>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.summary}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 text-green-700 font-medium text-sm">
                    Read more →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default KnowledgeBase;
