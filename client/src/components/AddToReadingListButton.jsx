
import { useReadingList } from '../context/ReadingListContext';

function AddToReadingListButton({ book, className = '' }) {
  const { addBook, removeBook, isInList } = useReadingList();

  if (!book || book.id === undefined) {
    return null;
  }

  const saved = isInList(book.id);

  function handleClick() {
    if (saved) {
      removeBook(book.id);
    } else {
      addBook(book);
    }
  }

  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800';

  const savedStyles =
    'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-500 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50';
  
  const unsavedStyles =
    'border-teal-600 bg-teal-600 text-white hover:border-teal-700 hover:bg-teal-700 focus-visible:ring-teal-500 dark:border-teal-500 dark:bg-teal-500 dark:hover:border-teal-600 dark:hover:bg-teal-600';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={
        saved
          ? `Remove ${book.title} from your reading list`
          : `Add ${book.title} to your reading list`
      }
      className={`${base} ${saved ? savedStyles : unsavedStyles} ${className}`}
    >
      {saved ? 'In reading list' : 'Add to reading list'}
    </button>
  );
}

export default AddToReadingListButton;