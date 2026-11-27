
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

function AdminBorrowRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/borrow-requests');
      setRequests(response.data);
    } catch (error) {
      addToast('Failed to load borrow requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/borrow-requests/${id}`, { status });
      addToast(`Request updated to ${status}`, 'success');
      fetchRequests();
    } catch (error) {
      addToast('Failed to update request', 'error');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-6">
        Manage Borrow Requests
      </h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
          <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100">
            <tr>
              <th className="px-4 py-3">Book</th>
              <th className="px-4 py-3">Patron</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Fine</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b dark:border-slate-700">
                <td className="px-4 py-3">
                  <div className="font-medium">{req.bookTitle}</div>
                  <div className="text-xs text-slate-500">{req.bookAuthor}</div>
                </td>
                <td className="px-4 py-3">{req.user?.name || req.user?.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    req.status === 'RETURNED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                    req.status === 'OVERDUE' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {req.dueDate ? new Date(req.dueDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3 font-medium">
                  ${req.fineAmount.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                    className="text-xs border rounded px-2 py-1 bg-white dark:bg-slate-700 dark:border-slate-600"
                  >
                    <option value="REQUESTED">REQUESTED</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="BORROWED">BORROWED</option>
                    <option value="RETURNED">RETURNED</option>
                    <option value="OVERDUE">OVERDUE</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBorrowRequests;