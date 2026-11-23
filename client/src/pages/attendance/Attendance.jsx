import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Search, Calendar, Filter, Download, Printer } from 'lucide-react';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, [date, search]);

  const fetchAttendance = async () => {
    try {
      const params = { date, search };
      const res = await api.get('/attendance', { params });
      setAttendance(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      await api.post('/attendance/mark', { records: [{ studentId, date, status }] });
      toast.success('Attendance marked');
      fetchAttendance();
    } catch (err) {
      toast.error('Failed to mark attendance');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage daily student attendance</p>
        </div>
        <div className="flex gap-2">
          <input type="date" className="input-field w-64" value={date} onChange={(e) => setDate(e.target.value)} />
          <button onClick={() => window.location.href = '/api/attendance/export/csv'} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              className="input-field pl-10 w-full sm:w-96"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">Loading...</td></tr>
              ) : attendance.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No attendance records for this date</td></tr>
              ) : (
                attendance.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{a.student ? a.student.studentId : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{a.student ? a.student.firstName + ' ' + a.student.lastName : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{a.class || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${a.status === 'present' ? 'badge-active' : a.status === 'absent' ? 'badge-inactive' : 'badge-pending'}`}>{a.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => markAttendance(a.student ? a.student._id : '', 'present')} className="p-1 text-green-600 hover:bg-green-50 rounded-lg">
                          <span className="text-xs">Present</span>
                        </button>
                        <button onClick={() => markAttendance(a.student ? a.student._id : '', 'absent')} className="p-1 text-red-600 hover:bg-red-50 rounded-lg">
                          <span className="text-xs">Absent</span>
                        </button>
                        <button onClick={() => markAttendance(a.student ? a.student._id : '', 'late')} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded-lg">
                          <span className="text-xs">Late</span>
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
    </div>
  );
};

export default Attendance;