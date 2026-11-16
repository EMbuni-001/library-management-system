
import { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from './BookCard';

function BookGrid({ genreId, searchQuery, sortBy }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (genreId) params.genreId = genreId;
        if (searchQuery) params.search = searchQuery;
        params.limit = 50; 

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/books`, { params });
        
        let fetchedBooks = response.data.data || response.data; 
        
        if (sortBy === 'title') {
          fetchedBooks.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'author') {
          fetchedBooks.sort((a, b) => a.author.localeCompare(b.author));
        }

        setBooks(fetchedBooks);
      } catch (err) {
        setError('Failed to load books. Please ensure the backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genreId, searchQuery, sortBy]);

  if (error) {
    return <div className="text-red-500 p-4 text-center font-medium">{error}</div>;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm animate-pulse bg-gray-100">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return <div className="text-gray-500 p-8 text-center text-lg">No books found matching your criteria.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export default BookGrid;