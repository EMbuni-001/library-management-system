
import { Link } from 'react-router-dom';

function BookCard({ book }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
      <h3 className="text-lg font-bold mb-2 text-gray-900">{book.title}</h3>
      <p className="text-gray-600 mb-1">by {book.author}</p>
      <p className="text-sm text-gray-500 mb-3">Genre: {book.genre?.name || 'Unknown'}</p>
      <Link 
        to={`/books/${book.id}`} 
        className="text-blue-600 hover:underline text-sm font-medium"
      >
        View Details
      </Link>
    </div>
  );
}

export default BookCard;