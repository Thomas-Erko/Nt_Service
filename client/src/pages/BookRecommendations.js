import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BookRecommendations() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, selectedGenre, selectedDifficulty, selectedLanguage, selectedAuthor, searchQuery]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      
      if (data.success) {
        setBooks(data.data);
      } else {
        setError(data.message || 'Failed to fetch books');
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(book => book.difficulty === selectedDifficulty);
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(book => book.language === selectedLanguage);
    }

    if (selectedAuthor !== 'all') {
      filtered = filtered.filter(book => book.author === selectedAuthor);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.synopsis.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(filtered);
  };

  const getUniqueValues = (field) => {
    return ['all', ...new Set(books.map(book => book[field]).filter(Boolean))];
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    const numRating = Number(rating) || 0;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= numRating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book recommendations...</p>
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
            onClick={fetchBooks}
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
          <Link 
            to="/resources"
            className="inline-flex items-center text-green-700 hover:text-green-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Resources
          </Link>
          <h1 className="text-4xl font-bold text-green-800 mb-4">Book Recommendations</h1>
          <p className="text-lg text-gray-600">
            Curated spiritual books, Orthodox literature, and educational materials for the EOTC community
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search books
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {getUniqueValues('genre').map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {getUniqueValues('difficulty').map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {getUniqueValues('language').map((language) => (
                  <option key={language} value={language}>
                    {language === 'all' ? 'All Languages' : language}
                  </option>
                ))}
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {getUniqueValues('author').map((author) => (
                  <option key={author} value={author}>
                    {author === 'all' ? 'All Authors' : author}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredBooks.length} of {books.length} books
          </p>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No books found. Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Cover Image */}
                {book.coverImage && (
                  <div className="h-64 bg-gray-200 overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Book Details */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-green-800 mb-2">
                    {book.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-2">
                    by {book.author} {book.year && `(${book.year})`}
                  </p>

                  {/* Rating */}
                  {book.rating && (
                    <div className="mb-3">
                      {renderStars(book.rating)}
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {book.difficulty && (
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(book.difficulty)}`}>
                        {book.difficulty}
                      </span>
                    )}
                    {book.language && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        {book.language}
                      </span>
                    )}
                    {book.pages && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                        {book.pages} pages
                      </span>
                    )}
                  </div>

                  {/* Synopsis */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {book.synopsis}
                  </p>

                  {/* Why Read */}
                  {book.whyRead && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Why Read:</strong> {book.whyRead}
                      </p>
                    </div>
                  )}

                  {/* EOTC Relevance */}
                  {book.eotcRelevance && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700">
                        <strong>EOTC Relevance:</strong> {book.eotcRelevance}
                      </p>
                    </div>
                  )}

                  {/* Link */}
                  {book.link && (
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-700 hover:text-green-900 font-medium"
                    >
                      View Book
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookRecommendations;
