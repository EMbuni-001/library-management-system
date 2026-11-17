
import { useReadingList } from '../context/ReadingListContext';

function AddToReadingListButton({ book, className = '' }) {
  const { addBook, removeBook, isInList } = useReadingList();

  if (!book || book.id === undefined) return null;

  const saved = isInList(book.id);

  function handleClick() {
    if (saved) {
      removeBook(book.id);
    } else {
      addBook(book);
    }
  }

  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  const savedStyles = 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50';
  const unsavedStyles = 'bg-slate-900 dark:bg-slate-700 text-white border border-slate-900 dark:border-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${book.title} from your reading list` : `Add ${book.title} to your reading list`}
      className={`${base} ${saved ? savedStyles : unsavedStyles} ${className}`}
    >
      {saved ? 'In reading list' : 'Add to reading list'}
    </button>
  );
}

export default AddToReadingListButton;