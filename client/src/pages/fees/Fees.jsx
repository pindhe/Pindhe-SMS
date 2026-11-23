import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

const emptyFee = {
  student: '',
  category: 'tuition',
  amount: '',
  dueDate: '',
  academicYear: new Date().getFullYear().toString(),
  status: 'unpaid',
  description: '',
};

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentFee, setCurrentFee] = useState(emptyFee);

  const fetchFees = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      const response = await api.get('/fees', { params });
      setFees(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load fees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [filter]);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await api.put(`/fees/${currentFee._id}`, currentFee);
        toast.success('Fee updated');
      } else {
        await api.post('/fees', currentFee);
        toast.success('Fee created');
      }
      setShowModal(false);
      fetchFees();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save fee');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee record?')) return;
    try {
      await api.delete(`/fees/${id}`);
      toast.success('Fee deleted');
      fetchFees();
    } catch (error) {
      toast.error('Failed to delete fee');
    }
  };

  const openCreate = () => {
    setEditing(false);
    setCurrentFee({ ...emptyFee });
    setShowModal(true);
  };

  const openEdit = (fee) => {
    setEditing(true);
    setCurrentFee({
      ...fee,
      student: typeof fee.student === 'object' ? fee.student?._id : fee.student,
      dueDate: fee.dueDate ? fee.dueDate.slice(0, 10) : '',
    });
    setShowModal(true);
  };

  const visibleFees = fees.filter((fee) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    const studentName = typeof fee.student === 'object'
      ? `${fee.student?.firstName || ''} ${fee.student?.lastName || ''}`
      : '';
    return `${studentName} ${fee.category || ''}`.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fees & Payments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage student fees and payments</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Fee
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search fees..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select className="select-field" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td></tr>
              ) : visibleFees.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">No fees found</td></tr>
              ) : (
                visibleFees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {typeof fee.student === 'object' ? `${fee.student?.firstName || ''} ${fee.student?.lastName || ''}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{fee.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">${fee.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        fee.status === 'paid'
                          ? 'badge-active'
                          : fee.status === 'unpaid'
                            ? 'badge-inactive'
                            : 'badge-pending'
                      }`}>
                        {fee.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEdit(fee)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(fee._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? 'Edit Fee' : 'Add New Fee'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student ID</label>
                <input className="input-field" value={typeof currentFee.student === 'object' ? currentFee.student?._id : currentFee.student} onChange={(event) => setCurrentFee({ ...currentFee, student: event.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select className="select-field" value={currentFee.category} onChange={(event) => setCurrentFee({ ...currentFee, category: event.target.value })}>
                    <option value="tuition">Tuition</option>
                    <option value="registration">Registration</option>
                    <option value="examination">Examination</option>
                    <option value="library">Library</option>
                    <option value="transport">Transport</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input type="number" min="0" className="input-field" value={currentFee.amount} onChange={(event) => setCurrentFee({ ...currentFee, amount: event.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input type="date" className="input-field" value={currentFee.dueDate} onChange={(event) => setCurrentFee({ ...currentFee, dueDate: event.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Academic Year</label>
                <input className="input-field" value={currentFee.academicYear} onChange={(event) => setCurrentFee({ ...currentFee, academicYear: event.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="select-field" value={currentFee.status} onChange={(event) => setCurrentFee({ ...currentFee, status: event.target.value })}>
                  <option value="paid">Paid</option>
                  <option value="partially_paid">Partially Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input className="input-field" value={currentFee.description || ''} onChange={(event) => setCurrentFee({ ...currentFee, description: event.target.value })} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;
