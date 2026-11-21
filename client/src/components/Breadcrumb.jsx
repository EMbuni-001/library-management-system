
import { Link } from 'react-router-dom';

// Breadcrumb takes an array of items, each with a label and optional href.
// The last item is rendered as plain text (current page), others as links.
function Breadcrumb({ items }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4 print:hidden">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {isLast ? (
                <span
                  className="font-medium text-slate-700 dark:text-slate-300"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.href}
                    className="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline underline-offset-2 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                  <span
                    className="text-slate-400 dark:text-slate-600"
                    aria-hidden="true"
                  >
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;