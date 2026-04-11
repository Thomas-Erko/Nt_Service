import React from 'react';
import { Link } from 'react-router-dom';

function Resources() {
  const resourceCategories = [
    {
      title: 'Knowledge Base',
      description: 'Articles, teachings, and resources for the Ethiopian Orthodox Tewahedo Church community',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      link: '/knowledge-base',
      available: true,
      badge: 'Active'
    },
    {
      title: 'Book Recommendations',
      description: 'Curated list of spiritual books, Orthodox literature, and educational materials',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      link: '/book-recommendations',
      available: true,
      badge: 'Active'
    },
    {
      title: 'Youth Groups',
      description: 'Resources, activities, and materials for youth ministry and Sunday school programs',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      link: '#',
      available: false,
      badge: 'Coming Soon'
    },
    {
      title: 'Template Documents',
      description: 'Downloadable templates for church administration, events, and community activities',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      link: '#',
      available: false,
      badge: 'Coming Soon'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-100 to-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Resources</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Access a variety of resources to support your spiritual journey, church activities, and community engagement.
          </p>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {resourceCategories.map((category, index) => (
            category.available ? (
              <Link
                key={index}
                to={category.link}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-start gap-6">
                  <div className="text-green-700 group-hover:text-green-800 transition-colors">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-green-800 group-hover:text-green-900">
                        {category.title}
                      </h2>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        {category.badge}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-green-700 font-medium group-hover:text-green-900">
                      Explore
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-8 opacity-75 cursor-not-allowed"
              >
                <div className="flex items-start gap-6">
                  <div className="text-gray-400">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-700">
                        {category.title}
                      </h2>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                        {category.badge}
                      </span>
                    </div>
                    <p className="text-gray-500 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-gray-400 font-medium">
                      Coming Soon
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-green-50 rounded-xl p-8 border border-green-100">
          <h3 className="text-xl font-bold text-green-800 mb-3">
            More Resources Coming Soon
          </h3>
          <p className="text-gray-700">
            We're continuously working to expand our resource library. Check back regularly for new additions including book recommendations, youth group materials, and downloadable templates to support your church community.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Resources;
