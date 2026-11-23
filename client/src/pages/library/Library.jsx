import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Search, Plus, Edit, Trash2, BookOpen } from 'lucide-react';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      const res = await api.get('/books', { params });
      setBooks(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing && currentBook) {
        await api.put(`/books/${currentBook._id}`, currentBook);
        toast.success('Book updated');
      } else {
        await api.post('/books', currentBook);
        toast.success('Book created');
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="input-field pl-10 w-full sm:w-96"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">ISBN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="8" className="p-4 text-center text-gray-500">Loading...</td></tr>
              ) : books.length === 0 ? (
                <tr><td colSpan="8" className="p-4 text-center text-gray-500">No books found</td></tr>
              ) : (
                books.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{b.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{b.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{b.isbn}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{b.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{b.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{b.availableQuantity}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${b.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>{b.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(true); setCurrentBook(b); setShowModal(true); }} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(b._id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
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
      toast.error('Failed to save book');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success('Book deleted');
      fetchBooks();
    } catch (err) {
      toast.error('Failed to delete book');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Library Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage school library books</p>
        </div>
        <button onClick={() => { setEditing(false); setCurrentBook(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Book
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? 'Edit Book' : 'Add New Book'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Book Title</label>
                <input className="input-field" value={currentBook?.title || ''} onChange={(e) => setCurrentBook({...currentBook, title: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
                  <input className="input-field" value={currentBook?.author || ''} onChange={(e) => setCurrentBook({...currentBook, author: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ISBN</label>
                  <input className="input-field" value={currentBook?.isbn || ''} onChange={(e) => setCurrentBook({...currentBook, isbn: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <input className="input-field" value={currentBook?.category || ''} onChange={(e) => setCurrentBook({...currentBook, category: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publisher</label>
                  <input className="input-field" value={currentBook?.publisher || ''} onChange={(e) => setCurrentBook({...currentBook, publisher: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                  <input type="number" className="input-field" value={currentBook?.quantity || ''} onChange={(e) => setCurrentBook({...currentBook, quantity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                  <input type="number" className="input-field" value={currentBook?.price || ''} onChange={(e) => setCurrentBook({...currentBook, price: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input className="input-field" value={currentBook?.description || ''} onChange={(e) => setCurrentBook({...currentBook, description: e.target.value})} />
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

export default Library;