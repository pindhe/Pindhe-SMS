import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const getValue = (item, field) => {
  const value = item[field.key];
  if (value == null) return 'N/A';
  if (typeof value === 'object') return value.name || value._id || 'N/A';
  if (field.type === 'date' && value) return new Date(value).toLocaleDateString();
  return String(value);
};

const GenericCrudPage = ({ title, description, endpoint, fields, dateField }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState({});

  const fetchItems = async () => {
    try {
      const response = await api.get(endpoint, { params: search ? { search } : {} });
      setItems(response.data.data || []);
    } catch (error) {
      toast.error(`Failed to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  useEffect(() => {
    const timeout = window.setTimeout(fetchItems, 300);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const openCreate = () => {
    setEditing(false);
    setCurrent(Object.fromEntries(fields.map((field) => [field.key, field.default ?? ''])));
    setShowModal(true);
  };

  const openEdit = (item) => {
    const values = { ...item };
    fields.forEach((field) => {
      if (field.type === 'date' && values[field.key]) {
        values[field.key] = String(values[field.key]).slice(0, 10);
      }
      if (typeof values[field.key] === 'object' && values[field.key]?._id) {
        values[field.key] = values[field.key]._id;
      }
    });
    setEditing(true);
    setCurrent(values);
    setShowModal(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await api.put(`${endpoint}/${current._id}`, current);
        toast.success(`${title} updated`);
      } else {
        await api.post(endpoint, current);
        toast.success(`${title} created`);
      }
      setShowModal(false);
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to save ${title.toLowerCase()}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      toast.success(`${title} deleted`);
      fetchItems();
    } catch (error) {
      toast.error(`Failed to delete ${title.toLowerCase()}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {fields.map((field) => (
                  <th key={field.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    {field.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={fields.length + 1} className="p-4 text-center text-gray-500">Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={fields.length + 1} className="p-4 text-center text-gray-500">No records found</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {fields.map((field) => (
                      <td key={field.key} className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {getValue(item, field)}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {editing ? `Edit ${title}` : `Add ${title}`}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                    {field.options ? (
                      <select
                        className="select-field"
                        value={current[field.key] || field.default || ''}
                        onChange={(event) => setCurrent({ ...current, [field.key]: event.target.value })}
                        required={field.required}
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        className="input-field"
                        value={current[field.key] || ''}
                        onChange={(event) => setCurrent({ ...current, [field.key]: event.target.value })}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
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

export default GenericCrudPage;
