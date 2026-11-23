import { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { BarChart3, Search, Filter, Download, Printer } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('students');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reports = [
    { id: 'students', name: 'Student Report', icon: '👨‍🎓' },
    { id: 'teachers', name: 'Teacher Report', icon: '👨‍🏫' },
    { id: 'attendance', name: 'Attendance Report', icon: '📊' },
    { id: 'exams', name: 'Examination Report', icon: '📝' },
    { id: 'financial', name: 'Financial Report', icon: '💰' },
    { id: 'fees', name: 'Fee Report', icon: '💵' },
    { id: 'classes', name: 'Class Report', icon: '🏫' },
    { id: 'library', name: 'Library Report', icon: '📚' },
    { id: 'staff', name: 'Staff Report', icon: '👥' },
  ];

  const generateReport = async () => {
    try {
      const res = await api.get(`/reports/${reportType}`, {
        params: { startDate, endDate },
      });
      toast.success(`${reportType} report generated`);
    } catch (err) {
      toast.error('Failed to generate report');
    }
  };

  const exportReport = () => {
    toast.info('Exporting report...');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate and export school reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportReport} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r) => (
            <button
              key={r.id}
              onClick={() => setReportType(r.id)}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${reportType === r.id ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <span className="text-2xl">{r.icon}</span>
              <span className="text-sm font-medium">{r.name}</span>
            </button>
          ))}
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                className="input-field w-64"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                className="input-field w-64"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button onClick={generateReport} className="btn-primary py-2 px-6">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;