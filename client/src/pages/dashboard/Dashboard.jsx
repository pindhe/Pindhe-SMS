import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import {
  Users,
  User,
  GraduationCap,
  CreditCard,
  Clock,
  BarChart3,
  TrendingUp,
  Mail,
  Calendar,
  Activity,
} from 'lucide-react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalParents: 0,
    totalStaff: 0,
    totalRevenue: 0,
    pendingFees: 0,
    todayAttendance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentsRes, teachersRes, classesRes, parentsRes, staffRes, feesRes, attendanceRes] =
          await Promise.all([
            api.get('/students'),
            api.get('/teachers'),
            api.get('/classes'),
            api.get('/parents'),
            api.get('/staff'),
            api.get('/fees'),
            api.get('/attendance'),
          ]);

        const students = studentsRes.data.data || [];
        const fees = feesRes.data.data || [];
        const attendance = attendanceRes.data.data || [];

        setStats({
          totalStudents: students.length,
          totalTeachers: teachersRes.data.data?.length || 0,
          totalClasses: classesRes.data.data?.length || 0,
          totalParents: parentsRes.data.data?.length || 0,
          totalStaff: staffRes.data.data?.length || 0,
          totalRevenue: fees.reduce((sum, fee) => sum + (Number(fee.amount) || 0), 0),
          pendingFees: fees.filter((fee) => fee.status === 'unpaid').length,
          todayAttendance: attendance.filter((item) => item.status === 'present').length,
        });
        setRecentStudents(students.slice(0, 5));
        setRecentActivities([
          { id: 1, title: 'New student registered', time: '5 minutes ago', icon: Users, color: 'text-primary-600' },
          { id: 2, title: 'Fee payment received', time: '1 hour ago', icon: CreditCard, color: 'text-green-600' },
          { id: 3, title: 'Attendance marked for Grade 5', time: '2 hours ago', icon: Calendar, color: 'text-blue-600' },
          { id: 4, title: 'New school announcement', time: '4 hours ago', icon: Mail, color: 'text-purple-600' },
        ]);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Teachers', value: stats.totalTeachers, icon: User, color: 'bg-green-50 text-green-600' },
    { label: 'Total Classes', value: stats.totalClasses, icon: GraduationCap, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Parents', value: stats.totalParents, icon: Mail, color: 'bg-orange-50 text-orange-600' },
    { label: 'Total Staff', value: stats.totalStaff, icon: User, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue}`, icon: CreditCard, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Fees', value: stats.pendingFees, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: "Today's Attendance", value: stats.todayAttendance, icon: Activity, color: 'bg-rose-50 text-rose-600' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back to Pindhe SMS</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Export Report
          </button>
          <button type="button" className="btn-primary flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> View Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Student Growth</h3>
          <div className="h-64">
            <Bar
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                  label: 'New Students',
                  data: [12, 19, 15, 25, 22, 30],
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 1,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h3>
          <div className="h-64">
            <Line
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                  label: 'Revenue',
                  data: [500, 800, 600, 1200, 900],
                  borderColor: 'rgba(59, 130, 246, 1)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4,
                  fill: true,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Attendance Status</h3>
          <div className="h-64 flex items-center justify-center">
            <Pie
              data={{
                labels: ['Present', 'Absent', 'Late'],
                datasets: [{
                  data: [85, 10, 5],
                  backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'],
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#64748b' } },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Recent Activities
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Registrations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400">
                  <th className="pb-2 text-left">Student</th>
                  <th className="pb-2 text-left">Class</th>
                  <th className="pb-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student) => (
                  <tr key={student._id} className="border-b border-gray-50 dark:border-gray-700">
                    <td className="py-2 text-gray-900 dark:text-white">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="py-2 text-gray-600 dark:text-gray-400">{student.class || 'N/A'}</td>
                    <td className="py-2 text-gray-600 dark:text-gray-400">
                      {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
                {!recentStudents.length && (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500 dark:text-gray-400">
                      No recent registrations
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
