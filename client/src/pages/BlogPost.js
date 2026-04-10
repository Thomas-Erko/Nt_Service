import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      console.log('Fetching blog post content for ID:', id);
      const response = await fetch(`/api/blog/post/${id}`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Blog post content fetched');
        setContent(data.content);
        setPost({ fileName: data.fileName });
      } else {
        setError(data.message || 'Failed to fetch post');
      }
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError('Failed to load post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/knowledge-base')}
            className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-900"
          >
            Back to Knowledge Base
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-100 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-xl shadow-md p-8 md:p-12">
          {/* Markdown Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-4xl font-bold text-green-800 mb-6" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-3xl font-bold text-green-800 mt-8 mb-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-green-700 mt-6 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-700 mb-4 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 text-gray-700" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 text-gray-700" {...props} />,
                li: ({node, ...props}) => <li className="mb-2" {...props} />,
                a: ({node, ...props}) => <a className="text-green-700 hover:text-green-900 underline" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-green-700 pl-4 italic text-gray-600 my-4" {...props} />
                ),
                code: ({node, inline, ...props}) => 
                  inline ? (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />
                  ) : (
                    <code className="block bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4" {...props} />
                  ),
                img: ({node, ...props}) => (
                  <img className="rounded-lg my-6 max-w-full h-auto" alt="" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}

export default BlogPost;
