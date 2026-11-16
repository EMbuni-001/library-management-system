
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/books/${id}`);
        setBook(response.data);
      } catch (err) {
        setError('Failed to load book details. The book may not exist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="animate-pulse max-w-2xl mx-auto">
          <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto mb-2"></div>
          <div className="h-32 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        <p className="text-lg mb-4">{error || 'Book not found.'}</p>
        <Link to="/" className="text-blue-600 hover:underline font-medium">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
        &larr; Back to Catalog
      </Link>
      
      <div className="border rounded-lg p-8 shadow-md bg-white">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{book.title}</h1>
        <p className="text-xl text-gray-700 mb-6">by {book.author}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Genre:</span> {book.genre?.name || 'Unknown'}</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold">ISBN:</span> {book.isbn}</p>
            <p className="text-gray-600 mb-2"><span className="font-semibold">Total Copies:</span> {book.totalCopies}</p>
          </div>
          <div>
            {book.description && (
              <p className="text-gray-600"><span className="font-semibold">Description:</span> {book.description}</p>
            )}
          </div>
        </div>

        {book.reviews && book.reviews.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Reviews</h2>
            <div className="space-y-4">
              {book.reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-md border border-gray-100">
                  <div className="flex items-center mb-2">
                    <span className="font-bold text-yellow-500 mr-2">{'★'.repeat(review.rating)}</span>
                    <span className="text-gray-300 text-sm">{'★'.repeat(5 - review.rating)}</span>
                  </div>
                  <p className="text-gray-700 italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDetail;