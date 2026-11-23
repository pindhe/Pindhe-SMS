import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Search, Plus, Edit, Trash2, Download } from 'lucide-react';

const emptyStudent = {
  studentId: '',
  admissionNumber: '',
  firstName: '',
  lastName: '',
  gender: 'male',
  dateOfBirth: '',
  parentPhone: '',
  class: '',
  academicYear: new Date().getFullYear().toString(),
  status: 'active',
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(emptyStudent);

  const fetchStudents = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (filter !== 'all') params.status = filter;
      const response = await api.get('/students', { params });
      setStudents(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filter]);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await api.put(`/students/${currentStudent._id}`, currentStudent);
        toast.success('Student updated');
      } else {
        await api.post('/students', currentStudent);
        toast.success('Student created');
      }
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save student');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const openCreate = () => {
    setEditing(false);
    setCurrentStudent({ ...emptyStudent });
    setShowModal(true);
  };

  const openEdit = (student) => {
    setEditing(true);
    setCurrentStudent({
      ...student,
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : '',
    });
    setShowModal(true);
  };

  const visibleStudents = students.filter((student) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return `${student.firstName || ''} ${student.lastName || ''} ${student.studentId || ''}`
      .toLowerCase()
      .includes(term);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage student records</p>
        </div>
        <div className="flex gap-2">
          <a href="/api/students/export/csv" className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </a>
          <button type="button" onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search students..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            className="select-field"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Parent Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td></tr>
              ) : visibleStudents.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-gray-500">No students found</td></tr>
              ) : (
                visibleStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{student.studentId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {typeof student.class === 'object' ? student.class?.name : student.class || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.parentPhone || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        student.status === 'active'
                          ? 'badge-active'
                          : student.status === 'inactive'
                            ? 'badge-inactive'
                            : 'badge-pending'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEdit(student)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(student._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
              {editing ? 'Edit Student' : 'Add New Student'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input className="input-field" value={currentStudent.firstName} onChange={(event) => setCurrentStudent({ ...currentStudent, firstName: event.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input className="input-field" value={currentStudent.lastName} onChange={(event) => setCurrentStudent({ ...currentStudent, lastName: event.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Student ID</label>
                  <input className="input-field" value={currentStudent.studentId} onChange={(event) => setCurrentStudent({ ...currentStudent, studentId: event.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Admission Number</label>
                  <input className="input-field" value={currentStudent.admissionNumber} onChange={(event) => setCurrentStudent({ ...currentStudent, admissionNumber: event.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input type="date" className="input-field" value={currentStudent.dateOfBirth} onChange={(event) => setCurrentStudent({ ...currentStudent, dateOfBirth: event.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select className="select-field" value={currentStudent.gender} onChange={(event) => setCurrentStudent({ ...currentStudent, gender: event.target.value })}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Class ID</label>
                  <input className="input-field" value={typeof currentStudent.class === 'object' ? currentStudent.class?._id : currentStudent.class} onChange={(event) => setCurrentStudent({ ...currentStudent, class: event.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Academic Year</label>
                  <input className="input-field" value={currentStudent.academicYear} onChange={(event) => setCurrentStudent({ ...currentStudent, academicYear: event.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Parent Phone</label>
                  <input className="input-field" value={currentStudent.parentPhone || ''} onChange={(event) => setCurrentStudent({ ...currentStudent, parentPhone: event.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="select-field" value={currentStudent.status} onChange={(event) => setCurrentStudent({ ...currentStudent, status: event.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="graduated">Graduated</option>
                  </select>
                </div>
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

export default Students;
